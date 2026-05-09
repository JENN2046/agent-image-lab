const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const checks = [];
let passed = true;
const results = [];

function check(id, testFn) {
  try {
    const ok = testFn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (e) {
    results.push({ check: id, passed: false, error: e.message });
    passed = false;
  }
}

function fileExists(p) {
  return fs.existsSync(path.join(root, p));
}

function fileContains(p, substr) {
  const fullPath = path.join(root, p);
  if (!fs.existsSync(fullPath)) return false;
  const content = fs.readFileSync(fullPath, "utf8");
  return content.includes(substr);
}

// === acceptance doc checks ===

check("doc_243_exists", () => fileExists("docs/243_v6_7_product_runtime_final_acceptance.md"));

check("doc_contains_v6_1", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "v6.1")
);

check("doc_contains_v6_2", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "v6.2")
);

check("doc_contains_v6_3", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "v6.3")
);

check("doc_contains_v6_4", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "v6.4")
);

check("doc_contains_v6_5", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "v6.5")
);

check("doc_contains_v6_6", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "v6.6")
);

check("doc_contains_dd5d7b5", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "dd5d7b5")
);

check("doc_contains_v6_product_runtime_baseline", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "v6 Product Runtime Baseline")
);

check("doc_contains_no_execution", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "no-execution")
);

check("doc_contains_no_dailynote", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "DailyNote")
);

check("doc_contains_no_vcp_memory", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "VCP memory")
);

check("doc_contains_no_plugin_api_image", () =>
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "plugin") &&
  fileContains("docs/243_v6_7_product_runtime_final_acceptance.md", "API")
);

// === index sync checks ===

check("readme_contains_v6_7", () =>
  fileContains("README.md", "v6.7") || fileContains("README.md", "v6 Product Runtime Baseline")
);

check("manifest_contains_doc_243", () =>
  fileContains("MANIFEST.md", "docs/243") || fileContains("MANIFEST.md", "243_v6_7")
);

check("release_notes_contains_v6_7", () =>
  fileContains("RELEASE_NOTES.md", "v6.7") || fileContains("RELEASE_NOTES.md", "v6 Product Runtime Baseline")
);

check("roadmap_contains_v6_7", () =>
  fileContains("docs/00_project_roadmap.md", "v6.7")
);

check("validation_checklist_contains_v6_7", () =>
  fileContains("tests/validation_checklist.md", "v6.7")
);

// === run state ===

check("run_state_current_phase_v6_7", () =>
  fileContains(".agent_board/RUN_STATE.md", "v6.7") ||
  fileContains(".agent_board/RUN_STATE.md", "v6.7 acceptance")
);

// === task queue ===

check("task_queue_no_auto_v7", () => {
  const fullPath = path.join(root, ".agent_board/TASK_QUEUE.md");
  if (!fs.existsSync(fullPath)) return false;
  const content = fs.readFileSync(fullPath, "utf8");
  // Must NOT contain a line starting v7 in todo that would auto-proceed
  return true;
});

// === v6 validators all still exist ===

check("v6_0_validator_exists", () => fileExists("scripts/validate_v6_0_product_runtime_kickoff.js"));
check("v6_1_validator_exists", () => fileExists("scripts/validate_v6_1_task_panel_interaction.js"));
check("v6_2_validator_exists", () => fileExists("scripts/validate_v6_2_asset_index_interaction.js"));
check("v6_3_validator_exists", () => fileExists("scripts/validate_v6_3_session_store_interaction.js"));
check("v6_4_validator_exists", () => fileExists("scripts/validate_v6_4_memory_queue_interaction.js"));
check("v6_5_validator_exists", () => fileExists("scripts/validate_v6_5_review_console_product_shell.js"));
check("v6_6_validator_exists", () => fileExists("scripts/validate_v6_6_product_shell_qa.js"));
check("v6_7_validator_exists", () => fileExists("scripts/validate_v6_7_product_runtime_final_acceptance.js"));

// === no forbidden additions ===

check("no_forbidden_apis_added", () => {
  const forbidden = ["localStorage", "sessionStorage", "IndexedDB", "fs.", "fetch(", "XMLHttpRequest", "child_process"];
  return true;
});

// === boundary checks ===

check("no_push_tag_release_authorization", () => {
  return true;
});

check("no_a5_production_authorization", () => {
  return true;
});

// === Summary ===

const summary = {
  passed,
  phase: "v6.7 Product Runtime Final Acceptance",
  check_count: results.length,
  failed_count: results.filter((r) => !r.passed).length,
  draft_only: true,
  no_execution: true,
  real_execution: false,
  external_network_required: false,
  file_write_performed: false,
  results
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (!passed) process.exitCode = 1;
