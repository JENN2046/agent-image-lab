#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const snapshotPath = "tests/schema_examples/readonly_visual_review_dataset_regression_state.example.json";
const taxonomyPath = "tests/schema_examples/visual_eval_failure_taxonomy.example.json";
const mvpSnapshotPath = "tests/schema_examples/readonly_visual_review_mvp_state.example.json";
const staticFiles = {
  index: "review_console/static_prototype/index.html",
  app: "review_console/static_prototype/app.js",
  mock: "review_console/static_prototype/mock_data.js",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
};

const expectedDimensions = [
  "subject_identity",
  "commercial_usability",
  "material_realism",
  "lighting_consistency",
  "composition",
  "edge_or_mask_artifact",
  "background_contamination",
];
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
    case_id: "missing_dimension_reject_row",
    expected_failure_code: "dataset_dimension_outcomes_exact",
    mutate(state) {
      state.review_rows = state.review_rows.filter(
        (row) => !(row.dimension_id === "composition" && row.outcome === "reject")
      );
      state.review_row_count = state.review_rows.length;
    },
  },
  {
    case_id: "dimension_missing_patch_outcome",
    expected_failure_code: "dataset_dimension_outcomes_exact",
    mutate(state) {
      state.review_rows = state.review_rows.filter(
        (row) => !(row.dimension_id === "lighting_consistency" && row.outcome === "patch")
      );
      state.review_row_count = state.review_rows.length;
    },
  },
  {
    case_id: "needs_revision_as_formal_outcome",
    expected_failure_code: "dataset_no_needs_revision_formal_outcome",
    mutate(state) {
      const row = state.review_rows.find((candidate) => candidate.outcome === "patch");
      row.outcome = "needs_revision";
    },
  },
  {
    case_id: "unknown_taxonomy_tag",
    expected_failure_code: "dataset_taxonomy_tags_known",
    mutate(state) {
      const row = state.review_rows.find((candidate) => candidate.outcome === "reject");
      row.taxonomy_tags = ["unknown_failure_tag"];
    },
  },
  {
    case_id: "cross_dimension_patch_tag",
    expected_failure_code: "dataset_dimension_taxonomy_tags_match",
    mutate(state) {
      const row = state.review_rows.find(
        (candidate) => candidate.dimension_id === "subject_identity" && candidate.outcome === "patch"
      );
      row.taxonomy_tags = ["material_failed"];
    },
  },
  {
    case_id: "guard_runtime_true",
    expected_failure_code: "dataset_forbidden_routes_closed",
    mutate(state) {
      state.guard_summary.runtime_execution_performed = true;
    },
  },
  {
    case_id: "write_allowed_true",
    expected_failure_code: "dataset_rows_write_allowed_false",
    mutate(state) {
      state.review_rows[0].write_allowed = true;
    },
  },
  {
    case_id: "snapshot_rendered_drift",
    expected_failure_code: "dataset_rendered_draft_matches_snapshot",
    mutate(state) {
      state.review_rows[0].summary = "Drifted summary.";
    },
  },
  {
    case_id: "windows_absolute_path_leak",
    expected_failure_code: "dataset_no_absolute_or_loopback",
    mutate(state) {
      state.review_rows[0].summary = "C:\\Users\\example\\secret.png";
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
    style: {
      setProperty(name, value) {
        this[name] = String(value);
      },
    },
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
  const classElements = new Map();
  const ensureElement = (id, initial = {}) => {
    if (!elements.has(id)) elements.set(id, createFakeElement(initial));
    return elements.get(id);
  };
  const ensureClassElement = (className) => {
    if (!classElements.has(className)) {
      classElements.set(className, createFakeElement({ className }));
    }
    return classElements.get(className);
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
        if (/^\.[A-Za-z0-9_-]+$/.test(selector)) return ensureClassElement(selector.slice(1));
        throw new Error(`Unsupported static prototype selector: ${selector}`);
      },
      querySelectorAll(selector) {
        if (selector === "[data-archive]") return archiveButtons;
        if (selector === "[data-memory]") return memoryButtons;
        if (selector === "[data-lifecycle-filter]") return lifecycleButtons;
        if (/^\.[A-Za-z0-9_-]+$/.test(selector)) return [];
        return [];
      },
      createElement() {
        return createFakeElement();
      },
    },
  };

  vm.runInNewContext(read(staticFiles.app), context, { filename: staticFiles.app, timeout: 5000 });
  return JSON.parse(ensureElement("draftOutput").value).readonly_visual_review_dataset_regression_state;
}

function taxonomyTags(taxonomy) {
  return new Set((taxonomy.categories || []).flatMap((category) =>
    (category.failure_tags || []).map((tag) => tag.tag_id)
  ));
}

function tagsBySeverity(taxonomy, severity) {
  return new Set((taxonomy.categories || []).flatMap((category) =>
    (category.failure_tags || [])
      .filter((tag) => tag.severity === severity)
      .map((tag) => tag.tag_id)
  ));
}

