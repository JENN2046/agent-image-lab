const crypto = require("node:crypto");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_3_4_visual_asset_governance_and_receipt_state_reconciliation";
const docPath = "docs/V0_3_4_VISUAL_ASSET_GOVERNANCE_AND_RECEIPT_STATE_RECONCILIATION.md";
const registryPath = "assets/visual_asset_authorization_registry.example.json";
const visualAssetPolicyVersion = "visual_asset_policy_v0_3_4a";
const promotionPolicyVersion = "visual_asset_promotion_policy_v0_3_5";
const allowedAssetClasses = [
  "runs_artifact",
  "user_authorized_test_image",
  "review_candidate",
  "eval_seed_candidate",
  "accepted_sample",
  "production_candidate"
];
const expectedAuthorizedPngPaths = [
  "runs/real_generation/v0_3_3_smoke_001_neutral/neutral_smoke_test_red_apple_v1.png",
  "runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png"
];
const testAssetClasses = new Set(["runs_artifact", "user_authorized_test_image"]);
const promotionClasses = new Set(["review_candidate", "eval_seed_candidate", "accepted_sample", "production_candidate"]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function repoPath(relativePath) {
  const absolutePath = path.resolve(root, relativePath);
  assert(absolutePath === root || absolutePath.startsWith(`${root}${path.sep}`), `Path escapes repository: ${relativePath}`);
  return absolutePath;
}

function sha256File(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
}

function gitTracked(relativePath) {
  const output = childProcess.execFileSync("git", ["ls-files", "--", relativePath], {
    cwd: root,
    encoding: "utf8"
  }).trim();
  return output.split(/\r?\n/).filter(Boolean).includes(relativePath);
}

function gitBlobOid(relativePath) {
  return childProcess.execFileSync("git", ["hash-object", relativePath], {
    cwd: root,
    encoding: "utf8"
  }).trim();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateNoRawPrivatePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Raw Codex generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Raw Codex generated image path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateNoRawPrivatePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => validateNoRawPrivatePath(item, `${context}.${key}`));
  }
}

function validateMemorySeed(entry, registry) {
  if (entry.memory_seed === true) {
    assert(entry.memory_gate_id, `memory_seed true requires memory_gate_id: ${entry.asset_id}`);
    assert(
      registry.asset_boundary.VCP_memory_write_allowed_now === true,
      `memory_seed true requires explicit VCP memory write authorization: ${entry.asset_id}`
    );
  }
}

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.length > 0, message);
}

function validatePromotion(entry, registry) {
  if (!promotionClasses.has(entry.asset_class)) {
    assert(entry.promoted_from_asset_class === null, `Unpromoted asset must not record promoted_from_asset_class: ${entry.asset_id}`);
    assert(entry.promotion_gate_id === null, `Unpromoted asset must not record promotion_gate_id: ${entry.asset_id}`);
    return;
  }

  assert(registry.asset_boundary.promotion_by_field_flip_allowed === false, "promotion by field flip must stay blocked");
  assertNonEmptyString(entry.promoted_from_asset_class, `Promotion requires promoted_from_asset_class: ${entry.asset_id}`);
  assert(testAssetClasses.has(entry.promoted_from_asset_class), `Promotion source class must be a test/runs class: ${entry.asset_id}`);
  assertNonEmptyString(entry.promotion_gate_id, `Promotion requires promotion_gate_id: ${entry.asset_id}`);

  if (entry.asset_class === "review_candidate") {
    assertNonEmptyString(entry.review_gate_id, `review_candidate requires review_gate_id: ${entry.asset_id}`);
    assert(entry.review_gate_id === entry.promotion_gate_id, `review_candidate gate must match promotion_gate_id: ${entry.asset_id}`);
  }
  if (entry.asset_class === "eval_seed_candidate") {
    assertNonEmptyString(entry.eval_gate_id, `eval_seed_candidate requires eval_gate_id: ${entry.asset_id}`);
    assertNonEmptyString(entry.human_label, `eval_seed_candidate requires human_label: ${entry.asset_id}`);
    assert(entry.eval_gate_id === entry.promotion_gate_id, `eval_seed_candidate gate must match promotion_gate_id: ${entry.asset_id}`);
  }
  if (entry.asset_class === "accepted_sample") {
    assertNonEmptyString(entry.accepted_gate_id, `accepted_sample requires accepted_gate_id: ${entry.asset_id}`);
    assert(entry.human_accepted === true, `accepted_sample requires human_accepted true: ${entry.asset_id}`);
    assert(entry.accepted_sample === true, `accepted_sample class requires accepted_sample true: ${entry.asset_id}`);
    assert(entry.accepted_gate_id === entry.promotion_gate_id, `accepted_sample gate must match promotion_gate_id: ${entry.asset_id}`);
  }
  if (entry.asset_class === "production_candidate") {
    assertNonEmptyString(entry.independent_A5_production_gate_id, `production_candidate requires independent_A5_production_gate_id: ${entry.asset_id}`);
    assert(entry.production_candidate === true, `production_candidate class requires production_candidate true: ${entry.asset_id}`);
    assert(entry.independent_A5_production_gate_id === entry.promotion_gate_id, `production_candidate gate must match promotion_gate_id: ${entry.asset_id}`);
    assert(registry.asset_boundary.production_candidate_write_allowed_by_this_phase === true, `production_candidate requires an active independent A5 production gate: ${entry.asset_id}`);
  }
}

