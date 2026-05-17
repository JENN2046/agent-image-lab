#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "tests/schema_examples/pvos_kernel_input.example.json";

const guardDefaults = Object.freeze({
  provider_contact_allowed: false,
  plugin_call_allowed: false,
  api_call_allowed: false,
  daily_note_write_allowed: false,
  vcp_memory_write_allowed: false,
  image_generation_allowed: false,
  disk_write_allowed: false,
  external_manifest_read_allowed: false,
  external_repo_read_allowed: false,
});

const performedDefaults = Object.freeze({
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  image_generation_performed: false,
  disk_write_performed: false,
  accepted_samples_write_performed: false,
  external_manifest_read_performed: false,
  vcpchat_source_read_performed: false,
  vcptoolbox_source_read_performed: false,
});

const domainModelRefs = Object.freeze([
  "ShotPlan",
  "Shot",
  "PromptLineage",
  "ImageCandidate",
  "ReviewRubric",
  "VisualEvalDecision",
  "FailureTaxonomy",
  "AcceptedSample",
  "RejectedSample",
  "ReviewReport",
  "ProvenanceRecord",
  "EvalSeed",
  "RunManifest",
]);

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertUniqueId(value, seen, label) {
  assertString(value, label);
  if (seen.has(value)) {
    throw new Error(`${label} must be unique: ${value}`);
  }
  seen.add(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSafeMetadataArtifactRef(candidate) {
  const label = `candidate ${candidate.candidate_id}`;
  assertString(candidate.artifact_ref, `${label} artifact_ref`);
  const artifactKind = candidate.artifact_ref_kind || "metadata_only_reference";
  if (artifactKind !== "metadata_only_reference") {
    throw new Error(`${label} artifact_ref_kind must be metadata_only_reference`);
  }

  const ref = candidate.artifact_ref;
  const forbiddenPatterns = [
    { id: "windows_absolute_path", pattern: /[A-Za-z]:[\\/]/ },
    { id: "rooted_path", pattern: /^[\\/]/ },
    { id: "path_traversal", pattern: /\.\./ },
    { id: "path_separator", pattern: /[\\/]/ },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "env_or_config", pattern: /\.env|config\.env/i },
    { id: "image_binary_extension", pattern: /\.(png|jpe?g|webp|gif|psd|tiff?|bmp|heic)\b/i },
    { id: "real_generation_run", pattern: /runs[\\/]real_generation/i },
    { id: "accepted_samples_path", pattern: /accepted_samples[\\/]/i },
    {
      id: "sensitive_artifact_marker",
      pattern: /provider_payload|image_binary|private_path|memory_write_path|daily_note_write_path|external_manifest/i,
    },
  ];
  const matched = forbiddenPatterns.find((rule) => rule.pattern.test(ref));
  if (matched) {
    throw new Error(`${label} artifact_ref contains forbidden ${matched.id}`);
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(ref)) {
    throw new Error(`${label} artifact_ref must be an opaque metadata token`);
  }
}

function sumWeightedScore(candidate, rubric) {
  const dimensions = rubric.dimensions || [];
  const weightedTotal = dimensions.reduce((total, dimension) => {
    const score = Number(candidate.scores?.[dimension.id] ?? 0);
    const weight = Number(dimension.weight ?? 0);
    return total + score * weight;
  }, 0);
  const weightTotal = dimensions.reduce((total, dimension) => total + Number(dimension.weight ?? 0), 0);
  if (weightTotal <= 0) return 0;
  return Number((weightedTotal / weightTotal).toFixed(2));
}

function buildCandidateDecision(candidate, rubric, taxonomyTags) {
  const weightedScore = sumWeightedScore(candidate, rubric);
  const failureTags = Array.isArray(candidate.failure_tags) ? candidate.failure_tags : [];
  const unknownFailureTags = failureTags.filter((tag) => !taxonomyTags.has(tag));
  const accepted = weightedScore >= Number(rubric.accept_threshold) && failureTags.length === 0;
  const rejected = weightedScore < Number(rubric.reject_below) || failureTags.length > 0;
  const decision = accepted ? "accepted_candidate_reference" : "rejected_candidate_reference";

  return {
    candidate_id: candidate.candidate_id,
    shot_id: candidate.shot_id,
    weighted_score: weightedScore,
    decision,
    accepted,
    rejected,
    failure_tags: failureTags,
    unknown_failure_tags: unknownFailureTags,
    rationale: accepted
      ? "Candidate meets threshold and has no mapped failure tags."
      : "Candidate requires rejection or revision based on score threshold or mapped failure tags.",
  };
}

function normalizeInput(input) {
  assertObject(input, "input");
  assertString(input.task_id, "input.task_id");
  assertObject(input.brief, "input.brief");
  assertObject(input.shot_plan, "input.shot_plan");
  assertObject(input.prompt_lineage, "input.prompt_lineage");
  assertObject(input.review_rubric, "input.review_rubric");
  assertObject(input.eval_seed, "input.eval_seed");
  if (!Array.isArray(input.candidates) || input.candidates.length === 0) {
    throw new Error("input.candidates must contain at least one candidate");
  }
  if (!Array.isArray(input.shot_plan.shots) || input.shot_plan.shots.length === 0) {
    throw new Error("input.shot_plan.shots must contain at least one shot");
  }
  if (!Array.isArray(input.review_rubric.dimensions) || input.review_rubric.dimensions.length === 0) {
    throw new Error("input.review_rubric.dimensions must contain at least one dimension");
  }

  const shotIds = new Set();
  for (const shot of input.shot_plan.shots) {
    assertUniqueId(shot.shot_id, shotIds, "shot.shot_id");
  }

  const dimensionIds = new Set();
  for (const dimension of input.review_rubric.dimensions) {
    assertUniqueId(dimension.id, dimensionIds, "review_rubric.dimension.id");
  }

  const taxonomy = Array.isArray(input.failure_taxonomy) ? input.failure_taxonomy : [];
  const taxonomyTags = new Set();
  for (const entry of taxonomy) {
    assertUniqueId(entry.tag, taxonomyTags, "failure_taxonomy.tag");
  }

  const candidateIds = new Set();
  for (const candidate of input.candidates) {
    assertUniqueId(candidate.candidate_id, candidateIds, "candidate.candidate_id");
    assertString(candidate.shot_id, `candidate ${candidate.candidate_id} shot_id`);
    if (!shotIds.has(candidate.shot_id)) {
      throw new Error(`candidate ${candidate.candidate_id} references unknown shot_id ${candidate.shot_id}`);
    }
    assertObject(candidate.scores, `candidate ${candidate.candidate_id} scores`);
    assertSafeMetadataArtifactRef(candidate);
  }

  return clone(input);
}

function buildKernelRun(input) {
  const normalized = normalizeInput(input);
  const taxonomy = Array.isArray(normalized.failure_taxonomy) ? normalized.failure_taxonomy : [];
  const taxonomyTags = new Set(taxonomy.map((entry) => entry.tag));
  const candidateDecisions = normalized.candidates.map((candidate) =>
    buildCandidateDecision(candidate, normalized.review_rubric, taxonomyTags)
  );
  const acceptedDecisions = candidateDecisions.filter((decision) => decision.accepted);
  const rejectedDecisions = candidateDecisions.filter((decision) => !decision.accepted);

  const acceptedSamples = acceptedDecisions.map((decision) => ({
    accepted_sample_id: `accepted_${decision.candidate_id}`,
    candidate_id: decision.candidate_id,
    shot_id: decision.shot_id,
    source_ref: "metadata_only_candidate_ref",
    write_performed: false,
    memory_suitability: false,
    production_candidate: false,
  }));

  const rejectedSamples = rejectedDecisions.map((decision) => ({
    rejected_sample_id: `rejected_${decision.candidate_id}`,
    candidate_id: decision.candidate_id,
    shot_id: decision.shot_id,
    failure_tags: decision.failure_tags,
    write_performed: false,
    memory_suitability: false,
  }));

  const runId = `pvos_kernel_run_${normalized.task_id}`;
  const noExecutionGuard = {
    ...guardDefaults,
    ...performedDefaults,
    ...(normalized.guard || {}),
  };

  return {
    pvos_kernel_run_version: "v1",
    run_id: runId,
    task_id: normalized.task_id,
    mode: "local_stdout_only_kernel",
    status: "completed_local_draft",
    domain_model_refs: domainModelRefs,
    task_envelope_draft: {
      task_id: normalized.task_id,
      intent: "local_visual_production_kernel_draft",
      risk_level: "R1",
      execution_mode: "no_execution_stdout_only",
      external_side_effects_allowed: false,
    },
    shot_plan: normalized.shot_plan,
    shots: normalized.shot_plan.shots,
    prompt_lineage: normalized.prompt_lineage,
    prompt_package_ref: normalized.prompt_lineage.prompt_package_ref,
    dispatch_plan_draft: {
      dispatch_plan_id: `dispatch_${normalized.task_id}`,
      execution_authorized: false,
      provider_contact_allowed: false,
      max_plugin_calls: 0,
      output_write_allowed: false,
    },
    image_candidates: normalized.candidates.map((candidate) => ({
      candidate_id: candidate.candidate_id,
      shot_id: candidate.shot_id,
      artifact_ref: candidate.artifact_ref,
      artifact_ref_kind: candidate.artifact_ref_kind || "metadata_only_reference",
      scores: candidate.scores,
      observations: candidate.observations || [],
      failure_tags: candidate.failure_tags || [],
    })),
    review_rubric: normalized.review_rubric,
    failure_taxonomy: taxonomy,
    visual_eval_decision: {
      decision_set_id: `decision_${normalized.task_id}`,
      aggregate_decision: acceptedDecisions.length > 0 ? "accepted_and_rejected_candidates" : "rejected_candidates_only",
      candidate_decisions: candidateDecisions,
    },
    accepted_samples: acceptedSamples,
    rejected_samples: rejectedSamples,
    review_report: {
      review_report_id: `review_report_${normalized.task_id}`,
      accepted_count: acceptedSamples.length,
      rejected_count: rejectedSamples.length,
      reviewer: "codex_local_kernel",
      report_status: "draft_only",
      memory_delta_status: "draft_not_written",
      summary_zh: "本地内核已把视觉任务、镜头、提示词谱系、候选图、评审规则、失败标签、接收/拒绝样本草案和来源记录串成一次可验证的草案运行。",
    },
    image_case_draft: {
      image_case_id: `image_case_${normalized.task_id}`,
      case_status: "metadata_only_draft",
      accepted_candidate_ids: acceptedSamples.map((sample) => sample.candidate_id),
      rejected_candidate_ids: rejectedSamples.map((sample) => sample.candidate_id),
    },
    memory_delta_draft: {
      memory_delta_id: `memory_delta_${normalized.task_id}`,
      status: "draft",
      language: "zh-CN",
      direct_write_allowed: false,
      direct_write_performed: false,
      body_zh: "本次仅生成本地草案，不写入 DailyNote 或 VCP 长期记忆。",
    },
    provenance_record: {
      provenance_record_id: `provenance_${normalized.task_id}`,
      source_fixture_ref: normalized.provenance?.input_package_ref || defaultInputPath,
      provider_payload_included: false,
      image_binary_included: false,
      private_path_included: false,
      external_manifest_included: false,
      artifact_refs_are_metadata_only: true,
    },
    eval_seed: normalized.eval_seed,
    run_manifest: {
      run_manifest_id: `manifest_${normalized.task_id}`,
      run_id: runId,
      domain_model_refs: domainModelRefs,
      object_counts: {
        shots: normalized.shot_plan.shots.length,
        image_candidates: normalized.candidates.length,
        accepted_samples: acceptedSamples.length,
        rejected_samples: rejectedSamples.length,
        failure_taxonomy_tags: taxonomy.length,
      },
      validation_targets: [
        "node --check kernel/pvos_kernel.js",
        "node scripts/validate_pvos_kernel_minimal.js",
      ],
      boundary_flags: noExecutionGuard,
    },
    visual_loop_state: {
      current_state: "review_report_drafted",
      next_safe_state: "local_adapter_contract_or_review_console_binding",
      blocked_states: [
        "provider_generation",
        "accepted_samples_write",
        "DailyNote_write",
        "VCP_memory_write",
      ],
    },
    no_execution_guard: noExecutionGuard,
  };
}

function parseArgs(argv) {
  const args = { input: defaultInputPath };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--input") {
      args.input = argv[index + 1];
      index += 1;
      continue;
    }
    if (token.startsWith("--input=")) {
      args.input = token.slice("--input=".length);
      continue;
    }
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    throw new Error(`unknown argument: ${token}`);
  }
  return args;
}

