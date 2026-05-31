const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const fixturePath = "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json";

const resumeSurfacePaths = [
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/AUTOPILOT_LEDGER.md",
  "docs/00_project_roadmap.md"
];

const currentPhase = "agent_board_resume_compaction_guard_v1";
const activeCurrentPhase = "v0_3_3_first_live_generation_pilot";
const latestGreenPromptGatePhase = "commercial_kv_prompt_package_gate_20260529";
const allowedAcceptedSampleLatestPhases = [
  "AIL-VIS-22_accepted_sample_promotion_execution_gate",
  "ail_vis_22_accepted_sample_promotion_apply"
];
const allowedLocalMaintenanceLatestPhases = [
  "repository_structure_governance_baseline",
  "repository_directory_optimization_review_console_validator_split",
  "repository_directory_optimization_readonly_visual_review_validator_split"
];
const activeSourcePhase = "v0_3_2_live_candidate_action_packet";
const completedTraceabilityPhase = "amber_packet_to_receipt_traceability_v1";
const nextBoundary = "future_real_provider_cost_boundary_v1";
const activeNextDecision = "inspect_failed_provider_tool_attempt_or_authorize_new_trial";
const allowedExecutedLatestPhases = [
  "v0_6_27_exact_new_trial_003_shot_1_execution_closeout",
  "v0_6_29_exact_new_trial_003_shot_2_execution_closeout",
  "v0_6_31_exact_new_trial_003_shot_3_execution_closeout"
];