function validateEntry(entry, registry) {
  assert(entry.asset_path.startsWith("runs/real_generation/"), `Asset must stay in runs/real_generation: ${entry.asset_path}`);
  assert(entry.asset_path.endsWith(".png"), `Asset must be PNG: ${entry.asset_path}`);
  assert(entry.asset_format === "png", `Asset format mismatch: ${entry.asset_id}`);
  assert(typeof entry.asset_class === "string", `asset_class missing: ${entry.asset_id}`);
  assert(allowedAssetClasses.includes(entry.asset_class), `asset_class not allowed: ${entry.asset_id}`);
  assert(entry.asset_role === "runs_artifact", `Asset role mismatch: ${entry.asset_id}`);
  assert(entry.upload_authorized_by_user === true, `upload_authorized_by_user missing: ${entry.asset_id}`);
  assert(entry.owner_authorized_upload === undefined || entry.owner_authorized_upload === entry.upload_authorized_by_user, `owner_authorized_upload alias drift: ${entry.asset_id}`);
  if (entry.asset_class === "user_authorized_test_image") {
    assert(entry.upload_authorized_by_user === true, `user_authorized_test_image requires upload_authorized_by_user: ${entry.asset_id}`);
    assert(typeof entry.receipt_path === "string" && entry.receipt_path.length > 0, `user_authorized_test_image requires receipt_path: ${entry.asset_id}`);
    assert(typeof entry.output_image_sha256 === "string" && entry.output_image_sha256.length > 0, `user_authorized_test_image requires output_image_sha256: ${entry.asset_id}`);
  }
  assert(entry.git_tracked === true && gitTracked(entry.asset_path), `Asset is not git tracked: ${entry.asset_path}`);
  assert(gitBlobOid(entry.asset_path) === entry.git_blob_oid, `Git blob oid mismatch: ${entry.asset_path}`);
  assert(entry.output_image_sha256 === sha256File(entry.asset_path), `Asset SHA256 mismatch: ${entry.asset_path}`);
  assert(entry.source_image_path_redacted === true, `Source path redaction missing: ${entry.asset_id}`);
  assert(entry.raw_private_source_path_present === false, `Raw source path flag must be false: ${entry.asset_id}`);
  assert(entry.durable_review_asset === false, `Runs artifact must not self-claim durable review asset: ${entry.asset_id}`);
  if (testAssetClasses.has(entry.asset_class)) {
    assert(entry.accepted_sample === false, `Test/runs asset must not self-claim accepted sample: ${entry.asset_id}`);
    assert(entry.production_candidate === false, `Test/runs asset must not self-claim production candidate: ${entry.asset_id}`);
    assert(entry.memory_seed === false, `Test/runs asset must explicitly set memory_seed false: ${entry.asset_id}`);
  }
  validatePromotion(entry, registry);
  validateMemorySeed(entry, registry);
  assert(entry.DailyNote_write_performed === false, `DailyNote write flag must remain false: ${entry.asset_id}`);
  assert(entry.VCP_memory_write_performed === false, `VCP memory write flag must remain false: ${entry.asset_id}`);

  const receipt = readJson(entry.receipt_path);
  const attempt = readJson(entry.attempt_result_path);
  assert(receipt.status === "succeeded_image_generated", `Receipt status mismatch: ${entry.receipt_path}`);
  assert(attempt.attempt_status === "succeeded_image_generated", `Attempt status mismatch: ${entry.attempt_result_path}`);
  assert(receipt.output_image_path === entry.asset_path, `Receipt output path mismatch: ${entry.receipt_path}`);
  assert(attempt.output_image_path === entry.asset_path, `Attempt output path mismatch: ${entry.attempt_result_path}`);
  assert(receipt.output_image_sha256 === entry.output_image_sha256, `Receipt SHA256 mismatch: ${entry.receipt_path}`);
  assert(attempt.output_image_sha256 === entry.output_image_sha256, `Attempt SHA256 mismatch: ${entry.attempt_result_path}`);
  assert(receipt.source_image_path_redacted === true, `Receipt source path redaction missing: ${entry.receipt_path}`);
}

