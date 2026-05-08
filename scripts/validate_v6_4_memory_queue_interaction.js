const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const results = [];

// 1. Design doc exists
assert(exists("docs/240_v6_4_memory_queue_interaction.md"), "docs/240 must exist");
results.push({ check: "doc_exists", passed: true });

// 2. app.js contains Memory Queue builder/renderer
const app = read("review_console/runtime_prototype/app.js");
assert(/memory_queue/.test(app), "memory_queue must be in app.js");
assert(/v6MQMemoryItemId/.test(app), "v6MQMemoryItemId must be in app.js");
assert(/v6MQApprovalSelect/.test(app), "v6MQApprovalSelect must be in app.js");
assert(/v6MQReviewerRoleSelect/.test(app), "v6MQReviewerRoleSelect must be in app.js");
assert(/v6MQShouldWriteCheck/.test(app), "v6MQShouldWriteCheck must be in app.js");
assert(/v6MQBlockReasonInput/.test(app), "v6MQBlockReasonInput must be in app.js");
assert(/v6MQRejectReasonInput/.test(app), "v6MQRejectReasonInput must be in app.js");
assert(/v6MQCountTotal/.test(app), "v6MQCountTotal must be in app.js");
results.push({ check: "memory_queue_in_app_js", passed: true });

// 3. index.html contains Memory Queue input/select/checkbox DOM
const html = read("review_console/runtime_prototype/index.html");
assert(/v6MemoryQueue/.test(html), "v6MemoryQueue must be in index.html");
assert(/v6MQMemoryItemId/.test(html), "v6MQMemoryItemId must be in index.html");
assert(/v6MQLinkedTaskId/.test(html), "v6MQLinkedTaskId must be in index.html");
assert(/v6MQLinkedAssetRef/.test(html), "v6MQLinkedAssetRef must be in index.html");
assert(/v6MQLinkedSessionId/.test(html), "v6MQLinkedSessionId must be in index.html");
assert(/v6MQDiaryTitle/.test(html), "v6MQDiaryTitle must be in index.html");
assert(/v6MQDiaryPreview/.test(html), "v6MQDiaryPreview must be in index.html");
assert(/v6MQApprovalSelect/.test(html), "v6MQApprovalSelect must be in index.html");
assert(/v6MQReviewerRoleSelect/.test(html), "v6MQReviewerRoleSelect must be in index.html");
assert(/v6MQShouldWriteCheck/.test(html), "v6MQShouldWriteCheck must be in index.html");
assert(/v6MQBlockReasonInput/.test(html), "v6MQBlockReasonInput must be in index.html");
assert(/v6MQRejectReasonInput/.test(html), "v6MQRejectReasonInput must be in index.html");
assert(/v6MQCountTotal/.test(html), "v6MQCountTotal must be in index.html");
results.push({ check: "memory_queue_in_html", passed: true });

// 4. runtime_guard.js contains v6MemoryQueueIsSafe
const guard = read("review_console/runtime_prototype/runtime_guard.js");
assert(/v6MemoryQueueIsSafe/.test(guard), "v6MemoryQueueIsSafe must be in runtime_guard.js");
assert(/VALID_APPROVAL_STATUSES/.test(guard), "VALID_APPROVAL_STATUSES must be in runtime_guard.js");
assert(/VALID_REVIEWER_ROLES/.test(guard), "VALID_REVIEWER_ROLES must be in runtime_guard.js");
assert(/pending/.test(guard), "approval enum must include pending");
assert(/approved/.test(guard), "approval enum must include approved");
assert(/rejected/.test(guard), "approval enum must include rejected");
assert(/blocked/.test(guard), "approval enum must include blocked");
assert(/ImageLab_Master/.test(guard), "reviewer role enum must include ImageLab_Master");
assert(/Archivist_Agent/.test(guard), "reviewer role enum must include Archivist_Agent");
assert(/Gatekeeper/.test(guard), "reviewer role enum must include Gatekeeper");
results.push({ check: "memory_queue_guard", passed: true });

// 5. FIELD_MAPPING.md records memory_queue field mapping
const fm = read("review_console/runtime_prototype/FIELD_MAPPING.md");
assert(/memory_queue/i.test(fm), "FIELD_MAPPING must document memory_queue");
results.push({ check: "field_mapping", passed: true });

// 6-10. Smoke test covers all toggle interactions
const smoke = read("scripts/validate_runtime_prototype_smoke.js");
assert(/v6MQApprovalSelect/.test(smoke), "Smoke must register v6MQApprovalSelect");
assert(/v6MQReviewerRoleSelect/.test(smoke), "Smoke must register v6MQReviewerRoleSelect");
assert(/v6MQShouldWriteCheck/.test(smoke), "Smoke must register v6MQShouldWriteCheck");
assert(/v6MQBlockReasonInput/.test(smoke), "Smoke must register v6MQBlockReasonInput");
assert(/v6MQRejectReasonInput/.test(smoke), "Smoke must register v6MQRejectReasonInput");
results.push({ check: "smoke_elements", passed: true });

