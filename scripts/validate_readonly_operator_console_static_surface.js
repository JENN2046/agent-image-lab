const fs = require("fs");
const path = require("path");
const vm = require("vm");

const htmlPath = "review_console/static_prototype/readonly_operator_console.html";
const cssPath = "review_console/static_prototype/readonly_operator_console.css";
const jsPath = "review_console/static_prototype/readonly_operator_console.js";
const indexPath = "review_console/static_prototype/index.html";
const readmePath = "review_console/static_prototype/README.md";
const mockPath = "review_console/static_prototype/mock_data.js";
const collectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const collectionQueryPath = "tests/schema_examples/visual_eval_readonly_review_collection_query.example.json";
const detailPath = "tests/schema_examples/visual_eval_readonly_review_detail_view.example.json";
const navigationPath = "tests/schema_examples/visual_eval_readonly_review_detail_navigation.example.json";
const sessionPath = "tests/schema_examples/visual_eval_readonly_review_session_drilldown.example.json";
const metadataSurfacePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.example.json";

const results = [];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail === undefined ? {} : { detail }) });
}

function failCount() {
  return results.filter((result) => !result.passed).length;
}

function stableJson(value) {
  return JSON.stringify(value, Object.keys(value || {}).sort());
}

function objectFieldsMatch(actual, expected) {
  return Object.entries(expected || {}).every(([key, value]) => actual?.[key] === value);
}

function hasNoForbiddenRuntimeCalls(source) {
  const forbidden = [
    "fetch(",
    "XMLHttpRequest",
    "localStorage",
    "sessionStorage",
    "navigator.sendBeacon",
    "new WebSocket",
    "document.cookie",
    "child_process",
    "fs.writeFile",
    "writeFileSync",
    "provider_contact_performed: true",
    "plugin_call_performed: true",
    "api_call_performed: true",
    "image_generation_performed: true",
    "DailyNote_write_performed: true",
    "VCP_memory_write_performed: true"
  ];
  return forbidden.filter((token) => source.includes(token));
}

