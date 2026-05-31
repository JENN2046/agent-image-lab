#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const snapshotPath = "tests/schema_examples/readonly_visual_review_mvp_state.example.json";
const catalogPath = "tests/schema_examples/visual_eval_readonly_review_artifact_catalog.example.json";
const rendererPath = "tests/schema_examples/visual_eval_readonly_review_corpus_renderer.example.json";
const handoffPath = "tests/schema_examples/visual_eval_review_console_readonly_corpus_renderer_static_handoff.example.json";
const docPath = "docs/READONLY_VISUAL_REVIEW_MVP.md";
const staticFiles = {
  index: "review_console/static_prototype/index.html",
  app: "review_console/static_prototype/app.js",
  mock: "review_console/static_prototype/mock_data.js",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
};

const expectedOutcomes = ["pass", "patch", "reject"];
const expectedNextActions = [
  "queue_for_future_human_review",
  "write_patch_plan_only",
  "defer_until_taxonomy_update",
];
const expectedMetadataSections = [
  "accepted_metadata_candidates",
  "archive_references",
  "next_review_actions",
  "patch_plan_only",
  "failure_learning_metadata",
];
const expectedTaxonomyTags = [
  "material_failed",
  "lighting_failed",
  "subject_drift",
  "commercial_unusable",
];
const forbiddenRouteFlags = [
  "fetch_performed",
  "file_write_performed",
  "approval_write_performed",
  "accepted_samples_write_performed",
  "accepted_samples_written",
  "production_candidate_created",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "DailyNote_written",
  "VCP_memory_write_performed",
  "VCP_memory_written",
  "memory_write_performed",
  "memory_written",
  "Batch_005_started",
  "production_candidate_002_started",
  "runtime_execution_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
];
const negativeCases = [
  {
    case_id: "missing_reject_row",
    expected_failure_code: "mvp_outcomes_cover_pass_patch_reject",
    mutate(state) {
      state.review_rows = state.review_rows.filter((row) => row.outcome !== "reject");
    },
  },
  {
    case_id: "guard_image_generation_true",
    expected_failure_code: "mvp_forbidden_routes_closed",
    mutate(state) {
      state.guard_summary.image_generation_performed = true;
    },
  },
  {
    case_id: "missing_catalog_role",
    expected_failure_code: "mvp_catalog_roles_match_snapshot",
    mutate(state) {
      state.catalog_summary.canonical_roles = state.catalog_summary.canonical_roles.filter((role) => role !== "readonly_review_corpus_renderer");
      state.catalog_summary.canonical_role_count = state.catalog_summary.canonical_roles.length;
    },
  },
  {
    case_id: "renderer_ref_drift",
    expected_failure_code: "mvp_source_renderer_ref_matches",
    mutate(state) {
      state.source_renderer_ref = "tests/schema_examples/unknown_visual_eval_renderer.example.json";
    },
  },
];

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function runNode(scriptPath, args = []) {
  return execFileSync(process.execPath, [scriptPath, ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 60000,
  });
}

function parseJson(text) {
  return JSON.parse(text.trim());
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail !== undefined) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function sameSet(actual, expected) {
  return Array.isArray(actual) &&
    actual.length === expected.length &&
    expected.every((item) => actual.includes(item));
}

