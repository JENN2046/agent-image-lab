const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
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

function fileContent(p) {
  const fullPath = path.join(root, p);
  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf8");
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

// === task queue — real check ===

check("task_queue_no_auto_v7", () => {
  const content = fileContent(".agent_board/TASK_QUEUE.md");
  if (!content) return false;

  // Extract the "### todo" section (text between ### todo and next ### heading)
  const todoMatch = content.match(/### todo[\r\n]+```text[\r\n]+([\s\S]*?)```/);
  if (!todoMatch) return false;
  const todoText = todoMatch[1];

  // Patterns that would indicate automatic progression to forbidden phases
  const autoPatterns = [
    /auto.*v7/i,
    /auto.*production/i,
    /auto.*real[\s.]*exec/i,
    /auto.*a5/i,
    /v7\s+is\s+next/i,
  ];

  for (const pat of autoPatterns) {
    if (pat.test(todoText)) return false;
  }

  // Check in_progress section too
  const inProgressMatch = content.match(/### in_progress\n+```text\n([\s\S]*?)```/);
  if (inProgressMatch) {
    const inProgressText = inProgressMatch[1];
    for (const pat of autoPatterns) {
      if (pat.test(inProgressText)) return false;
    }
  }

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

// === no forbidden APIs in v6 runtime files — real check ===

const v6RuntimeFiles = [
  "review_console/runtime_prototype/app.js",
  "review_console/runtime_prototype/index.html",
  "review_console/runtime_prototype/styles.css",
  "review_console/runtime_prototype/runtime_guard.js",
  "review_console/runtime_prototype/host_bridge_mock.js",
];

const forbiddenApiPatterns = [
  "localStorage",
  "sessionStorage",
  "IndexedDB",
  "fetch(",
  "XMLHttpRequest",
  "child_process",
  "require(",
  "fs.",
  "http.",
  "https.",
  "navigator.clipboard",
  "eval(",
  "Function(",
];

check("no_forbidden_apis_added", () => {
  let clean = true;

  // Specific fs. patterns that indicate Node.js filesystem access (not method calls on variables)
  const fsFilePatterns = [
    "fs.readFile",
    "fs.writeFile",
    "fs.existsSync",
    "fs.appendFile",
    "fs.mkdir",
    "fs.readdir",
    "fs.unlink",
    "fs.stat",
    "fs.watch",
    "fs.createRead",
    "fs.createWrite",
    "fs.copyFile",
    "fs.rename",
    "fs.chmod",
    "fs.open",
    "fs.close",
    "fs.access",
    "fs.realpath",
    "fs.promises",
  ];

  // General forbidden patterns (not including fs. which is checked specifically)
  const generalForbidden = [
    "localStorage",
    "sessionStorage",
    "IndexedDB",
    "fetch(",
    "XMLHttpRequest",
    "child_process",
    "require(",
    "http.",
    "https.",
    "navigator.clipboard",
    "eval(",
    "Function(",
  ];

  for (const filePath of v6RuntimeFiles) {
    const content = fileContent(filePath);
    if (!content) continue;

    // Check general forbidden patterns
    for (const pattern of generalForbidden) {
      if (content.includes(pattern)) {
        clean = false;
      }
    }

    // Check specific fs. patterns
    for (const pattern of fsFilePatterns) {
      if (content.includes(pattern)) {
        clean = false;
      }
    }
  }
  return clean;
});

// === no push/tag/release authorization — real check ===

const authScanFiles = [
  "README.md",
  "RELEASE_NOTES.md",
  "docs/00_project_roadmap.md",
  "docs/243_v6_7_product_runtime_final_acceptance.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/CHECKPOINT.md",
];

const pushTagReleasePatterns = [
  "push_allowed: true",
  "tag_allowed: true",
  "release_allowed: true",
  "github_release_allowed: true",
  "version_action_authorized: true",
];

check("no_push_tag_release_authorization", () => {
  let clean = true;
  for (const filePath of authScanFiles) {
    const content = fileContent(filePath);
    if (!content) continue;
    for (const pattern of pushTagReleasePatterns) {
      if (content.includes(pattern)) {
        clean = false;
      }
    }
  }
  return clean;
});

// === no A5 production authorization — real check ===

const a5AuthPatterns = [
  "A5 production execution: true",
  "a5_authorized: true",
  "real_execution_allowed: true",
  "plugin_called: true",
  "api_called: true",
  "daily_note_called: true",
  "vcp_memory_written: true",
  "image_created: true",
];

check("no_a5_production_authorization", () => {
  let clean = true;
  for (const filePath of authScanFiles) {
    const content = fileContent(filePath);
    if (!content) continue;
    for (const pattern of a5AuthPatterns) {
      if (content.includes(pattern)) {
        clean = false;
      }
    }
  }
  return clean;
});

// === validate_mvp.ps1 includes v6.7 validator — new check ===

check("validate_mvp_ps1_includes_v6_7", () => {
  const content = fileContent("scripts/validate_mvp.ps1");
  if (!content) return false;
  return content.includes("validate_v6_7_product_runtime_final_acceptance.js");
});

// === agent board files contain v6.7 — new check ===

const agentBoardFiles = [
  ".agent_board/HANDOFF.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/VALIDATION_LOG.md",
];

check("agent_board_files_contain_v6_7", () => {
  for (const filePath of agentBoardFiles) {
    const content = fileContent(filePath);
    if (!content) return false;
    if (!content.includes("v6.7") && !content.includes("Product Runtime Baseline")) {
      return false;
    }
  }
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