function validateRegistry(registry) {
  validateNoRawPrivatePath(registry, registryPath);

  assert(registry.phase === phase, "registry phase mismatch");
  assert(registry.visual_asset_policy_version === visualAssetPolicyVersion, "visual asset policy version mismatch");
  assert(registry.promotion_policy_version === promotionPolicyVersion, "promotion policy version mismatch");
  assert(registry.pushed_commit === "bf5e54e", "registry must record pushed commit bf5e54e");
  assert(registry.push_status === "pushed_to_origin_master_after_user_authorization", "push status mismatch");
  assert(registry.binary_commit_policy_id === "generated_image_binary_commit_policy_v1", "binary policy id mismatch");
  assertDeepEqual(registry.asset_boundary.asset_class_enum, allowedAssetClasses, "asset class enum");
  assert(registry.asset_boundary.durable_review_asset_requires_separate_gate === true, "durable review boundary must require separate gate");
  assert(registry.asset_boundary.production_candidate_write_allowed_by_this_phase === false, "production candidate must be blocked");
  assert(registry.asset_boundary.memory_seed_requires_memory_gate === true, "memory seed must require memory gate");
  assert(registry.asset_boundary.VCP_memory_write_allowed_now === false, "VCP memory write authorization must remain false");
  assert(registry.asset_boundary.promotion_by_field_flip_allowed === false, "promotion by field flip must remain false");
  assertDeepEqual(registry.asset_boundary.promotion_classes, Array.from(promotionClasses), "promotion class enum");
  assert(registry.asset_boundary.current_promotion_counts.review_candidate === 0, "review candidate count must remain zero");
  assert(registry.asset_boundary.current_promotion_counts.eval_seed_candidate === 0, "eval seed candidate count must remain zero");
  assert(registry.asset_boundary.current_promotion_counts.accepted_sample === 0, "accepted sample count must remain zero");
  assert(registry.asset_boundary.current_promotion_counts.production_candidate === 0, "production candidate count must remain zero");
  assert(registry.asset_boundary.current_promotion_counts.memory_seed === 0, "memory seed count must remain zero");
  assert(Array.isArray(registry.entries) && registry.entries.length === 2, "exactly two PNG assets must be authorized");

  const registeredPaths = new Set(registry.entries.map((entry) => entry.asset_path));
  for (const expectedPath of expectedAuthorizedPngPaths) {
    assert(registeredPaths.has(expectedPath), `Tracked authorized image binary lacks registry entry: ${expectedPath}`);
  }

  for (const entry of registry.entries) {
    validateEntry(entry, registry);
  }

  for (const [key, value] of Object.entries(registry.non_actions)) {
    assert(value === false, `${key} must remain false`);
  }
}

function countByAssetClass(registry, assetClass) {
  return registry.entries.filter((entry) => entry.asset_class === assetClass).length;
}

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function countInvalidMemorySeeds(registry) {
  return registry.entries.filter((entry) => (
    entry.memory_seed === true &&
    (!entry.memory_gate_id || registry.asset_boundary.VCP_memory_write_allowed_now !== true)
  )).length;
}