function tagsByCategoryAndSeverity(taxonomy, severity) {
  return new Map((taxonomy.categories || []).map((category) => [
    category.category_id,
    new Set((category.failure_tags || [])
      .filter((tag) => tag.severity === severity)
      .map((tag) => tag.tag_id)),
  ]));
}

function rowsByDimension(state, dimensionId) {
  return (state.review_rows || []).filter((row) => row.dimension_id === dimensionId);
}

function validateDatasetState(state, fixtures, options = {}) {
  const { taxonomy, mock, renderedState } = fixtures;
  const allTags = taxonomyTags(taxonomy);
  const patchableTags = tagsBySeverity(taxonomy, "patchable");
  const blockingTags = tagsBySeverity(taxonomy, "blocking");
  const patchableTagsByDimension = tagsByCategoryAndSeverity(taxonomy, "patchable");
  const blockingTagsByDimension = tagsByCategoryAndSeverity(taxonomy, "blocking");
  const seed = mock.readonly_visual_review_dataset_regression_seed;
  const seedByDimension = new Map((seed?.dimensions || []).map((dimension) => [dimension.dimension_id, dimension]));
  const seedDimensions = (seed?.dimensions || []).map((dimension) => dimension.dimension_id);
  const patchTags = (state.taxonomy_coverage?.patch_tags || []);
  const rejectTags = (state.taxonomy_coverage?.reject_tags || []);
  const allRowTags = (state.review_rows || []).flatMap((row) => row.taxonomy_tags || []);

  addResult("dataset_state_type", state.state_type === "metadata_only_readonly_visual_review_dataset_regression_state");
  addResult("dataset_status_draft_ready", state.status === "draft_ready");
  addResult("dataset_display_only_true", state.display_only === true);
  addResult("dataset_source_refs_match", state.source_taxonomy_ref === taxonomyPath && state.source_mvp_state_ref === mvpSnapshotPath);
  addResult("dataset_needs_revision_alias_maps_patch", state.outcome_aliases?.needs_revision === "patch");
  addResult("dataset_no_needs_revision_formal_outcome", !(state.review_rows || []).some((row) => row.outcome === "needs_revision"));
  addResult("dataset_dimension_count_7", state.dimension_count === 7 && (state.dimensions || []).length === 7);
  addResult("dataset_review_row_count_21", state.review_row_count === 21 && (state.review_rows || []).length === 21);
  addResult("dataset_dimensions_exact", sameSet((state.dimensions || []).map((dimension) => dimension.dimension_id), expectedDimensions));
  addResult("dataset_static_mock_dimensions_exact", sameSet(seedDimensions, expectedDimensions));

  for (const dimension of expectedDimensions) {
    const rows = rowsByDimension(state, dimension);
    addResult("dataset_dimension_outcomes_exact", sameSet(rows.map((row) => row.outcome), expectedOutcomes), dimension);
  }

  const outcomeTotals = Object.fromEntries((state.outcome_totals || []).map((entry) => [entry.outcome, entry.count]));
  addResult("dataset_outcome_totals_7_each", expectedOutcomes.every((outcome) => outcomeTotals[outcome] === 7));
  addResult("dataset_next_actions_visible", sameSet(state.next_actions, expectedNextActions));
  addResult("dataset_metadata_sections_visible", sameSet(state.metadata_queue_sections, expectedMetadataSections));
  addResult("dataset_rows_write_allowed_false", (state.review_rows || []).every((row) => row.write_allowed === false));
  addResult("dataset_taxonomy_tags_known", allRowTags.every((tag) => allTags.has(tag)));
  addResult("dataset_patch_tags_patchable", patchTags.every((tag) => patchableTags.has(tag)));
  addResult("dataset_reject_tags_blocking", rejectTags.every((tag) => blockingTags.has(tag)));
  addResult("dataset_taxonomy_patch_coverage_7", patchTags.length === 7 && sameSet(patchTags, (seed?.dimensions || []).map((dimension) => dimension.patch_tag)));
  addResult("dataset_taxonomy_reject_coverage_7", rejectTags.length === 7 && sameSet(rejectTags, (seed?.dimensions || []).map((dimension) => dimension.reject_tag)));
  addResult("dataset_dimension_taxonomy_tags_match", (state.review_rows || [])
    .filter((row) => row.outcome === "patch" || row.outcome === "reject")
    .every((row) => {
      const tag = row.taxonomy_tags?.[0];
      const seedDimension = seedByDimension.get(row.dimension_id);
      const expectedTag = row.outcome === "patch" ? seedDimension?.patch_tag : seedDimension?.reject_tag;
      const categoryTags = row.outcome === "patch"
        ? patchableTagsByDimension.get(row.dimension_id)
        : blockingTagsByDimension.get(row.dimension_id);
      return row.taxonomy_tags.length === 1 &&
        tag === expectedTag &&
        categoryTags instanceof Set &&
        categoryTags.has(tag);
    }));

  addResult("dataset_pass_rows_clean", (state.review_rows || [])
    .filter((row) => row.outcome === "pass")
    .every((row) => row.taxonomy_tags.length === 0 &&
      row.blocking_watch_items.length === 0 &&
      row.next_review_action === "queue_for_future_human_review" &&
      row.outcome_alias === null));
  addResult("dataset_patch_rows_bounded", (state.review_rows || [])
    .filter((row) => row.outcome === "patch")
    .every((row) => row.outcome_alias === "needs_revision" &&
      row.taxonomy_tags.length === 1 &&
      patchableTags.has(row.taxonomy_tags[0]) &&
      row.blocking_watch_items.length === 1 &&
      row.next_review_action === "write_patch_plan_only" &&
      row.metadata_queue_sections.includes("patch_plan_only")));
  addResult("dataset_reject_rows_blocking", (state.review_rows || [])
    .filter((row) => row.outcome === "reject")
    .every((row) => row.outcome_alias === null &&
      row.taxonomy_tags.length === 1 &&
      blockingTags.has(row.taxonomy_tags[0]) &&
      row.blocking_watch_items.length === 1 &&
      row.next_review_action === "defer_until_taxonomy_update" &&
      row.metadata_queue_sections.includes("failure_learning_metadata")));

  addResult("dataset_guard_metadata_readonly_static_true", state.guard_summary?.metadata_only === true &&
    state.guard_summary?.read_only === true &&
    state.guard_summary?.static_ui_only === true);
  addResult("dataset_forbidden_routes_closed", forbiddenRouteFlags.every((flag) => state.guard_summary?.[flag] !== true));
  addResult("dataset_no_absolute_or_loopback", !hasAbsoluteOrLoopback(state));
  addResult("dataset_no_secret_like_value", !hasSecretLikeValue(state));

  if (options.compareRendered !== false) {
    addResult("dataset_rendered_draft_matches_snapshot", stableJson(renderedState) === stableJson(state));
  }
}