function stableJson(value) {
  return JSON.stringify(value);
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function hasSecretLikeValue(value) {
  if (typeof value === "string") {
    return /(?:Authorization\s*:|Bearer\s+[A-Za-z0-9._~+/=-]{12,}|Basic\s+[A-Za-z0-9+/=-]{12,}|sk-[A-Za-z0-9]{16,}|AKLT[A-Za-z0-9]{10,})/.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasSecretLikeValue(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasSecretLikeValue(item));
  return false;
}

function createFakeElement(initial = {}) {
  return {
    children: [],
    dataset: initial.dataset || {},
    files: [],
    value: initial.value || "",
    textContent: initial.textContent || "",
    innerHTML: "",
    title: "",
    className: initial.className || "",
    classList: {
      add() {},
      remove() {},
      toggle() {},
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    setAttribute(name, value) {
      this[name] = String(value);
    },
    addEventListener() {},
    querySelector(selector) {
      if (!this.__queryChildren) this.__queryChildren = {};
      if (!this.__queryChildren[selector]) this.__queryChildren[selector] = createFakeElement();
      return this.__queryChildren[selector];
    },
  };
}

function loadStaticMock() {
  const context = { window: {} };
  vm.runInNewContext(read(staticFiles.mock), context, { filename: staticFiles.mock, timeout: 1000 });
  return context.window.REVIEW_CONSOLE_MOCK;
}

function loadRenderedDraft(mock) {
  const elements = new Map();
  const ensureElement = (id, initial = {}) => {
    if (!elements.has(id)) elements.set(id, createFakeElement(initial));
    return elements.get(id);
  };

  ensureElement("memoryTitle", { value: mock.review_session.memory_preview.chinese_diary_title });
  ensureElement("memoryContent", { value: mock.review_session.memory_preview.chinese_diary_content });
  ensureElement("draftOutput");

  const archiveButtons = ["accepted", "candidate", "rejected", "draft"].map((archive) =>
    createFakeElement({ dataset: { archive } })
  );
  const memoryButtons = ["approved", "rejected", "pending"].map((memory) =>
    createFakeElement({ dataset: { memory } })
  );
  const lifecycleButtons = ["all", "recoverable", "blocked"].map((lifecycleFilter) =>
    createFakeElement({ dataset: { lifecycleFilter } })
  );

  const context = {
    window: { REVIEW_CONSOLE_MOCK: mock },
    document: {
      querySelector(selector) {
        if (selector.startsWith("#")) return ensureElement(selector.slice(1));
        throw new Error(`Unsupported static prototype selector: ${selector}`);
      },
      querySelectorAll(selector) {
        if (selector === "[data-archive]") return archiveButtons;
        if (selector === "[data-memory]") return memoryButtons;
        if (selector === "[data-lifecycle-filter]") return lifecycleButtons;
        return [];
      },
      createElement() {
        return createFakeElement();
      },
    },
  };

  vm.runInNewContext(read(staticFiles.app), context, { filename: staticFiles.app, timeout: 5000 });
  return JSON.parse(ensureElement("draftOutput").value).readonly_visual_review_mvp_state;
}

function expectedReviewRowsFromHandoff(handoff) {
  return handoff.display_rows.map((row) => ({
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    case_id: row.case_id,
    outcome: row.outcome,
    summary: row.summary,
    reasons: row.reasons,
    taxonomy_tags: row.taxonomy_tags,
    blocking_watch_items: row.blocking_watch_items,
    next_review_action: row.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation_action,
    metadata_queue_sections: row.metadata_queue_sections,
    write_allowed: row.write_allowed,
  }));
}

function validateMvpState(state, fixtures) {
  const { catalog, handoff } = fixtures;
  const roles = (catalog.artifact_entries || []).map((entry) => entry.artifact_role);

  addResult("mvp_state_type", state.state_type === "metadata_only_readonly_visual_review_mvp_state");
  addResult("mvp_status_draft_ready", state.status === "draft_ready");
  addResult("mvp_display_only_true", state.display_only === true);
  addResult("mvp_source_catalog_ref_matches", state.source_artifact_catalog_ref === catalogPath);
  addResult("mvp_source_renderer_ref_matches", state.source_renderer_ref === rendererPath);
  addResult("mvp_source_console_handoff_ref_matches", state.source_console_handoff_ref === handoffPath);
  addResult("mvp_no_absolute_or_loopback", !hasAbsoluteOrLoopback(state));
  addResult("mvp_no_secret_like_value", !hasSecretLikeValue(state));
  addResult("mvp_catalog_count_24", state.catalog_summary?.artifact_count === 24 && (catalog.artifact_entries || []).length === 24);
  addResult("mvp_catalog_roles_match_snapshot", sameSet(state.catalog_summary?.canonical_roles, roles));
  addResult("mvp_catalog_repo_relative_true", state.catalog_summary?.all_artifacts_repo_relative === true);
  addResult("mvp_catalog_validators_must_pass_true", state.catalog_summary?.validators_must_pass === true);
  addResult("mvp_review_rows_match_handoff", stableJson(state.review_rows) === stableJson(expectedReviewRowsFromHandoff(handoff)));
  addResult("mvp_review_rows_count_3", Array.isArray(state.review_rows) && state.review_rows.length === 3);
  addResult("mvp_outcomes_cover_pass_patch_reject", sameSet((state.review_rows || []).map((row) => row.outcome), expectedOutcomes));
  addResult("mvp_outcome_summary_matches_handoff", stableJson(state.outcome_summary) === stableJson(handoff.outcome_sections));
  addResult("mvp_taxonomy_tags_visible", sameSet(state.taxonomy_summary?.visible_tags, expectedTaxonomyTags));
  addResult("mvp_metadata_sections_visible", sameSet(state.metadata_queue_sections, expectedMetadataSections));
  addResult("mvp_next_actions_visible", sameSet(state.next_actions, expectedNextActions));
  addResult("mvp_rows_write_allowed_false", (state.review_rows || []).every((row) => row.write_allowed === false));
  addResult("mvp_guard_metadata_readonly_static_true", state.guard_summary?.metadata_only === true && state.guard_summary?.read_only === true && state.guard_summary?.static_ui_only === true);
  addResult("mvp_forbidden_routes_closed", forbiddenRouteFlags.every((flag) => state.guard_summary?.[flag] !== true));
}

function collectFailureCodes(fn) {
  const startResults = results.length;
  const startErrors = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("mvp_negative_case_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function assertStaticSourceCoverage() {
  const index = read(staticFiles.index);
  const app = read(staticFiles.app);
  const mock = read(staticFiles.mock);
  const styles = read(staticFiles.styles);
  const readme = read(staticFiles.readme);
  const fieldMapping = read(staticFiles.fieldMapping);
  const requiredIndexIds = [
    "readonlyVisualReviewMvpTitle",
    "readonlyVisualReviewMvpSummary",
    "readonlyVisualReviewMvpCatalog",
    "readonlyVisualReviewMvpRows",
    "readonlyVisualReviewMvpTaxonomy",
    "readonlyVisualReviewMvpGuard",
  ];
  for (const id of requiredIndexIds) {
    addResult(`mvp_static_index_${id}_present`, index.includes(id));
  }
  addResult("mvp_static_app_state_function_present", app.includes("function readonlyVisualReviewMvpState"));
  addResult("mvp_static_app_render_function_present", app.includes("function renderReadonlyVisualReviewMvp"));
  addResult("mvp_static_app_draft_output_key_present", app.includes("readonly_visual_review_mvp_state"));
  addResult("mvp_static_mock_seed_present", mock.includes("readonly_visual_review_mvp_seed"));
  addResult("mvp_static_styles_present", styles.includes(".readonly-visual-review-mvp"));
  addResult("mvp_static_readme_documents_state", readme.includes("readonly_visual_review_mvp_state"));
  addResult("mvp_static_field_mapping_documents_state", fieldMapping.includes("readonly_visual_review_mvp_state"));
}

function assertPackageAndMvpWiring() {
  const pkg = read("package.json");
  const mvp = read("scripts/validate_mvp_core.js");
  addResult("mvp_package_script_present", pkg.includes("\"validate:readonly-visual-review-mvp\""));
  addResult("mvp_core_validator_wired", mvp.includes("scripts/validate_readonly_visual_review_mvp.js"));
}

function assertExistingValidatorsStillPass() {
  const validatorInvocations = [
    {
      script: "scripts/validate_visual_eval_readonly_review_artifact_system.js",
      args: ["--skip-validator-runs"],
      skipField: "validator_runs_skipped",
    },
    {
      script: "scripts/validate_visual_eval_review_console_readonly_corpus_renderer.js",
      args: [],
    },
    {
      script: "scripts/validate_visual_eval_readonly_review_artifact_catalog.js",
      args: ["--skip-referenced-validators"],
      skipField: "referenced_validators_skipped",
    },
  ];
  for (const invocation of validatorInvocations) {
    const result = parseJson(runNode(invocation.script, invocation.args));
    const validatorId = path.basename(invocation.script, ".js");
    if (invocation.skipField) {
      addResult(`mvp_existing_validator_${validatorId}_${invocation.skipField}`, result[invocation.skipField] === true);
    }
    addResult(`mvp_existing_validator_${validatorId}_passed`, result.passed === true);
  }
}

const fixtures = {
  snapshot: readJson(snapshotPath),
  catalog: readJson(catalogPath),
  handoff: readJson(handoffPath),
};
const mock = loadStaticMock();
const renderedState = loadRenderedDraft(mock);

for (const relativePath of [snapshotPath, catalogPath, rendererPath, handoffPath, docPath, ...Object.values(staticFiles)]) {
  addResult(`mvp_file_exists_${relativePath}`, fs.existsSync(repoPath(relativePath)));
}

validateMvpState(fixtures.snapshot, fixtures);
addResult("mvp_rendered_draft_matches_snapshot", stableJson(renderedState) === stableJson(fixtures.snapshot));
assertStaticSourceCoverage();
assertPackageAndMvpWiring();
assertExistingValidatorsStillPass();

const negativeResults = negativeCases.map((negativeCase) => {
  const mutated = deepClone(fixtures.snapshot);
  negativeCase.mutate(mutated);
  const failureCodes = collectFailureCodes(() => validateMvpState(mutated, fixtures));
  return {
    case_id: negativeCase.case_id,
    expected_failure_code: negativeCase.expected_failure_code,
    passed: failureCodes.includes(negativeCase.expected_failure_code),
    failure_codes: failureCodes,
  };
});

for (const negativeResult of negativeResults) {
  addResult(`mvp_negative_${negativeResult.case_id}`, negativeResult.passed, negativeResult.failure_codes);
}

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "validate_readonly_visual_review_mvp",
  artifact_count: fixtures.snapshot.catalog_summary.artifact_count,
  review_row_count: fixtures.snapshot.review_rows.length,
  negative_case_count: negativeResults.length,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  file_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
  results,
  negative_results: negativeResults,
  errors,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
process.exit(output.passed ? 0 : 1);
