const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function excludesAll(content, values) {
  return values.every((value) => !content.includes(value));
}

function excludesExactTrueFlags(content, keys) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  return keys.every((key) => !lines.some((line) => line === `${key}: true`));
}

function main() {
  const requiredFiles = [
    "docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_followup_planning.md",
    "tests/schema_examples/v7_35_vcpchat_review_console_runtime_followup_planning.example.yaml",
    "scripts/validate_v7_35_vcpchat_review_console_runtime_followup_planning.js",
    "tests/validation_checklist.md",
    "docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.35 follow-up planning files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_followup_planning.md",
    "tests/schema_examples/v7_35_vcpchat_review_console_runtime_followup_planning.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.35 vcpchat review console runtime followup planning",
    "current_head: 4264a47",
    "head_commit_short: 4264a47",
    "docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md",
    "v7.36 External Remote Debug Verification Script Plan"
  ]);

  const baselineRecorded = includesAll(currentContents, [
    "review_console_bridge_runtime_verified: true",
    "renderer_global_smoke: passed",
    "prototype_guard_smoke: passed",
    "safe_to_claim_production_e2e: false",
    "known_startup_side_effect_path: .vcp_ready"
  ]);

  const optionsRecorded = includesAll(currentContents, [
    "external_agent_image_lab_remote_debug_script",
    "vcpchat_formal_smoke_test",
    "modifies_vcpchat: false",
    "modifies_vcpchat: true",
    "risk_level: medium",
    "risk_level: high"
  ]);

  const recommendationRecorded = includesAll(currentContents, [
    "recommended_first_step: external_agent_image_lab_remote_debug_script",
    "不修改 VCPChat",
    "外部脚本至少重复通过一次",
    "用户明确授权 VCPChat 文件级写入"
  ]);

  const externalScriptScopeRecorded = includesAll(currentContents, [
    "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "检查 VCPChat branch/head/worktree",
    "只用 Runtime.evaluate",
    "输出脱敏 JSON 结果",
    "不调用 bridge loadSession / previewDraft / submitDraft / cancel"
  ]);

  const formalSmokeGateRecorded = includesAll(currentContents, [
    "allowed_now: false",
    "requires_separate_authorization: true",
    "package.json 中新增或调整 smoke script",
    ".vcp_ready 的预期所有权"
  ]);

  const sideEffectGuardRecorded = includesAll(currentContents, [
    "app_launch_performed_by_this_phase: false",
    "remote_debug_used_by_this_phase: false",
    "cdp_endpoint_accessed_by_this_phase: false",
    "vcpchat_modified_by_this_phase: false",
    "external_script_created_by_this_phase: false",
    "vcpchat_formal_smoke_test_created_by_this_phase: false",
    "bridge_load_session_called: false",
    "bridge_preview_draft_called: false",
    "bridge_submit_draft_called: false",
    "bridge_cancel_called: false",
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_created: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "vcpchat_pushed: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "app_launch_performed_by_this_phase",
    "remote_debug_used_by_this_phase",
    "cdp_endpoint_accessed_by_this_phase",
    "vcpchat_modified_by_this_phase",
    "external_script_created_by_this_phase",
    "vcpchat_formal_smoke_test_created_by_this_phase",
    "bridge_load_session_called",
    "bridge_preview_draft_called",
    "bridge_submit_draft_called",
    "bridge_cancel_called",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "vcpchat_pushed",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.35 VCPChat Review Console Runtime Follow-up Planning 检查",
    "docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md",
    "review_console/embed_contract/vcpchat_review_console_runtime_followup_planning.md",
    "tests/schema_examples/v7_35_vcpchat_review_console_runtime_followup_planning.example.yaml",
    "scripts/validate_v7_35_vcpchat_review_console_runtime_followup_planning.js",
    "recommended_first_step=external_agent_image_lab_remote_debug_script",
    "vcpchat_formal_smoke_test_allowed_now=false",
    "v7.36 External Remote Debug Verification Script Plan"
  ]);

  assert(phaseRecorded, "v7.35 phase must be recorded.");
  assert(baselineRecorded, "v7.35 verified baseline must be recorded.");
  assert(optionsRecorded, "v7.35 follow-up options must be recorded.");
  assert(recommendationRecorded, "v7.35 recommendation must be recorded.");
  assert(externalScriptScopeRecorded, "v7.35 external script scope must be recorded.");
  assert(formalSmokeGateRecorded, "v7.35 formal smoke gate must be recorded.");
  assert(sideEffectGuardRecorded, "v7.35 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.35 must not set execution flags to true.");
  assert(noRawLocalPath, "v7.35 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.35 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_35_runtime_followup_planning: {
      phase_recorded: phaseRecorded,
      baseline_recorded: baselineRecorded,
      options_recorded: optionsRecorded,
      recommendation_recorded: recommendationRecorded,
      external_script_scope_recorded: externalScriptScopeRecorded,
      formal_smoke_gate_recorded: formalSmokeGateRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      recommended_first_step: "external_agent_image_lab_remote_debug_script",
      vcpchat_formal_smoke_test_allowed_now: false,
      next_safe_phase: "v7.36 External Remote Debug Verification Script Plan"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