// 6-10 continued: interactive toggle tests
assert(/v6MQApprovalSelect.*value.*approved/.test(smoke), "Smoke must toggle approval_status to approved");
assert(/v6MQReviewerRoleSelect.*value.*Gatekeeper/.test(smoke), "Smoke must toggle reviewer_role to Gatekeeper");
assert(/v6MQShouldWriteCheck.*checked.*true/.test(smoke), "Smoke must toggle should_write_to_vcp");
assert(/v6MQBlockReasonInput.*value.*测试阻断/.test(smoke), "Smoke must test blocked + block_reason_cn");
assert(/v6MQRejectReasonInput.*value.*测试拒绝/.test(smoke), "Smoke must test rejected + reject_reason_cn");
results.push({ check: "smoke_interactions", passed: true });

// 11-22. draft_only and no-execution boundary checks
const guContent = read("review_console/runtime_prototype/runtime_guard.js");
const mqGuardSection = guContent.match(/v6MemoryQueueIsSafe[\s\S]{0,3000}/)?.[0] || guContent;
assert(/draft_only\s*!==\s*true/.test(mqGuardSection), "guard must check draft_only===true");
results.push({ check: "draft_only", passed: true });

assert(/side_effects_performed\s*!==\s*false/.test(mqGuardSection), "guard must check side_effects_performed===false");
results.push({ check: "side_effects_performed", passed: true });

assert(/write_authorized\s*!==\s*false/.test(mqGuardSection), "guard must check write_authorized===false");
results.push({ check: "write_authorized", passed: true });

assert(/write_performed\s*!==\s*false/.test(mqGuardSection) || /write_performed !== false/.test(mqGuardSection), "guard must check write_performed===false");
results.push({ check: "write_performed", passed: true });

assert(/canonical_location_verified\s*!==\s*false/.test(mqGuardSection), "guard must check canonical_location_verified===false");
results.push({ check: "canonical_location_verified", passed: true });

assert(/canonical_hash_matched\s*!==\s*false/.test(mqGuardSection), "guard must check canonical_hash_matched===false");
results.push({ check: "canonical_hash_matched", passed: true });

assert(/contains_secret\s*!==\s*false/.test(mqGuardSection), "guard must check contains_secret===false");
results.push({ check: "contains_secret", passed: true });

assert(/contains_private_path\s*!==\s*false/.test(mqGuardSection), "guard must check contains_private_path===false");
results.push({ check: "contains_private_path", passed: true });

assert(/contains_customer_private_data\s*!==\s*false/.test(mqGuardSection), "guard must check contains_customer_private_data===false");
results.push({ check: "contains_customer_private_data", passed: true });

assert(/image_binary_included\s*!==\s*false/.test(mqGuardSection), "guard must check image_binary_included===false");
results.push({ check: "image_binary_included", passed: true });

assert(/raw_payload_stored\s*!==\s*false/.test(mqGuardSection), "guard must check raw_payload_stored===false");
results.push({ check: "raw_payload_stored", passed: true });

// 23. No plugin/API/DailyNote/VCP memory/image flags
assert(/vcp_plugin_called.*false/.test(mqGuardSection) || /guardIsClean/.test(mqGuardSection), "guard must check vcp_plugin_called");
results.push({ check: "no_external_flags", passed: true });

// 24. No forbidden patterns in memory_queue related code
const mqRelated = [
  app.match(/memory_queue[\s\S]{0,4000}/)?.[0] || "",
  html.match(/v6MemoryQueue[\s\S]{0,3000}/)?.[0] || "",
  guContent.match(/v6MemoryQueueIsSafe[\s\S]{0,3000}/)?.[0] || ""
].join("\n");
const forbidden = [/localStorage/, /sessionStorage/, /IndexedDB/, /\bfs\b/, /\bfetch\b/, /XMLHttpRequest/, /child_process/];
for (const p of forbidden) {
  assert(!p.test(mqRelated), "Forbidden pattern not found in memory_queue related code: " + p.source);
}
results.push({ check: "no_forbidden_apis", passed: true });

// 24b. No endpoint/secret/token/cookie/private path positive leak
const forbiddenTerms = [/endpoint\s*[:=]\s*['"][^'"]+['"]/, /secret\s*[:=]\s*['"][^'"]+['"]/, /token\s*[:=]\s*['"][^'"]+['"]/, /cookie\s*[:=]\s*['"][^'"]+['"]/];
for (const p of forbiddenTerms) {
  assert(!p.test(mqRelated), "Forbidden term not found in memory_queue related code: " + p.source);
}
results.push({ check: "no_forbidden_terms", passed: true });

// 25. v6.3 validator still loads
const v6validator = require("./validate_v6_3_session_store_interaction");
results.push({ check: "v6_3_validator_still_loaded", passed: true });

const summary = {
  passed: true,
  phase: "v6.4 Memory Queue Interaction",
  check_count: results.length,
  failed_count: 0,
  draft_only: true,
  no_execution: true,
  real_execution: false,
  external_network_required: false,
  file_write_performed: false,
  results
};

process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
