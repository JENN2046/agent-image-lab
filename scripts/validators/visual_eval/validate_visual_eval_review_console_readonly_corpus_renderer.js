#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../../..");
const staticFiles = {
  mock: "review_console/static_prototype/mock_data.js",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
};
const rendererPath = "tests/schema_examples/visual_eval_readonly_review_corpus_renderer.example.json";
const handoffFixturePath = "tests/schema_examples/visual_eval_review_console_readonly_corpus_renderer_static_handoff.example.json";
const expectedHandoffArtifactType = "metadata_only_visual_eval_review_console_readonly_corpus_renderer_static_handoff";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedNextActions = [
  "queue_for_future_human_review",
  "write_patch_plan_only",
  "defer_until_taxonomy_update",
];
const expectedMetadataSections = [
  "accepted_metadata_candidates",
  "patch_plan_only",
  "failure_learning_metadata",
  "archive_references",
  "next_review_actions",
];
const negativeCases = [
  {
    case_id: "missing_patch_display_row",
    expected_failure_code: "static_handoff_rows_match_renderer",
    mutation: { operation: "remove_row_by_outcome", outcome: "patch" },
  },
  {
    case_id: "wrong_renderer_ref",
    expected_failure_code: "static_handoff_source_renderer_matches",
    mutation: { operation: "set_field", field: "source_renderer_ref", value: "tests/schema_examples/unknown_renderer.example.json" },
  },
  {
    case_id: "missing_metadata_sections",
    expected_failure_code: "static_handoff_metadata_sections_exact",
    mutation: { operation: "set_field", field: "metadata_section_panels", value: [] },
  },
  {
    case_id: "guard_image_true",
    expected_failure_code: "static_handoff_guard_image_generation_false",
    mutation: { operation: "set_field", field: "guard.image_generation_performed", value: true },
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
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function createFakeElement(initial = {}) {
  return {
    children: [],
    dataset: initial.dataset || {},
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
  vm.runInNewContext(read(staticFiles.mock), context, { filename: staticFiles.mock });
  return context.window.REVIEW_CONSOLE_MOCK;
}

function stripArtifactMetadata(handoff) {
  const copy = { ...handoff };
  delete copy.artifact_id;
  delete copy.artifact_type;
  return copy;
}

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    cursor = cursor[segments[index]];
  }
  cursor[segments[segments.length - 1]] = value;
}

function applyMutation(handoff, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(handoff, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_row_by_outcome") {
    handoff.display_rows = handoff.display_rows.filter((row) => row.outcome !== negativeCase.mutation.outcome);
    return;
  }
  throw new Error(`unknown mutation operation: ${negativeCase.mutation.operation}`);
}

function collectFailureCodes(fn) {
  const startResults = results.length;
  const startErrors = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("static_handoff_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function loadRenderedStaticDraft(mock) {
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

  vm.runInNewContext(read(staticFiles.app), context, { filename: staticFiles.app });
  return {
    draft: JSON.parse(ensureElement("draftOutput").value),
    elements,
  };
}

function assertStaticSourceCoverage() {
  const indexSource = read(staticFiles.index);
  const appSource = read(staticFiles.app);
  const styleSource = read(staticFiles.styles);
  addResult("static_index_readonly_corpus_section_present", indexSource.includes("readonlyReviewCorpusRendererTitle"));
  addResult("static_index_readonly_corpus_rows_present", indexSource.includes("readonlyReviewCorpusRendererRows"));
  addResult("static_index_readonly_corpus_sections_present", indexSource.includes("readonlyReviewCorpusRendererSections"));
  addResult("static_app_readonly_renderer_state_present", appSource.includes("readonly_review_corpus_renderer"));
  addResult("static_app_readonly_renderer_render_function_present", appSource.includes("function renderReadonlyReviewCorpusRenderer"));
  addResult("static_app_readonly_renderer_draft_output_present", appSource.includes("visual_eval_readonly_review_corpus_renderer_static_handoff"));
  addResult("static_styles_readonly_renderer_classes_present", styleSource.includes(".readonly-review-corpus-card"));
  addResult("static_app_no_forbidden_runtime_calls", !/fetch\s*\(|XMLHttpRequest|writeFile|appendFile|fs\.|eval\s*\(|Function\s*\(/.test(appSource));
}

function validateHandoffAgainstRenderer(handoff, renderer) {
  addResult("static_handoff_status_draft_ready", handoff.status === "draft_ready");
  addResult("static_handoff_display_only_true", handoff.display_only === true);
  addResult("static_handoff_source_renderer_matches", handoff.source_renderer_ref === rendererPath);
  addResult("static_handoff_no_absolute_or_loopback", !hasAbsoluteOrLoopback(handoff));
  addResult("static_handoff_rows_match_renderer", JSON.stringify(handoff.display_rows) === JSON.stringify(renderer.display_model.display_rows.map((row) => ({
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
  }))));
  addResult("static_handoff_outcomes_exact", sameSet(handoff.outcome_sections.map((section) => section.outcome), expectedOutcomes));
  addResult("static_handoff_next_actions_exact", sameSet(handoff.next_action_sections.map((section) => section.section_id), expectedNextActions));
  addResult("static_handoff_metadata_sections_exact", sameSet(handoff.metadata_section_panels.map((section) => section.section_id), expectedMetadataSections));
  addResult("static_handoff_patch_taxonomy_visible", handoff.display_rows.some((row) => row.outcome === "patch" && row.taxonomy_tags.includes("material_failed") && row.next_review_action === "write_patch_plan_only"));
  addResult("static_handoff_reject_never_production_route_visible", handoff.display_rows.some((row) => row.outcome === "reject" && row.taxonomy_tags.includes("commercial_unusable") && row.next_review_action === "defer_until_taxonomy_update"));
  for (const [field, expected] of Object.entries(handoff.guard || {})) {
    addResult(`static_handoff_guard_${field}_${expected}`, handoff.guard[field] === expected);
  }
  addResult("static_handoff_guard_image_generation_false", handoff.guard?.image_generation_performed === false);
  addResult("static_handoff_guard_memory_write_false", handoff.guard?.memory_write_performed === false && handoff.guard?.DailyNote_write_performed === false && handoff.guard?.VCP_memory_write_performed === false);
  addResult("static_handoff_guard_provider_api_plugin_false", handoff.guard?.provider_contact_performed === false && handoff.guard?.plugin_call_performed === false && handoff.guard?.api_call_performed === false);
}

function validateRenderedStaticPrototype(rendered, renderer) {
  const handoff = rendered.draft.visual_eval_readonly_review_corpus_renderer_static_handoff;
  addResult("rendered_draft_handoff_present", Boolean(handoff));
  validateHandoffAgainstRenderer(handoff, renderer);
  const summaryHtml = rendered.elements.get("readonlyReviewCorpusRendererSummary")?.innerHTML || "";
  const rowsHtml = rendered.elements.get("readonlyReviewCorpusRendererRows")?.innerHTML || "";
  const sectionsHtml = rendered.elements.get("readonlyReviewCorpusRendererSections")?.innerHTML || "";
  const guardHtml = rendered.elements.get("readonlyReviewCorpusRendererGuard")?.innerHTML || "";
  addResult("rendered_summary_exposes_source", summaryHtml.includes(rendererPath));
  addResult("rendered_rows_expose_pass_patch_reject", expectedOutcomes.every((outcome) => rowsHtml.includes(`>${outcome}<`) || rowsHtml.includes(outcome)));
  addResult("rendered_rows_expose_taxonomy", rowsHtml.includes("material_failed") && rowsHtml.includes("commercial_unusable"));
  addResult("rendered_rows_expose_next_actions", expectedNextActions.every((action) => rowsHtml.includes(action) || sectionsHtml.includes(action)));
  addResult("rendered_sections_expose_metadata_panels", expectedMetadataSections.every((section) => sectionsHtml.includes(section)));
  addResult("rendered_guard_exposes_closed_routes", guardHtml.includes("provider/plugin/API: false") && guardHtml.includes("image generation: false") && guardHtml.includes("memory write: false"));
}

function validateNegativeCases(handoffFixture, renderer) {
  addResult("static_handoff_negative_cases_present", negativeCases.length === 4);
  for (const negativeCase of negativeCases) {
    const mutated = JSON.parse(JSON.stringify(stripArtifactMetadata(handoffFixture)));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateHandoffAgainstRenderer(mutated, renderer));
    addResult(`negative_case_${negativeCase.case_id}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${negativeCase.case_id}_expected_failure_code`, failureCodes.includes(negativeCase.expected_failure_code), failureCodes.join(", "));
  }
}

function main() {
  for (const file of Object.values(staticFiles)) {
    addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
  }
  addResult(`${rendererPath}_exists`, fs.existsSync(repoPath(rendererPath)), rendererPath);
  addResult(`${handoffFixturePath}_exists`, fs.existsSync(repoPath(handoffFixturePath)), handoffFixturePath);
  const renderer = readJson(rendererPath);
  const handoffFixture = readJson(handoffFixturePath);
  const mock = loadStaticMock();
  const handoff = mock.visual_eval_readonly_review_corpus_renderer_static_handoff;
  addResult("static_mock_handoff_present", Boolean(handoff));
  addResult("static_handoff_fixture_artifact_type_expected", handoffFixture.artifact_type === expectedHandoffArtifactType, handoffFixture.artifact_type);
  addResult("static_handoff_fixture_no_absolute_or_loopback", !hasAbsoluteOrLoopback(handoffFixture));
  addResult("static_handoff_fixture_matches_static_mock", JSON.stringify(stripArtifactMetadata(handoffFixture)) === JSON.stringify(handoff));
  assertStaticSourceCoverage();
  validateHandoffAgainstRenderer(stripArtifactMetadata(handoffFixture), renderer);
  validateHandoffAgainstRenderer(handoff, renderer);
  validateRenderedStaticPrototype(loadRenderedStaticDraft(mock), renderer);
  validateNegativeCases(handoffFixture, renderer);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_review_console_readonly_corpus_renderer",
    passed,
    renderer: rendererPath,
    handoff_fixture: handoffFixturePath,
    static_files: staticFiles,
    negative_case_count: negativeCases.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_002_started: false,
    Batch_005_started: false,
    failed_count: errors.length,
    errors,
    results,
  }, null, 2)}\n`);
  process.exitCode = passed ? 0 : 1;
}

try {
  main();
} catch (error) {
  errors.push({ check: "validator_exception", detail: error.stack || error.message });
  process.stderr.write(`${JSON.stringify({
    validator: "validate_visual_eval_review_console_readonly_corpus_renderer",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