function expectFailure(registry, caseId, mutate) {
  const candidate = clone(registry);
  mutate(candidate);
  try {
    validateRegistry(candidate);
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

function validateNegativeCases(registry) {
  const cases = [
    expectFailure(registry, "tracked_allowed_png_without_registry_entry_fails", (candidate) => {
      candidate.entries = candidate.entries.filter((entry) => entry.asset_path !== expectedAuthorizedPngPaths[0]);
    }),
    expectFailure(registry, "asset_class_missing_fails", (candidate) => {
      delete candidate.entries[0].asset_class;
    }),
    expectFailure(registry, "asset_class_not_in_enum_fails", (candidate) => {
      candidate.entries[0].asset_class = "test_asset";
    }),
    expectFailure(registry, "user_authorized_test_image_without_upload_authorized_by_user_fails", (candidate) => {
      candidate.entries[1].upload_authorized_by_user = false;
    }),
    expectFailure(registry, "user_authorized_test_image_without_receipt_path_fails", (candidate) => {
      delete candidate.entries[1].receipt_path;
    }),
    expectFailure(registry, "user_authorized_test_image_without_output_image_sha256_fails", (candidate) => {
      delete candidate.entries[1].output_image_sha256;
    }),
    expectFailure(registry, "test_or_runs_asset_with_accepted_sample_true_fails", (candidate) => {
      candidate.entries[0].accepted_sample = true;
    }),
    expectFailure(registry, "test_or_runs_asset_with_production_candidate_true_fails", (candidate) => {
      candidate.entries[0].production_candidate = true;
    }),
    expectFailure(registry, "memory_seed_true_without_memory_gate_id_fails", (candidate) => {
      candidate.entries[0].asset_class = "review_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "review_gate_future";
      candidate.entries[0].review_gate_id = "review_gate_future";
      candidate.entries[0].memory_seed = true;
    }),
    expectFailure(registry, "memory_seed_true_without_vcp_memory_authorization_fails", (candidate) => {
      candidate.entries[0].asset_class = "review_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "review_gate_future";
      candidate.entries[0].review_gate_id = "review_gate_future";
      candidate.entries[0].memory_seed = true;
      candidate.entries[0].memory_gate_id = "memory_gate_future_only";
    }),
    expectFailure(registry, "raw_local_path_in_registry_fails", (candidate) => {
      candidate.entries[0].source_image_path = "C:\\Users\\617\\.codex\\generated_images\\raw.png";
    }),
    expectFailure(registry, "codex_generated_image_path_in_registry_fails", (candidate) => {
      candidate.entries[0].source_image_path = "/home/user/.codex/generated_images/raw.png";
    }),
    expectFailure(registry, "review_candidate_field_flip_without_gate_fails", (candidate) => {
      candidate.entries[0].asset_class = "review_candidate";
    }),
    expectFailure(registry, "review_candidate_without_promotion_gate_id_fails", (candidate) => {
      candidate.entries[0].asset_class = "review_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].review_gate_id = "review_gate_future";
    }),
    expectFailure(registry, "review_candidate_without_review_gate_id_fails", (candidate) => {
      candidate.entries[0].asset_class = "review_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "review_gate_future";
    }),
    expectFailure(registry, "eval_seed_candidate_without_eval_gate_fails", (candidate) => {
      candidate.entries[0].asset_class = "eval_seed_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "eval_gate_future";
      candidate.entries[0].human_label = "neutral apple diagnostic";
    }),
    expectFailure(registry, "eval_seed_candidate_without_human_label_fails", (candidate) => {
      candidate.entries[0].asset_class = "eval_seed_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "eval_gate_future";
      candidate.entries[0].eval_gate_id = "eval_gate_future";
    }),
    expectFailure(registry, "accepted_sample_without_accepted_gate_fails", (candidate) => {
      candidate.entries[0].asset_class = "accepted_sample";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "accepted_gate_future";
      candidate.entries[0].human_accepted = true;
      candidate.entries[0].accepted_sample = true;
    }),
    expectFailure(registry, "accepted_sample_without_human_accepted_fails", (candidate) => {
      candidate.entries[0].asset_class = "accepted_sample";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "accepted_gate_future";
      candidate.entries[0].accepted_gate_id = "accepted_gate_future";
      candidate.entries[0].accepted_sample = true;
    }),
    expectFailure(registry, "production_candidate_without_independent_a5_gate_fails", (candidate) => {
      candidate.entries[0].asset_class = "production_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "production_gate_future";
      candidate.entries[0].production_candidate = true;
    }),
    expectFailure(registry, "production_candidate_with_gate_but_inactive_phase_fails", (candidate) => {
      candidate.entries[0].asset_class = "production_candidate";
      candidate.entries[0].promoted_from_asset_class = "runs_artifact";
      candidate.entries[0].promotion_gate_id = "production_gate_future";
      candidate.entries[0].independent_A5_production_gate_id = "production_gate_future";
      candidate.entries[0].production_candidate = true;
    })
  ];

  return {
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught" && item.expected_failure === true)
  };
}

function main() {
  const registry = readJson(registryPath);
  const doc = read(docPath);
  validateRegistry(registry);
  const negativeCaseSummary = validateNegativeCases(registry);

  for (const token of [
    phase,
    "bf5e54e",
    visualAssetPolicyVersion,
    promotionPolicyVersion,
    "pushed_to_origin_master_after_user_authorization",
    "generated_image_binary_commit_policy_v1",
    "asset_class_enum",
    "user_authorized_test_image",
    "upload_authorized_by_user",
    "memory_seed: false",
    "visual_asset_promotion_policy_v0_3_5",
    "review_candidate_without_review_gate_id",
    "eval_seed_candidate_without_eval_gate_or_human_label",
    "runs_artifact_boundary",
    "durable_review_asset_boundary",
    "asset_authorization_registry_ref: assets/visual_asset_authorization_registry.example.json",
    "production_candidate_write_performed_by_v0_3_4: false"
  ]) {
    assert(doc.includes(token), `v0.3.4 doc missing token: ${token}`);
  }

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_visual_asset_authorization_policy",
    phase,
    status: "visual_asset_authorization_policy_verified",
    visual_asset_policy_version: registry.visual_asset_policy_version,
    promotion_policy_version: registry.promotion_policy_version,
    pushed_commit: registry.pushed_commit,
    push_status: registry.push_status,
    authorized_png_count: registry.entries.length,
    user_authorized_test_image_count: registry.entries.filter((entry) => entry.asset_class === "user_authorized_test_image").length,
    runs_artifact_count: registry.entries.filter((entry) => entry.asset_class === "runs_artifact").length,
    memory_seed_true_count: registry.entries.filter((entry) => entry.memory_seed === true).length,
    invalid_memory_seed_count: countInvalidMemorySeeds(registry),
    production_candidate_count: registry.entries.filter((entry) => entry.production_candidate === true).length,
    accepted_sample_count: registry.entries.filter((entry) => entry.accepted_sample === true).length,
    review_candidate_count: countByAssetClass(registry, "review_candidate"),
    eval_seed_candidate_count: countByAssetClass(registry, "eval_seed_candidate"),
    promotion_gate_required: true,
    promotion_by_field_flip_allowed: false,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    all_assets_git_tracked: registry.entries.every((entry) => gitTracked(entry.asset_path)),
    all_assets_sha256_verified: true,
    generated_image_binary_commit_policy_id: registry.binary_commit_policy_id,
    runs_artifact_boundary_verified: true,
    durable_review_asset_boundary_verified: true,
    production_candidate_write_performed_by_v0_3_4: false,
    provider_contact_performed_by_v0_3_4: false,
    plugin_call_performed_by_v0_3_4: false,
    api_call_performed_by_v0_3_4: false,
    image_generation_performed_by_v0_3_4: false,
    DailyNote_write_performed_by_v0_3_4: false,
    VCP_memory_write_performed_by_v0_3_4: false,
    VCPToolBox_runtime_call_performed_by_v0_3_4: false,
    VCPChat_runtime_call_performed_by_v0_3_4: false,
    secret_value_read_performed_by_v0_3_4: false,
    push_tag_release_deploy_performed_by_v0_3_4: false
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