function sectionBetween(source, heading) {
  const start = source.indexOf(heading);
  if (start === -1) return "";
  const rest = source.slice(start + heading.length);
  const nextHeading = rest.search(/\n##\s+/);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function hasNoForbiddenEntrypointClaims(source) {
  const forbidden = [
    "provider_contact_performed: true",
    "plugin_call_performed: true",
    "api_call_performed: true",
    "image_generation_performed: true",
    "DailyNote_write_performed: true",
    "VCP_memory_write_performed: true",
    "production_candidate_created: true",
    "accepted_samples_write_performed: true",
    "允许写入 production",
    "可以写入 production",
    "会写入 production",
    "允许创建 production candidate",
    "可以创建 production candidate",
    "会创建 production candidate",
    "允许生成图片",
    "可以生成图片",
    "会生成图片",
    "允许调用真实 provider",
    "可以调用真实 provider",
    "会调用真实 provider",
    "允许调用真实 plugin",
    "可以调用真实 plugin",
    "会调用真实 plugin",
    "允许调用真实 API",
    "可以调用真实 API",
    "会调用真实 API",
    "允许写入 VCP memory",
    "可以写入 VCP memory",
    "会写入 VCP memory",
    "允许写入 DailyNote",
    "可以写入 DailyNote",
    "会写入 DailyNote"
  ];
  return forbidden.filter((token) => source.includes(token));
}

function hasNoSoftRejectClaims(source) {
  const forbidden = [
    "拒绝项可修复",
    "拒绝项稍后再看",
    "拒绝项可以进生产",
    "拒绝项允许进生产",
    "reject 可以修复",
    "reject 稍后再看",
    "reject 可以进生产",
    "reject 允许进生产",
    "never_production 可以关闭",
    "永不进生产可以关闭"
  ];
  return forbidden.filter((token) => source.includes(token));
}

function loadBrowserState() {
  const sandbox = {
    window: {},
    globalThis: {},
    module: { exports: {} },
    console
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(read(mockPath), sandbox, { filename: mockPath });
  sandbox.window.REVIEW_CONSOLE_MOCK = sandbox.REVIEW_CONSOLE_MOCK;
  vm.runInContext(read(jsPath), sandbox, { filename: jsPath });
  return sandbox.window.READONLY_OPERATOR_CONSOLE_STATE || sandbox.module.exports.OPERATOR_STATE;
}

function itemTags(row) {
  return (row.failure_taxonomy || row.taxonomy_tags || []).map((tag) => tag.tag_id || tag.id || tag);
}

function main() {
  [htmlPath, cssPath, jsPath, indexPath, readmePath, mockPath, collectionConsumerPath, collectionQueryPath, detailPath, navigationPath, sessionPath, metadataSurfacePath].forEach((filePath) => {
    addResult(`${filePath}_exists`, fs.existsSync(filePath), filePath);
  });

  const html = read(htmlPath);
  const css = read(cssPath);
  const js = read(jsPath);
  const index = read(indexPath);
  const readme = read(readmePath);
  const readmeOperatorSection = sectionBetween(readme, "## 只读审片操作台");
  const state = loadBrowserState();
  const collectionConsumer = readJson(collectionConsumerPath);
  const collectionQuery = readJson(collectionQueryPath);
  const detail = readJson(detailPath);
  const navigation = readJson(navigationPath);
  const session = readJson(sessionPath);
  const metadataSurface = readJson(metadataSurfacePath);

  addResult("html_references_css", html.includes("./readonly_operator_console.css"));
  addResult("html_references_mock_data", html.includes("./mock_data.js"));
  addResult("html_references_operator_js", html.includes("./readonly_operator_console.js"));
  addResult("html_title_chinese", html.includes("<title>只读审片操作台</title>"));
  addResult("index_links_operator_console", index.includes('href="./readonly_operator_console.html"') && index.includes("只读审片操作台"));
  addResult("index_operator_entry_visible_chinese", index.includes("打开只读审片操作台") && index.includes(">只读审片操作台</a>"));
  addResult("readme_documents_operator_console_path", readmeOperatorSection.includes("review_console/static_prototype/readonly_operator_console.html"));
  addResult("readme_documents_index_entrypoint", readmeOperatorSection.includes("review_console/static_prototype/index.html") && readmeOperatorSection.includes("顶部点击"));
  addResult("readme_documents_operator_validator", readmeOperatorSection.includes("node scripts\\validate_readonly_operator_console_static_surface.js"));
  addResult("readme_operator_boundaries_present", [
    "不读取 `asset_archive/`",
    "不 fetch",
    "不写文件",
    "不调用 provider / plugin / API / DailyNote / VCP memory",
    "不生成图片",
    "不创建 production candidate"
  ].every((boundary) => readmeOperatorSection.includes(boundary)));
  const forbiddenEntrypointClaims = hasNoForbiddenEntrypointClaims(index + "\n" + readmeOperatorSection);
  addResult("entrypoint_docs_no_forbidden_positive_claims", forbiddenEntrypointClaims.length === 0, forbiddenEntrypointClaims.join(", "));
  addResult("html_visible_section_titles_chinese", [
    "只读审片",
    "入口总览",
    "当前补丁",
    "拒绝约束",
    "只读审片结论",
    "判断证据链",
    "操作记录"
  ].every((title) => html.includes(title)));
  addResult("html_old_english_titles_removed", [
    "Readonly Operator Console",
    "Readonly Visual Review",
    "Entry Overview",
    "Selected Patch",
    "Reject Guard",
    "Operator Notes"
  ].every((title) => !html.includes(title)));
  ["outcomeBoard", "selectedPatchPanel", "rejectGuardPanel", "guidedWalkthrough", "readonlyConclusionPanel", "conclusionStatus", "evidenceTracePanel", "evidenceStatus", "frictionLog", "boundaryStrip"].forEach((id) => {
    addResult(`html_required_mount_${id}`, html.includes(`id="${id}"`));
  });

  const forbiddenRuntimeTokens = hasNoForbiddenRuntimeCalls(js);
  addResult("operator_js_no_forbidden_runtime_calls", forbiddenRuntimeTokens.length === 0, forbiddenRuntimeTokens.join(", "));
  addResult("operator_js_exports_state", js.includes("READONLY_OPERATOR_CONSOLE_STATE"));
  addResult("operator_js_build_function_present", js.includes("function buildReadonlyOperatorState"));
  addResult("operator_js_chinese_display_labels_present", js.includes("通过") && js.includes("需修") && js.includes("拒绝") && js.includes("下一步"));
  addResult("operator_js_chinese_operator_summaries_present", js.includes("可通过") && js.includes("先处理") && js.includes("必须保持永不进生产"));
  addResult("operator_js_short_id_helper_present", js.includes("function shortId"));
  addResult("operator_js_guided_conclusion_present", js.includes("guided_review_conclusion") && js.includes("只读结论已生成") && js.includes("最终只读判断"));
  addResult("operator_js_guided_walkthrough_steps_present", [
    "第一步：看入口总览",
    "第二步：处理选中需修项",
    "第三步：确认拒绝约束",
    "第四步：输出只读结论"
  ].every((label) => js.includes(label)));
  addResult("operator_js_guided_conclusion_readonly_boundary_present", js.includes("本页只读") && js.includes("没有写文件") && js.includes("provider / plugin / API 调用") && js.includes("图像生成") && js.includes("memory / DailyNote 写入") && js.includes("production candidate 创建"));
  addResult("operator_js_guided_conclusion_chinese_operator_copy_present", js.includes("当前选中需修项") && js.includes("阻塞点") && js.includes("下一步动作") && js.includes("拒绝项不是可修复候选") && js.includes("失败分类") && js.includes("永不进生产"));
  addResult("operator_js_evidence_traceability_present", js.includes("evidence_traceability") && js.includes("证据链已对齐") && js.includes("renderEvidenceTrace"));
  addResult("operator_js_evidence_entry_ids_present", [
    "selected_patch_source",
    "blocking_points_source",
    "next_review_action_source",
    "reject_never_production_source",
    "failure_taxonomy_source",
    "metadata_accumulation_source",
    "readonly_boundary_source"
  ].every((entryId) => js.includes(entryId)));
  addResult("operator_js_evidence_source_labels_present", [
    "集合消费层（collection consumer）",
    "集合查询层（collection query）",
    "详情视图（detail view）",
    "详情导航（detail navigation）",
    "会话下钻（session drilldown）",
    "元数据队列表面（metadata queue surface）",
    "页面只读边界"
  ].every((label) => js.includes(label)));
  addResult("operator_js_raw_tokens_have_chinese_explanations", [
    "只写补丁计划",
    "材质失败",
    "光照失败",
    "主体漂移",
    "失败学习元数据"
  ].every((label) => js.includes(label)));
  addResult("operator_js_reject_hard_warning_present", js.includes("硬约束：永不进生产"));
  addResult("operator_js_boundary_folded_summary_present", [
    "不写文件",
    "不调用 provider / plugin / API",
    "不生成图片",
    "不写 memory / DailyNote",
    "不创建 production candidate"
  ].every((label) => js.includes(label)));
  addResult("css_operator_layout_present", css.includes(".operator-layout"));
  addResult("css_outcome_cards_present", css.includes(".review-card.patch") && css.includes(".review-card.reject"));
  addResult("css_overview_compaction_present", css.includes(".review-card.overview-row") && css.includes("grid-template-areas"));
  addResult("css_reject_hard_warning_present", css.includes(".hard-warning"));
  addResult("css_guided_conclusion_layout_present", css.includes(".conclusion-layout") && css.includes(".walkthrough-steps") && css.includes(".step-card") && css.includes(".detail-card.conclusion"));
  addResult("css_evidence_traceability_layout_present", css.includes(".evidence-grid") && css.includes(".evidence-card"));

  addResult("state_status_ready", state.status === "draft_ready");
  addResult("state_display_only_true", state.display_only === true);
  addResult("state_selected_review_result_matches_collection_consumer", state.selected_review_result_id === collectionConsumer.selected_review_result_id);
  addResult("state_selected_review_result_matches_collection_query", state.selected_review_result_id === collectionQuery.selected_review_result_id);
  addResult("state_selected_patch_explicit", state.selected_patch?.selected_patch === true);
  addResult("state_selected_patch_matches_consumer", stableJson(state.selected_patch) === stableJson(collectionConsumer.selected_patch), stableJson(state.selected_patch));
  addResult("query_selected_patch_matches_consumer", objectFieldsMatch(collectionConsumer.selected_patch, collectionQuery.selected_patch));
  addResult("state_selected_patch_matches_query_fields", objectFieldsMatch(state.selected_patch, collectionQuery.selected_patch));

  ["pass", "patch", "reject"].forEach((outcome) => {
    const queryRefs = collectionQuery.indexes.by_outcome[outcome].map((row) => row.review_result_id).join(",");
    const stateRefs = state.overview[outcome].map((row) => row.review_result_id).join(",");
    addResult(`overview_${outcome}_matches_query`, stateRefs === queryRefs, stateRefs);
  });

  const selectedRow = collectionConsumer.collection_rows.find((row) => row.review_result_id === state.selected_review_result_id);
  addResult("selected_row_resolves", Boolean(selectedRow), state.selected_review_result_id);
  addResult("selected_row_outcome_patch", selectedRow?.outcome === "patch");
  addResult("selected_drilldown_summary_matches_collection", state.selected_patch_drilldown.row.summary === selectedRow.summary);
  addResult("selected_drilldown_reasons_match_collection", state.selected_patch_drilldown.why_patch.join("|") === selectedRow.reasons.join("|"));
  addResult("selected_drilldown_tags_match_collection", state.selected_patch_drilldown.taxonomy_tags.join("|") === itemTags(selectedRow).join("|"));
  addResult("selected_drilldown_next_action_matches_detail", state.selected_patch_drilldown.next_review_action === detail.selected_card.next_review_action);
  addResult("selected_drilldown_navigation_selected", navigation.navigation_items.some((item) => item.review_result_id === state.selected_review_result_id && item.selected === true));
  addResult("selected_drilldown_session_selected", session.selected_review_row.review_result_id === state.selected_review_result_id);
  addResult("selected_drilldown_metadata_surface_visible", metadataSurface.surface.selected_items.some((item) => item.review_result_id === state.selected_review_result_id && item.section_id === "patch_plan_only"));

  const rejectRow = collectionConsumer.collection_rows.find((row) => row.outcome === "reject");
  addResult("reject_row_resolves", Boolean(rejectRow));
  addResult("reject_summary_preserves_never_production", rejectRow.summary.includes("never-production"));
  addResult("reject_trace_reasons_match_collection", state.reject_constraint_trace.why_reject.join("|") === rejectRow.reasons.join("|"));
  addResult("reject_trace_tags_match_collection", state.reject_constraint_trace.failure_taxonomy.join("|") === itemTags(rejectRow).join("|"));
  addResult("reject_trace_never_production_true", state.reject_constraint_trace.never_production === true);
  addResult("reject_trace_metadata_lane_failure_learning", state.reject_constraint_trace.metadata_lanes.includes("failure_learning_metadata"));
  addResult("reject_trace_write_allowed_false", state.reject_constraint_trace.write_allowed_now === false);

  const guidedConclusion = state.guided_review_conclusion || {};
  const guidedDecisionFields = guidedConclusion.decision_fields || {};
  const guidedStepLabels = (guidedConclusion.steps || []).map((step) => step.label);
  const guidedText = [
    guidedConclusion.status,
    guidedConclusion.conclusion,
    ...(guidedConclusion.steps || []).flatMap((step) => [step.label, step.result])
  ].join("\n");
  addResult("state_guided_conclusion_present", Boolean(guidedConclusion.conclusion) && Array.isArray(guidedConclusion.steps));
  addResult("state_guided_conclusion_selected_matches", guidedConclusion.selected_review_result_id === state.selected_review_result_id && guidedDecisionFields.selected_patch === state.selected_review_result_id);
  addResult("state_guided_conclusion_steps_exact", [
    "第一步：看入口总览",
    "第二步：处理选中需修项",
    "第三步：确认拒绝约束",
    "第四步：输出只读结论"
  ].join("|") === guidedStepLabels.join("|"), guidedStepLabels.join("|"));
  addResult("state_guided_conclusion_mentions_patch_blockers", guidedText.includes("阻塞点") && state.selected_patch_drilldown.blocking_watch_items.every((item) => guidedText.includes(item)));
  addResult("state_guided_conclusion_next_action_matches_selected", guidedDecisionFields.next_review_action === state.selected_patch_drilldown.next_review_action && guidedText.includes(state.selected_patch_drilldown.next_review_action));
  addResult("state_guided_conclusion_reject_never_production", guidedDecisionFields.reject_never_production === true && guidedText.includes("永不进生产"));
  addResult("state_guided_conclusion_reject_metadata_lane_failure_learning", guidedDecisionFields.reject_metadata_lanes.includes("failure_learning_metadata") && guidedText.includes("failure_learning_metadata"));
  addResult("state_guided_conclusion_write_allowed_false", guidedDecisionFields.write_allowed_now === false && guidedText.includes("只读"));
  const softRejectClaims = hasNoSoftRejectClaims(guidedText);
  addResult("state_guided_conclusion_no_soft_reject_claims", softRejectClaims.length === 0, softRejectClaims.join(", "));

  const evidenceTrace = state.evidence_traceability || {};
  const evidenceEntries = evidenceTrace.entries || [];
  const evidenceById = new Map(evidenceEntries.map((entry) => [entry.id, entry]));
  const evidenceText = evidenceEntries.map((entry) => [
    entry.id,
    entry.label,
    entry.value,
    entry.statement,
    ...(entry.sources || [])
  ].join("\n")).join("\n");
  const requiredEvidenceIds = [
    "selected_patch_source",
    "blocking_points_source",
    "next_review_action_source",
    "reject_never_production_source",
    "failure_taxonomy_source",
    "metadata_accumulation_source",
    "readonly_boundary_source"
  ];
  addResult("state_evidence_traceability_present", evidenceTrace.status === "证据链已对齐" && evidenceEntries.length === requiredEvidenceIds.length);
  addResult("state_evidence_traceability_ids_exact", requiredEvidenceIds.join("|") === evidenceEntries.map((entry) => entry.id).join("|"), evidenceEntries.map((entry) => entry.id).join("|"));
  addResult("state_evidence_selected_sources_complete", ["集合消费层（collection consumer）", "集合查询层（collection query）", "详情视图（detail view）", "详情导航（detail navigation）", "会话下钻（session drilldown）"].every((source) => evidenceById.get("selected_patch_source")?.sources.includes(source)));
  addResult("state_evidence_selected_value_matches", evidenceById.get("selected_patch_source")?.value === "patch_001");
  addResult("state_evidence_blocking_sources_complete", ["集合消费层（collection consumer）", "详情视图（detail view）"].every((source) => evidenceById.get("blocking_points_source")?.sources.includes(source)) && state.selected_patch_drilldown.blocking_watch_items.every((item) => evidenceById.get("blocking_points_source")?.value.includes(item)));
  addResult("state_evidence_next_action_sources_complete", ["集合消费层（collection consumer）", "集合查询层（collection query）", "详情视图（detail view）", "会话下钻（session drilldown）", "元数据队列表面（metadata queue surface）"].every((source) => evidenceById.get("next_review_action_source")?.sources.includes(source)));
  addResult("state_evidence_next_action_value_matches", evidenceById.get("next_review_action_source")?.value.includes(state.selected_patch_drilldown.next_review_action));
  addResult("state_evidence_reject_never_production_hard", evidenceById.get("reject_never_production_source")?.value === "true" && evidenceById.get("reject_never_production_source")?.statement.includes("硬约束"));
  addResult("state_evidence_failure_taxonomy_matches_reject", state.reject_constraint_trace.failure_taxonomy.every((tag) => evidenceById.get("failure_taxonomy_source")?.value.includes(tag)));
  addResult("state_evidence_metadata_accumulation_route_visible", evidenceById.get("metadata_accumulation_source")?.value.includes("failure_learning_metadata") && evidenceById.get("metadata_accumulation_source")?.statement.includes("失败学习元数据"));
  addResult("state_evidence_readonly_boundary_sources_present", evidenceById.get("readonly_boundary_source")?.sources.includes("页面只读边界"));
  addResult("state_evidence_readonly_boundary_value_complete", [
    "不写文件",
    "不调用 provider",
    "plugin",
    "API",
    "不生成图片",
    "不写 memory",
    "DailyNote",
    "不创建 production candidate"
  ].every((token) => evidenceById.get("readonly_boundary_source")?.value.includes(token)));
  const evidenceSoftRejectClaims = hasNoSoftRejectClaims(evidenceText);
  addResult("state_evidence_traceability_no_soft_reject_claims", evidenceSoftRejectClaims.length === 0, evidenceSoftRejectClaims.join(", "));

  const boundary = state.boundary || {};
  [
    "fetch_performed",
    "file_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "memory_write_performed",
    "production_candidate_002_started",
    "Batch_005_started"
  ].forEach((key) => addResult(`boundary_${key}_false`, boundary[key] === false));
  addResult("operator_friction_present", state.operator_friction.length >= 3);
  addResult("source_refs_include_collection_consumer", state.source_refs.includes(collectionConsumerPath));
}

main();

const failed = results.filter((result) => !result.passed);
const output = {
  validator: "validate_readonly_operator_console_static_surface",
  passed: failed.length === 0,
  files_checked: [htmlPath, cssPath, jsPath],
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  memory_written: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  production_candidate_002_started: false,
  Batch_005_started: false,
  failed_count: failCount(),
  errors: failed,
  results
};

console.log(JSON.stringify(output, null, 2));
if (!output.passed) process.exit(1);
