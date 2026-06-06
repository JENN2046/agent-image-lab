#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adapter = require("../adapters/runtime/ail_dailynote_write_adapter");
const fixture = require("../tests/fixtures/ail_dailynote_write_adapter_attempt_018_confirmed.fixture.json");

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function expectThrows(id, fn, pattern) {
  check(id, () => {
    try {
      fn();
      return false;
    } catch (error) {
      return pattern.test(error.message);
    }
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepSet(target, pathParts, value) {
  let cursor = target;
  for (const part of pathParts.slice(0, -1)) {
    cursor = cursor[part];
  }
  cursor[pathParts[pathParts.length - 1]] = value;
  return target;
}

const envelope = adapter.buildDailyNoteWriteEnvelope(fixture);
const schemaText = readText("schemas/ail_dailynote_write_adapter.schema.yaml");
const packageJson = JSON.parse(readText("package.json"));
const manifestText = readText("scripts/validation_manifest.json");

check("adapter_file_exists", () => fileExists("adapters/runtime/ail_dailynote_write_adapter.js"));
check("schema_file_exists", () => fileExists("schemas/ail_dailynote_write_adapter.schema.yaml"));
check("fixture_file_exists", () => fileExists("tests/fixtures/ail_dailynote_write_adapter_attempt_018_confirmed.fixture.json"));
check("adapter_id", () => envelope.adapter_id === adapter.adapterId);
check("schema_id", () => envelope.schema === adapter.envelopeSchema);
check("status_payload_ready_no_write", () => envelope.status === "payload_ready_no_write");
check("can_execute_now_false", () => envelope.can_execute_now === false);
check("selected_plugin_daily_note_write", () => envelope.selected_plugin.plugin_id === "DailyNoteWrite");
check("root_class_expected", () => envelope.selected_plugin.root_class_expected === "vcp_root_dailynote");
check("command_not_resolved_now", () => envelope.selected_plugin.command_resolved_now === false);
check("payload_uses_notebook_folder_syntax", () => envelope.daily_note_write_payload.maidName === "[Image_Case_Archive]Archivist_Agent");
check("payload_date_from_approval", () => envelope.daily_note_write_payload.dateString === "2026-06-06");
check("payload_has_chinese_body", () => /[\u3400-\u9fff]/.test(envelope.daily_note_write_payload.contentText));
check("payload_ends_with_tag_line", () => /^Tag:\s*AgentImageLab, 精华瓶, 最终候选, 商品图, 高端护肤$/.test(envelope.daily_note_write_payload.contentText.split(/\r?\n/).slice(-1)[0]));
check("payload_filename_single_component", () =>
  envelope.daily_note_write_payload.fileName === "md-secretless-serum-attempt-018-final-candidate-20260606.txt" &&
  !/[\\/]/.test(envelope.daily_note_write_payload.fileName)
);
check("execution_audit_schema", () => envelope.execution_audit_stub.schema === adapter.executionAuditSchema);
check("execution_audit_no_write", () =>
  envelope.execution_audit_stub.DailyNoteWrite_called === false &&
  envelope.execution_audit_stub.actual_write_performed === false &&
  envelope.execution_audit_stub.canonical_target_file_exists === false &&
  envelope.execution_audit_stub.canonical_target_hash_match === false
);
check("wrong_location_not_success", () => envelope.execution_audit_stub.wrong_location_file_is_success === false);
check("rollback_schema", () => envelope.rollback_or_revoke_plan.schema === adapter.rollbackSchema);
check("rollback_no_destructive_cleanup", () => envelope.rollback_or_revoke_plan.destructive_cleanup_allowed_now === false);
check("guard_blocks_plugin_call_now", () =>
  envelope.guard.preflight_only === true &&
  envelope.guard.calls_vcptoolbox_plugin_now === false &&
  envelope.guard.reads_vcp_config_now === false &&
  envelope.guard.writes_daily_note_now === false &&
  envelope.guard.plugin_success_sufficient === false
);
check("side_effect_flags_all_false", () => Object.values(envelope.side_effect_flags).every((value) => value === false));
check("audit_side_effect_flags_all_false", () => Object.values(envelope.execution_audit_stub.side_effect_flags).every((value) => value === false));
check("schema_names_envelope_audit_rollback", () =>
  schemaText.includes("ail_dailynote_write_envelope.v1") &&
  schemaText.includes("execution_audit_schema") &&
  schemaText.includes("rollback_or_revoke_schema")
);
check("schema_declares_canonical_hash_required", () =>
  schemaText.includes("canonical_root_preflight_required: true") &&
  schemaText.includes("canonical_target_hash_match: false") &&
  schemaText.includes("plugin_success_sufficient: false")
);
check("package_script_registered", () =>
  packageJson.scripts["validate:ail-dailynote-write-adapter"] === "node scripts/validate_ail_dailynote_write_adapter.js"
);
check("manifest_entry_registered", () =>
  manifestText.includes('"id": "ail_dailynote_write_adapter"') &&
  manifestText.includes('"adapters/runtime/ail_dailynote_write_adapter.js"') &&
  manifestText.includes('"schemas/ail_dailynote_write_adapter.schema.yaml"')
);

expectThrows("negative_draft_memory_delta_rejected", () => {
  adapter.buildDailyNoteWriteEnvelope(deepSet(clone(fixture), ["memory_delta", "write_mode"], "draft"));
}, /write_mode must be confirmed/);

expectThrows("negative_pending_approval_rejected", () => {
  adapter.buildDailyNoteWriteEnvelope(deepSet(clone(fixture), ["memory_delta", "approval_status"], "pending"));
}, /approval_status must be approved/);

expectThrows("negative_secret_safety_flag_rejected", () => {
  adapter.buildDailyNoteWriteEnvelope(deepSet(clone(fixture), ["memory_delta", "memory_safety", "contains_secret"], true));
}, /contains_secret must be false/);

expectThrows("negative_private_path_ref_rejected", () => {
  adapter.buildDailyNoteWriteEnvelope(deepSet(clone(fixture), ["memory_delta", "preserved_original", "file_ref"], "C:/private/raw/path.png"));
}, /project-relative/);

expectThrows("negative_missing_authorization_rejected", () => {
  const bad = clone(fixture);
  bad.authorization.daily_note_write_authorized = false;
  adapter.buildDailyNoteWriteEnvelope(bad);
}, /daily_note_write_authorized must be true/);

expectThrows("negative_wrong_root_class_rejected", () => {
  const bad = clone(fixture);
  bad.authorization.expected_root_class = "plugin_dir_dailynote";
  adapter.buildDailyNoteWriteEnvelope(bad);
}, /expected_root_class must be vcp_root_dailynote/);

expectThrows("negative_actual_write_flag_rejected", () => {
  const badEnvelope = clone(envelope);
  badEnvelope.execution_audit_stub.actual_write_performed = true;
  adapter.validateDailyNoteWriteEnvelope(badEnvelope);
}, /actual_write_performed must be false/);

const summary = {
  passed,
  validator: "validate_ail_dailynote_write_adapter",
  adapter_id: adapter.adapterId,
  check_count: results.length,
  failed_count: results.filter((result) => !result.passed).length,
  preflight_only: true,
  calls_vcptoolbox_plugin_now: false,
  reads_vcp_config_now: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  secret_value_read_performed: false,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (!passed) process.exitCode = 1;