function resolveFixturePath(inputPath) {
  assertString(inputPath, "input path");
  if (path.isAbsolute(inputPath) || /^[A-Za-z]:[\\/]/.test(inputPath)) {
    throw new Error("input path must be repository-relative");
  }
  const normalized = inputPath.replace(/\\/g, "/");
  if (!normalized.startsWith("tests/schema_examples/") || normalized.includes("..")) {
    throw new Error("input path must stay under tests/schema_examples/");
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("input path escapes repository root");
  }
  return resolved;
}

function loadInput(inputPath) {
  const resolved = resolveFixturePath(inputPath);
  const parsed = JSON.parse(fs.readFileSync(resolved, "utf8"));
  return normalizeInput(parsed);
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node kernel/pvos_kernel.js --input tests/schema_examples/pvos_kernel_input.example.json",
      "",
      "Reads one repository-local synthetic fixture and writes a pvos_kernel_run JSON draft to stdout.",
      "It performs no provider calls, plugin calls, API calls, DailyNote writes, VCP memory writes, image generation, or disk writes.",
    ].join("\n") + "\n"
  );
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return;
  }
  const input = loadInput(args.input);
  const run = buildKernelRun(input);
  process.stdout.write(`${JSON.stringify(run, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  buildKernelRun,
  assertSafeMetadataArtifactRef,
  loadInput,
  normalizeInput,
  resolveFixturePath,
  sumWeightedScore,
};