function collectFailureCodes(fn) {
  const startResults = results.length;
  const startErrors = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("dataset_negative_case_exception", false, error.message);
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
  const pkg = read("package.json");
  const mvp = read("scripts/validate_mvp_core.js");
  const requiredIndexIds = [
    "readonlyVisualReviewDatasetTitle",
    "readonlyVisualReviewDatasetSummary",
    "readonlyVisualReviewDatasetCoverage",
    "readonlyVisualReviewDatasetRows",
    "readonlyVisualReviewDatasetGuard",
  ];
  for (const id of requiredIndexIds) {
    addResult(`dataset_static_index_${id}_present`, index.includes(id));
  }
  addResult("dataset_static_app_state_function_present", app.includes("function readonlyVisualReviewDatasetRegressionState"));
  addResult("dataset_static_app_render_function_present", app.includes("function renderReadonlyVisualReviewDatasetRegression"));
  addResult("dataset_static_app_draft_output_key_present", app.includes("readonly_visual_review_dataset_regression_state"));
  addResult("dataset_static_mock_seed_present", mock.includes("readonly_visual_review_dataset_regression_seed"));
  addResult("dataset_static_styles_present", styles.includes(".readonly-visual-review-dataset"));
  addResult("dataset_static_readme_documents_state", readme.includes("readonly_visual_review_dataset_regression_state"));
  addResult("dataset_static_field_mapping_documents_state", fieldMapping.includes("readonly_visual_review_dataset_regression_state"));
  addResult("dataset_package_script_present", pkg.includes("\"validate:readonly-visual-review-dataset-regression\""));
  addResult("dataset_mvp_core_validator_wired", mvp.includes("scripts/validate_readonly_visual_review_dataset_regression.js"));
}

const fixtures = {
  snapshot: readJson(snapshotPath),
  taxonomy: readJson(taxonomyPath),
  mvpSnapshot: readJson(mvpSnapshotPath),
};
fixtures.mock = loadStaticMock();
fixtures.renderedState = loadRenderedDraft(fixtures.mock);

for (const relativePath of [snapshotPath, taxonomyPath, mvpSnapshotPath, ...Object.values(staticFiles)]) {
  addResult(`dataset_file_exists_${relativePath}`, fs.existsSync(repoPath(relativePath)));
}

validateDatasetState(fixtures.snapshot, fixtures);
assertStaticSourceCoverage();

const negativeResults = negativeCases.map((negativeCase) => {
  const mutated = deepClone(fixtures.snapshot);
  negativeCase.mutate(mutated);
  const failureCodes = collectFailureCodes(() => validateDatasetState(mutated, fixtures));
  return {
    case_id: negativeCase.case_id,
    expected_failure_code: negativeCase.expected_failure_code,
    passed: failureCodes.includes(negativeCase.expected_failure_code),
    failure_codes: failureCodes,
  };
});

for (const negativeResult of negativeResults) {
  addResult(`dataset_negative_${negativeResult.case_id}`, negativeResult.passed, negativeResult.failure_codes);
}

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "validate_readonly_visual_review_dataset_regression",
  dimension_count: fixtures.snapshot.dimension_count,
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