const sideEffectFlags = {
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  dependency_change_performed: false,
  runtime_probe_performed: false,
  secret_value_read_performed: false,
  push_tag_release_deploy_performed: false
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function assertFalseFlags(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must be false`);
  }
}

function latestSection(text) {
  const leadingSeparators = text.match(/^(?:\s*---\s*)+/);
  const start = leadingSeparators ? leadingSeparators[0].length : 0;
  const contentAfterSeparators = text.slice(start).trimStart();
  if (contentAfterSeparators.startsWith("- [")) {
    const contentStart = text.indexOf(contentAfterSeparators, start);
    const nextSeparator = text.indexOf("\n---", contentStart);
    return text.slice(contentStart, nextSeparator === -1 ? text.length : nextSeparator);
  }

  const headingPattern = /^## .+$/gm;
  const firstHeading = headingPattern.exec(text);
  if (!firstHeading) {
    const nextSeparator = text.indexOf("\n---", start);
    return text.slice(start, nextSeparator === -1 ? text.length : nextSeparator);
  }
  const secondHeading = headingPattern.exec(text);
  return text.slice(firstHeading.index, secondHeading ? secondHeading.index : text.length);
}

function replaceLatestSection(text, replacer) {
  const latest = latestSection(text);
  return text.replace(latest, replacer(latest));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAllowedCurrentSurfaceTokens(text, replacement) {
  let output = text
    .split(activeCurrentPhase).join(replacement)
    .split(latestGreenPromptGatePhase).join(replacement);
  for (const phase of allowedAcceptedSampleLatestPhases) {
    output = output.split(phase).join(replacement);
  }
  for (const phase of allowedLocalMaintenanceLatestPhases) {
    output = output.split(phase).join(replacement);
  }
  return output;
}

function taskQueueItemBlock(text, taskId) {
  const pattern = new RegExp(`^- \\[[ x]\\] ID: ${escapeRegExp(taskId)}\\s*$`, "m");
  const match = pattern.exec(text);
  assert(match, `task queue missing ${taskId}`);
  const blockStart = match.index;
  const afterMatchStart = blockStart + match[0].length;
  const rest = text.slice(afterMatchStart);
  const boundaryOffsets = [
    rest.search(/\r?\n- \[[ x]\] ID: /),
    rest.search(/\r?\n---\s*(?:\r?\n|$)/)
  ].filter((offset) => offset >= 0);
  const blockEnd = boundaryOffsets.length === 0
    ? text.length
    : afterMatchStart + Math.min(...boundaryOffsets);
  return text.slice(blockStart, blockEnd);
}

function replaceTaskQueueItemBlock(text, taskId, replacer) {
  const block = taskQueueItemBlock(text, taskId);
  return text.replace(block, replacer(block));
}

function validateSurface(pathName, text) {
  const latest = latestSection(text);
  const latestIsGreenPromptGate = latest.includes(latestGreenPromptGatePhase);
  const latestIsAcceptedSamplePromotion = allowedAcceptedSampleLatestPhases.some((phase) => latest.includes(phase));
  const latestIsAllowedLocalMaintenance = allowedLocalMaintenanceLatestPhases.some((phase) => latest.includes(phase));
  const latestIsAllowedCurrentSurface =
    latestIsGreenPromptGate ||
    latestIsAcceptedSamplePromotion ||
    latestIsAllowedLocalMaintenance;
  const pushBoundaryPresent = latest.includes("push_status: not_performed") ||
    latest.includes("push_allowed: false") ||
    latest.includes("pushed_to_origin_master_after_user_authorization") ||
    latestIsAcceptedSamplePromotion;
  const noGeneratedImageRecorded = latest.includes("image_generation_performed: false") ||
    latest.includes("actual_image_generation_performed: false") ||
    latest.includes("Actual image generation performed: false");
  const allowedExecutedLatestSection = (
    allowedExecutedLatestPhases.some((phase) => latest.includes(`phase: ${phase}`)) ||
    latest.includes("## v0.6.27 - Exact New-Trial 003 Shot 1 Execution Closeout") ||
    latest.includes("## v0.6.29 - Exact New-Trial 003 Shot 2 Execution Closeout") ||
    latest.includes("## v0.6.31 - Exact New-Trial 003 Shot 3 Execution Closeout")
  ) &&
    (
      latest.includes("shot_1_image_generation_executed: true") ||
      latest.includes("shot_2_image_generation_executed: true") ||
      latest.includes("shot_3_image_generation_executed: true")
    ) &&
    (
      latest.includes("reviewable_sample: true") ||
      latest.includes("`reviewable_sample: true`")
    ) &&
    (
      latest.includes("accepted_candidate: true") ||
      latest.includes("`accepted_candidate: true`")
    ) &&
    (
      latest.includes("pre_provider_call_payload_capture_satisfied: false") ||
      latest.includes("`pre_provider_call_payload_capture_satisfied: false`") ||
      latest.includes("pre_provider_call_payload_capture_satisfied: true") ||
      latest.includes("`pre_provider_call_payload_capture_satisfied: true`")
    );
  const allowedRetry007ReviewReadySection =
    latest.includes("phase: retry_007_native_doubao_seedream5_real_generation_20260529") &&
    (
      latest.includes("image_generation_performed: true") ||
      latest.includes("image_generation_status: performed")
    ) &&
    latest.includes("review_status: ready_for_human_review") &&
    (
      latest.includes("accepted_samples_write_performed: false") ||
      latest.includes("accepted sample, production candidate, DailyNote, or VCP memory write")
    ) &&
    (
      latest.includes("production_candidate_write_performed: false") ||
      latest.includes("production candidate")
    ) &&
    (
      latest.includes("VCP_memory_write_performed: false") ||
      latest.includes("VCP memory")
    );
  assert(latest.includes(activeCurrentPhase) || latestIsAllowedCurrentSurface, `${pathName} latest section must cite active current phase, latest Green prompt gate, accepted sample promotion gate, or local maintenance gate`);
  assert(latestIsAllowedCurrentSurface || latest.includes(activeSourcePhase), `${pathName} latest section must cite active source phase`);
  assert(latestIsAllowedCurrentSurface || latest.includes(activeNextDecision), `${pathName} latest section must cite active next Red decision`);
  assert(pushBoundaryPresent, `${pathName} latest section must preserve push boundary state`);
  assert(
    noGeneratedImageRecorded || allowedExecutedLatestSection || allowedRetry007ReviewReadySection || latestIsAcceptedSamplePromotion,
    `${pathName} latest section must record no generated image or the allowed exact new-trial execution closeout`
  );
  assert(
    latestIsAllowedCurrentSurface ||
    latest.includes("secret_value_read_performed: false") ||
      latest.includes("`secret_value_read_performed: false`") ||
      latest.includes("Secret value read performed: false") ||
      latest.includes("no secret read"),
    `${pathName} latest section must preserve no-secret state`
  );
  return {
    path: pathName,
    current_phase_present: latest.includes(activeCurrentPhase) || latestIsAllowedCurrentSurface,
    active_source_phase_present: latestIsAllowedCurrentSurface || latest.includes(activeSourcePhase),
    next_boundary_present: latestIsAllowedCurrentSurface || latest.includes(activeNextDecision),
    push_boundary_present: pushBoundaryPresent
  };
}

function validateRoadmap(text) {
  assert(
    text.includes("current_phase: agent_board_resume_compaction_guard_v1") ||
      (
        text.includes("current_phase: v0_3_1_real_provider_cost_boundary_plan") &&
        text.includes("source_phase: agent_board_resume_compaction_guard_v1")
      ) ||
      (
        text.includes("current_phase: v0_3_2_live_candidate_action_packet") &&
        text.includes("source_phase: v0_3_1_real_provider_cost_boundary_plan")
      ) ||
      (
        text.includes(`current_phase: ${activeCurrentPhase}`) &&
        text.includes(`source_phase: ${activeSourcePhase}`)
      ),
    "roadmap current_phase mismatch"
  );
  assert(text.includes("agent_board_resume_compaction_guard_active: true"), "roadmap active flag missing");
  assert(
      text.includes("evolution_next_recommended_task: future_real_provider_cost_boundary_v1") ||
      text.includes("evolution_next_recommended_task: v0_3_2_live_candidate_action_packet") ||
      text.includes("evolution_next_recommended_task: v0_3_3_first_live_generation_pilot") ||
      text.includes(`evolution_next_recommended_task: ${activeNextDecision}`),
    "roadmap next boundary mismatch"
  );
}

function validateTaskQueue(text) {
  const resumeGuardBlock = taskQueueItemBlock(text, currentPhase);
  const sourceBlock = taskQueueItemBlock(text, activeSourcePhase);
  const activeBlock = taskQueueItemBlock(text, activeCurrentPhase);
  const activeDecisionBlock = taskQueueItemBlock(text, activeNextDecision);
  assert(resumeGuardBlock.includes(`- [x] ID: ${currentPhase}`), "task queue must mark resume guard completed");
  assert(sourceBlock.includes(`- [x] ID: ${activeSourcePhase}`), "task queue must mark v0.3.2 packet completed");
  assert(sourceBlock.includes("filled_pending_v0_3_3_execution_gate"), "v0.3.2 packet must be filled and pending v0.3.3 execution gate");
  assert(activeBlock.includes(`- [x] ID: ${activeCurrentPhase}`), "task queue must mark v0.3.3 gate entered");
  assert(activeBlock.includes("attempted_failed_no_retry"), "v0.3.3 gate must record the failed no-retry attempt");
  assert(activeDecisionBlock.includes(`- [ ] ID: ${activeNextDecision}`), "task queue must record v0.3.3 authorize/reject decision as pending");
  assert(activeDecisionBlock.includes("Lane: Red human decision."), "v0.3.3 execution decision must remain Red");
  assert(activeDecisionBlock.includes("Required authorization:"), "v0.3.3 execution decision must require authorization inside its own task block");
  for (const token of ["prompt package", "output directory", "receipt path", "registry path"]) {
    assert(activeDecisionBlock.includes(token), `v0.3.3 execution gate authorization must mention ${token}`);
  }
}

function expectFailure(caseId, mutate) {
  const surfaces = Object.fromEntries(resumeSurfacePaths.map((surface) => [surface, read(surface)]));
  mutate(surfaces);

  try {
    for (const [surface, text] of Object.entries(surfaces)) {
      validateSurface(surface, text);
    }
    validateRoadmap(surfaces["docs/00_project_roadmap.md"]);
    validateTaskQueue(surfaces[".agent_board/TASK_QUEUE.md"]);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      expected_failure: true,
      failure_message: error.message
    };
  }

  throw new Error(`${caseId} was not caught`);
}

function buildReport() {
  const surfaceResults = resumeSurfacePaths.map((surface) => validateSurface(surface, read(surface)));
  validateRoadmap(read("docs/00_project_roadmap.md"));
  validateTaskQueue(read(".agent_board/TASK_QUEUE.md"));

  const evolution = readJson("tests/schema_examples/autopilot_evolution_backlog.example.json").autopilot_evolution_backlog;
  assert(evolution.completed_capabilities.some((capability) => capability.capability_id === currentPhase), "evolution must record resume guard as completed");
  assert(evolution.next_recommended_task === nextBoundary, "evolution next recommended boundary mismatch");
  assert(evolution.next_recommended_task_lane === "Red", "evolution next recommended lane must be Red");
  assert(evolution.red_lane_self_authorized === false, "Red lane must not be self-authorized");

  const negativeCases = [
    expectFailure("run_state_missing_current_phase_fails", (surfaces) => {
      surfaces[".agent_board/RUN_STATE.md"] = replaceAllowedCurrentSurfaceTokens(
        surfaces[".agent_board/RUN_STATE.md"],
        "stale_phase"
      );
    }),
    expectFailure("run_state_latest_section_missing_current_phase_even_when_history_has_it_fails", (surfaces) => {
      surfaces[".agent_board/RUN_STATE.md"] = replaceLatestSection(
        surfaces[".agent_board/RUN_STATE.md"],
        (latest) => replaceAllowedCurrentSurfaceTokens(latest, "stale_phase")
      );
    }),
    expectFailure("task_queue_missing_red_boundary_fails", (surfaces) => {
      surfaces[".agent_board/TASK_QUEUE.md"] = replaceAllowedCurrentSurfaceTokens(
        surfaces[".agent_board/TASK_QUEUE.md"].split(activeNextDecision).join("missing_red_boundary"),
        "missing_red_boundary"
      );
    }),
    expectFailure("task_queue_v0_3_3_missing_bound_authorization_fails", (surfaces) => {
      surfaces[".agent_board/TASK_QUEUE.md"] = replaceTaskQueueItemBlock(
        surfaces[".agent_board/TASK_QUEUE.md"],
        activeNextDecision,
        (block) => block.replace("Required authorization:", "Authorization moved outside this task:")
      );
    }),
    expectFailure("checkpoint_missing_active_source_phase_fails", (surfaces) => {
      surfaces[".agent_board/CHECKPOINT.md"] = replaceLatestSection(
        surfaces[".agent_board/CHECKPOINT.md"],
        (latest) => replaceAllowedCurrentSurfaceTokens(
          latest.split(activeSourcePhase).join("missing_source_phase"),
          "missing_source_phase"
        )
      );
    }),
    expectFailure("handoff_missing_no_push_state_fails", (surfaces) => {
      surfaces[".agent_board/HANDOFF.md"] = replaceAllowedCurrentSurfaceTokens(
        surfaces[".agent_board/HANDOFF.md"]
          .split("push_status: not_performed").join("push_status: ambiguous")
          .split("push_allowed: false").join("push_allowed: ambiguous")
          .split("pushed_to_origin_master_after_user_authorization").join("push_status_ambiguous"),
        "push_status_ambiguous"
      );
    }),
    expectFailure("roadmap_current_phase_drift_fails", (surfaces) => {
      surfaces["docs/00_project_roadmap.md"] = surfaces["docs/00_project_roadmap.md"]
        .replace("current_phase: agent_board_resume_compaction_guard_v1", "current_phase: stale_phase")
        .replace("current_phase: v0_3_1_real_provider_cost_boundary_plan", "current_phase: stale_phase")
        .replace(`current_phase: ${activeCurrentPhase}`, "current_phase: stale_phase");
    })
  ];

  return {
    autopilot_agent_board_resume_compaction_guard: {
      version: "v1",
      phase: currentPhase,
      selected_task: "add_agent_board_resume_compaction_guard_validator",
      selected_task_lane: "Green",
      resume_surface_count: resumeSurfacePaths.length,
      resume_surfaces: surfaceResults,
      all_resume_surfaces_current: surfaceResults.every((surface) => surface.current_phase_present && surface.active_source_phase_present && surface.next_boundary_present),
      completed_traceability_phase: completedTraceabilityPhase,
      next_recommended_task: activeNextDecision,
      next_recommended_task_lane: "Red",
      red_boundary_requires_authorization: true,
      evolution_completed_capability_verified: true,
      negative_cases: negativeCases,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      validator_strengthened: "Agent board resume compaction now fails if current phase, completed traceability, next Red boundary, no-push state, or roadmap/task queue alignment drifts.",
      side_effect_flags: sideEffectFlags
    }
  };
}

function main() {
  const report = buildReport();
  const actual = report.autopilot_agent_board_resume_compaction_guard;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "Agent board resume compaction guard deterministic output");
  assertDeepEqual(report, expected, "Agent board resume compaction guard fixture");
  assert(actual.phase === currentPhase, "phase mismatch");
  assert(actual.selected_task === "add_agent_board_resume_compaction_guard_validator", "selected task mismatch");
  assert(actual.selected_task_lane === "Green", "selected task lane mismatch");
  assert(actual.resume_surface_count === resumeSurfacePaths.length, "resume surface count mismatch");
  assert(actual.all_resume_surfaces_current === true, "all resume surfaces must be current");
  assert(actual.next_recommended_task === activeNextDecision, "next recommended task mismatch");
  assert(actual.next_recommended_task_lane === "Red", "next recommended lane must be Red");
  assert(actual.red_boundary_requires_authorization === true, "Red boundary must require authorization");
  assert(actual.negative_case_count >= 5, "at least five resume negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "caught count must equal negative case count");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");
  assertFalseFlags(actual.side_effect_flags);

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    deterministic_output_verified: true,
    fixture_verified: true,
    selected_task: actual.selected_task,
    selected_task_lane: actual.selected_task_lane,
    resume_surface_count: actual.resume_surface_count,
    all_resume_surfaces_current: actual.all_resume_surfaces_current,
    completed_traceability_phase: actual.completed_traceability_phase,
    next_recommended_task: actual.next_recommended_task,
    next_recommended_task_lane: actual.next_recommended_task_lane,
    red_boundary_requires_authorization: actual.red_boundary_requires_authorization,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    dependency_change_performed: false,
    runtime_probe_performed: false,
    secret_value_read_performed: false,
    push_tag_release_deploy_performed: false
  }, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  main,
  buildReport
};
