#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const catalogPath = "tests/schema_examples/visual_eval_readonly_review_artifact_catalog.example.json";
const expectedRoles = [
  "review_result_protocol",
  "failure_taxonomy",
  "metadata_accumulation_contract",
  "bridge_readable_payload",
  "readonly_review_bundle",
  "readonly_consumer_payload",
  "readonly_review_collection",
  "readonly_collection_consumer_payload",
  "readonly_collection_query_payload",
  "readonly_surface_snapshot",
  "readonly_detail_view",
  "readonly_detail_navigation",
  "readonly_session_drilldown",
  "readonly_metadata_accumulation_queue",
  "readonly_metadata_accumulation_queue_consumer",
  "readonly_metadata_accumulation_queue_query",
  "readonly_metadata_accumulation_queue_surface_snapshot",
  "readonly_metadata_accumulation_queue_detail_view",
  "readonly_metadata_accumulation_queue_detail_navigation",
  "readonly_review_workspace",
  "readonly_review_workspace_case_matrix",
  "readonly_review_workspace_corpus",
  "readonly_review_corpus_renderer",
  "review_console_readonly_corpus_renderer_static_handoff",
];
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedNextActionByOutcome = {
  pass: "queue_for_future_human_review",
  patch: "write_patch_plan_only",
  reject: "defer_until_taxonomy_update",
};
const expectedMetadataActionByOutcome = {
  pass: "keep_as_metadata_candidate",
  patch: "metadata_only_reference",
  reject: "keep_as_failure_learning_metadata",
};
const expectedSelectedReviewResultId = "visual_eval_review_result_patch_synthetic_001";
const metadataAccumulationSubtreeRoles = new Set([
  "readonly_metadata_accumulation_queue",
  "readonly_metadata_accumulation_queue_consumer",
  "readonly_metadata_accumulation_queue_query",
  "readonly_metadata_accumulation_queue_surface_snapshot",
]);
const forbiddenDerivedSummaryFields = new Set(["summary"]);
const forbiddenDerivedReasonsFields = new Set(["reasons", "pass_reasons", "patch_reasons", "reject_reasons"]);
const forbiddenDerivedFailureTagFields = new Set(["failure_taxonomy", "taxonomy_tags"]);
const forbiddenDerivedTaxonomyRefFields = new Set(["taxonomy_ref", "taxonomy_refs"]);
const forbiddenDerivedAccumulationFields = new Set(["metadata_accumulation"]);
const forbiddenTrueFields = new Set([
  "file_write_performed",
  "approval_write_performed",
  "accepted_samples_write_performed",
  "accepted_samples_written",
  "production_candidate_created",
  "production_candidate_allowed_now",
  "production_candidate_002_started",
  "provider_contact_performed",
  "provider_retry_allowed_now",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "image_generation_allowed_now",
  "memory_write_performed",
  "memory_write_allowed_now",
  "memory_written",
  "DailyNote_write_performed",
  "DailyNote_written",
  "VCP_memory_write_performed",
  "VCP_memory_written",
  "Batch_005_started",
  "runtime_execution_performed",
  "fetch_performed",
  "write_allowed",
  "write_allowed_now",
]);
const expectedNegativeCases = [
  {
    case_id: "dangling_session_id",
    expected_failure_code: "graph_review_session_ids_resolve",
    mutate(graph) {
      graph.artifacts.readonly_consumer_payload.data.display_rows[1].session_id = "missing_session_id";
    },
  },
  {
    case_id: "dangling_case_id",
    expected_failure_code: "graph_review_case_ids_resolve",
    mutate(graph) {
      graph.artifacts.review_console_readonly_corpus_renderer_static_handoff.data.display_rows[1].case_id =
        "missing_case_id";
    },
  },
  {
    case_id: "collection_queue_query_selected_result_drift",
    expected_failure_code: "graph_selected_review_result_consistency",
    mutate(graph) {
      graph.artifacts.readonly_metadata_accumulation_queue_surface_snapshot.data.surface.selected_items[0].review_result_id =
        "visual_eval_review_result_reject_synthetic_001";
    },
  },
  {
    case_id: "queue_query_wrong_source_consumer",
    expected_failure_code: "graph_source_queue_consumer_relation",
    mutate(graph) {
      graph.artifacts.readonly_metadata_accumulation_queue_query.data.source_queue_consumer =
        graph.artifacts.readonly_metadata_accumulation_queue.entry.path;
    },
  },
  {
    case_id: "catalog_path_correct_but_source_relation_wrong",
    expected_failure_code: "graph_source_bundle_relation",
    mutate(graph) {
      graph.artifacts.readonly_consumer_payload.data.source_bundle =
        graph.artifacts.readonly_review_collection.entry.path;
    },
  },
  {
    case_id: "taxonomy_ref_exists_but_failure_tag_membership_mismatch",
    expected_failure_code: "graph_failure_tags_taxonomy_membership",
    mutate(graph) {
      graph.artifacts.readonly_review_corpus_renderer.data.display_model.display_rows[1].failure_tags = [
        "subject_drift",
      ];
    },
  },
  {
    case_id: "metadata_accumulation_action_conflicts_with_outcome",
    expected_failure_code: "graph_metadata_action_semantics",
    mutate(graph) {
      graph.artifacts.readonly_review_workspace_case_matrix.data.case_rows[1].metadata_accumulation_action =
        "keep_as_metadata_candidate";
    },
  },
  {
    case_id: "forbidden_boundary_flag_true",
    expected_failure_code: "graph_forbidden_flags_false",
    mutate(graph) {
      graph.artifacts.readonly_review_workspace.data.readonly_route_guard_summary.image_generation_performed = true;
    },
  },
  {
    case_id: "absolute_local_path_in_artifact",
    expected_failure_code: "graph_no_absolute_or_loopback_or_secret",
    mutate(graph) {
      graph.artifacts.readonly_detail_view.data.source_surface_snapshot = "C:\\Users\\Example\\surface.json";
    },
  },
  {
    case_id: "composition_order_missing_role",
    expected_failure_code: "graph_catalog_composition_order_exact",
    mutate(graph) {
      graph.catalog.composition_order = graph.catalog.composition_order.filter(
        (role) => role !== "readonly_review_corpus_renderer"
      );
    },
  },
  {
    case_id: "derived_outcome_drift",
    expected_failure_code: "graph_review_identity_consistency",
    mutate(graph) {
      graph.artifacts.readonly_surface_snapshot.data.surface.outcome_lanes[1].cards[0].outcome = "reject";
    },
  },
  {
    case_id: "derived_next_action_drift",
    expected_failure_code: "graph_next_action_semantics",
    mutate(graph) {
      graph.artifacts.readonly_detail_navigation.data.navigation_items[1].next_review_action =
        "queue_for_future_human_review";
    },
  },
  {
    case_id: "derived_failure_tag_injection",
    expected_failure_code: "graph_failure_tags_exact",
    mutate(graph) {
      graph.artifacts.bridge_readable_payload.data.review_bridge_readable_payload.review_rows[1].failure_tags.push(
        "subject_drift"
      );
    },
  },
  {
    case_id: "derived_taxonomy_ref_drift",
    expected_failure_code: "graph_taxonomy_refs_resolve",
    mutate(graph) {
      graph.artifacts.bridge_readable_payload.data.review_bridge_readable_payload.review_rows[1].taxonomy_ref =
        graph.artifacts.metadata_accumulation_contract.entry.path;
    },
  },
  {
    case_id: "selected_patch_result_drift",
    expected_failure_code: "graph_selected_review_result_consistency",
    mutate(graph) {
      graph.artifacts.readonly_metadata_accumulation_queue_consumer.data.selected_patch_plan.review_result_id =
        "visual_eval_review_result_reject_synthetic_001";
    },
  },
  {
    case_id: "derived_accumulation_action_drift",
    expected_failure_code: "graph_accumulation_semantics_exact",
    mutate(graph) {
      graph.artifacts.readonly_metadata_accumulation_queue_detail_view.data.selected_card.metadata_actions.archive_reference_action =
        "archive_as_positive_reference";
    },
  },
  {
    case_id: "derived_summary_drift",
    expected_failure_code: "projection_summary_consistent",
    mutate(graph) {
      graph.artifacts.readonly_detail_view.data.selected_card.summary = "drifted summary projection";
    },
  },
  {
    case_id: "derived_reason_drift",
    expected_failure_code: "projection_reasons_consistent",
    mutate(graph) {
      graph.artifacts.readonly_collection_consumer_payload.data.collection_rows[1].reasons[0] =
        "drifted reason projection";
    },
  },
  {
    case_id: "derived_failure_tag_drift",
    expected_failure_code: "projection_failure_tags_consistent",
    mutate(graph) {
      graph.artifacts.bridge_readable_payload.data.review_bridge_readable_payload.review_rows[1].failure_tags = [
        "material_failed",
      ];
    },
  },
  {
    case_id: "derived_accumulation_object_drift",
    expected_failure_code: "projection_metadata_accumulation_consistent",
    mutate(graph) {
      graph.artifacts.readonly_session_drilldown.data.selected_metadata_accumulation.metadata_accumulation.next_review_action =
        "defer_until_taxonomy_update";
    },
  },
  {
    case_id: "forbidden_owned_field_reintroduced",
    expected_failure_code: "derived_summary_not_owner",
    mutate(graph) {
      const queueItem = graph.artifacts.readonly_metadata_accumulation_queue.data.queues.patch_plan_only[0];
      queueItem.summary = graph.artifacts.review_result_protocol.data.review_results[1].summary;
      queueItem.failure_tags = ["material_failed", "lighting_failed"];
    },
  },
];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createContext() {
  const results = [];
  const errors = [];
  function addResult(check, passed, detail) {
    const result = { check, passed: Boolean(passed) };
    if (detail !== undefined && detail !== "") result.detail = detail;
    results.push(result);
    if (!passed) errors.push({ check, detail: detail || "check failed" });
  }
  return { results, errors, addResult };
}

function sameArray(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item, index) => actual[index] === item);
}

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map((item) => stableJson(item)).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function getValue(target, fieldPath) {
  return fieldPath.split(".").reduce((cursor, segment) => (cursor == null ? undefined : cursor[segment]), target);
}

function walk(value, visitor, pathParts = []) {
  visitor(value, pathParts);
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, pathParts.concat(String(index))));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => walk(child, visitor, pathParts.concat(key)));
  }
}

function hasAbsoluteLoopbackOrSecret(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1)|sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY|(?:api[_-]?key|token|password)\s*=)/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteLoopbackOrSecret(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteLoopbackOrSecret(item));
  return false;
}

function catalogTypeField(artifact) {
  return (
    artifact.artifact_type ||
    artifact.fixture_type ||
    artifact.payload_type ||
    artifact.consumer_payload_type ||
    artifact.query_payload_type ||
    artifact.surface_snapshot_type ||
    artifact.detail_view_type ||
    artifact.navigation_type ||
    artifact.drilldown_type ||
    artifact.queue_type ||
    artifact.workspace_type ||
    artifact.matrix_type ||
    artifact.corpus_type ||
    artifact.renderer_type
  );
}

function catalogIdField(artifact) {
  return (
    artifact.artifact_id ||
    artifact.fixture_id ||
    artifact.payload_id ||
    artifact.consumer_payload_id ||
    artifact.query_payload_id ||
    artifact.surface_snapshot_id ||
    artifact.detail_view_id ||
    artifact.navigation_id ||
    artifact.drilldown_id ||
    artifact.queue_id ||
    artifact.workspace_id ||
    artifact.matrix_id ||
    artifact.corpus_id ||
    artifact.renderer_id
  );
}

function loadGraph() {
  const catalog = readJson(catalogPath);
  const artifacts = {};
  for (const entry of catalog.artifact_entries || []) {
    artifacts[entry.artifact_role] = {
      entry: deepClone(entry),
      data: readJson(entry.path),
    };
  }
  return { catalog: deepClone(catalog), artifacts };
}

function taxonomyIndex(taxonomy) {
  const tags = new Map();
  for (const category of taxonomy.categories || []) {
    for (const tag of category.failure_tags || []) {
      tags.set(tag.tag_id, {
        category_id: category.category_id,
        severity: tag.severity,
        default_outcome: tag.default_outcome,
      });
    }
  }
  return tags;
}

function canonicalRows(graph) {
  const rows = graph.artifacts.review_result_protocol.data.review_results;
  return rows.map((row) => ({
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    case_id: row.case_id,
    session_id: row.session_id,
    outcome: row.outcome,
    summary: row.summary,
    reasons: canonicalReasons(row),
    failure_tags: row.failure_tags || [],
    taxonomy_ref: row.taxonomy_ref,
    taxonomy_refs: row.taxonomy_refs || [],
    accumulation_ref: row.accumulation_ref,
    metadata_accumulation: row.metadata_accumulation,
    next_review_action: row.metadata_accumulation?.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation?.rejected_metadata_action !== "none"
      ? row.metadata_accumulation.rejected_metadata_action
      : row.metadata_accumulation?.accepted_metadata_action !== "none"
        ? row.metadata_accumulation.accepted_metadata_action
        : row.metadata_accumulation?.archive_reference_action,
  }));
}

function canonicalReasons(row) {
  if (row.outcome === "pass") return row.pass_reasons || [];
  if (row.outcome === "patch") return row.patch_reasons || [];
  if (row.outcome === "reject") return row.reject_reasons || [];
  return [];
}

function canonicalMetadataActions(row) {
  return {
    accepted_metadata_action: row.metadata_accumulation.accepted_metadata_action,
    rejected_metadata_action: row.metadata_accumulation.rejected_metadata_action,
    archive_reference_action: row.metadata_accumulation.archive_reference_action,
  };
}

function pathIsProjectionOnly(pathLabel, row) {
  return row.section_id === "next_review_actions" ||
    /\.next_review_actions(?:\.|\[)/.test(pathLabel) ||
    /sections\.4\.items\.\d+$/.test(pathLabel);
}

function validateDerivedOwnership(graph, ctx) {
  const summaryOwners = [];
  const reasonOwners = [];
  const failureTagOwners = [];
  const taxonomyRefOwners = [];
  const nextActionOwners = [];
  const accumulationOwners = [];

  for (const [role, artifact] of Object.entries(graph.artifacts)) {
    if (!metadataAccumulationSubtreeRoles.has(role)) continue;
    walk(artifact.data, (value, pathParts) => {
      if (!value || Array.isArray(value) || typeof value !== "object") return;
      const pathLabel = `${role}:${pathParts.join(".") || "<root>"}`;
      for (const key of Object.keys(value)) {
        if (forbiddenDerivedSummaryFields.has(key)) summaryOwners.push(`${pathLabel}.${key}`);
        if (forbiddenDerivedReasonsFields.has(key)) reasonOwners.push(`${pathLabel}.${key}`);
        if (forbiddenDerivedFailureTagFields.has(key)) failureTagOwners.push(`${pathLabel}.${key}`);
        if (forbiddenDerivedTaxonomyRefFields.has(key)) taxonomyRefOwners.push(`${pathLabel}.${key}`);
        if (forbiddenDerivedAccumulationFields.has(key)) accumulationOwners.push(`${pathLabel}.${key}`);
      }
      if (Object.prototype.hasOwnProperty.call(value, "next_review_action") &&
        !Object.prototype.hasOwnProperty.call(value, "review_result_id") &&
        !pathParts.includes("next_action_queues")) {
        nextActionOwners.push(`${pathLabel}.next_review_action`);
      }
    });
  }

  ctx.addResult("derived_summary_not_owner", summaryOwners.length === 0, summaryOwners.join("; "));
  ctx.addResult("derived_reasons_not_owner", reasonOwners.length === 0, reasonOwners.join("; "));
  ctx.addResult("derived_failure_tags_not_owner", failureTagOwners.length === 0, failureTagOwners.join("; "));
  ctx.addResult("derived_taxonomy_ref_not_owner", taxonomyRefOwners.length === 0, taxonomyRefOwners.join("; "));
  ctx.addResult("derived_next_review_action_not_owner", nextActionOwners.length === 0, nextActionOwners.join("; "));
  ctx.addResult("derived_metadata_accumulation_not_owner", accumulationOwners.length === 0, accumulationOwners.join("; "));
}

function collectReviewObjects(graph) {
  const objects = [];
  for (const [role, artifact] of Object.entries(graph.artifacts)) {
    walk(artifact.data, (value, pathParts) => {
      if (!value || Array.isArray(value) || typeof value !== "object") return;
      if (!Object.prototype.hasOwnProperty.call(value, "review_result_id")) return;
      if (!Object.prototype.hasOwnProperty.call(value, "candidate_id") &&
        !Object.prototype.hasOwnProperty.call(value, "case_id") &&
        !Object.prototype.hasOwnProperty.call(value, "session_id") &&
        !Object.prototype.hasOwnProperty.call(value, "outcome")) {
        return;
      }
      objects.push({ role, path: pathParts.join("."), value });
    });
  }
  return objects;
}

function validateCatalogClosure(graph, ctx) {
  const entries = graph.catalog.artifact_entries || [];
  const roles = entries.map((entry) => entry.artifact_role);
  const ids = entries.map((entry) => entry.artifact_id);
  const types = entries.map((entry) => entry.artifact_type);
  ctx.addResult("graph_catalog_artifact_count_24", entries.length === 24, entries.length);
  ctx.addResult("graph_catalog_roles_exact", sameSet(roles, expectedRoles), roles.join(", "));
  ctx.addResult("graph_catalog_composition_order_exact", sameArray(graph.catalog.composition_order, expectedRoles), (graph.catalog.composition_order || []).join(", "));
  ctx.addResult("graph_catalog_roles_unique", new Set(roles).size === roles.length);
  ctx.addResult("graph_catalog_artifact_ids_unique", new Set(ids).size === ids.length);
  ctx.addResult("graph_catalog_artifact_types_unique", new Set(types).size === types.length);
  for (const entry of entries) {
    const artifactPathExists = typeof entry.path === "string" && fs.existsSync(repoPath(entry.path));
    const validatorExists = typeof entry.validator === "string" && fs.existsSync(repoPath(entry.validator));
    ctx.addResult(`graph_catalog_${entry.artifact_role}_artifact_path_exists`, artifactPathExists, entry.path);
    ctx.addResult(`graph_catalog_${entry.artifact_role}_validator_exists`, validatorExists, entry.validator);
    if (!artifactPathExists || !graph.artifacts[entry.artifact_role]) continue;
    const artifact = graph.artifacts[entry.artifact_role].data;
    ctx.addResult(`graph_catalog_${entry.artifact_role}_artifact_id_matches`, catalogIdField(artifact) === entry.artifact_id, catalogIdField(artifact));
    ctx.addResult(`graph_catalog_${entry.artifact_role}_artifact_type_matches`, catalogTypeField(artifact) === entry.artifact_type, catalogTypeField(artifact));
  }
}

function validateSourceRelations(graph, ctx) {
  const pathFor = (role) => graph.artifacts[role]?.entry.path;
  function expect(check, sourceRole, sourceFieldPath, targetRole) {
    const actual = getValue(graph.artifacts[sourceRole]?.data, sourceFieldPath);
    const expected = pathFor(targetRole);
    ctx.addResult(check, actual === expected, `${sourceRole}.${sourceFieldPath}: ${actual} expected ${expected}`);
  }
  expect("graph_source_review_result_protocol_relation", "metadata_accumulation_contract", "source_review_result_protocol", "review_result_protocol");
  expect("graph_source_taxonomy_relation", "metadata_accumulation_contract", "source_taxonomy", "failure_taxonomy");
  expect("graph_source_bridge_review_result_protocol_relation", "bridge_readable_payload", "source_refs.review_result_protocol", "review_result_protocol");
  expect("graph_source_bridge_taxonomy_relation", "bridge_readable_payload", "source_refs.taxonomy", "failure_taxonomy");
  expect("graph_source_bridge_metadata_relation", "bridge_readable_payload", "source_refs.metadata_accumulation", "metadata_accumulation_contract");
  expect("graph_source_bundle_relation", "readonly_consumer_payload", "source_bundle", "readonly_review_bundle");
  expect("graph_source_collection_relation", "readonly_collection_consumer_payload", "source_collection", "readonly_review_collection");
  expect("graph_source_collection_query_consumer_relation", "readonly_collection_query_payload", "source_collection_consumer", "readonly_collection_consumer_payload");
  expect("graph_source_surface_query_relation", "readonly_surface_snapshot", "source_query", "readonly_collection_query_payload");
  expect("graph_source_surface_consumer_relation", "readonly_surface_snapshot", "source_collection_consumer", "readonly_collection_consumer_payload");
  expect("graph_source_detail_surface_relation", "readonly_detail_view", "source_surface_snapshot", "readonly_surface_snapshot");
  expect("graph_source_detail_consumer_relation", "readonly_detail_view", "source_collection_consumer", "readonly_collection_consumer_payload");
  expect("graph_source_navigation_surface_relation", "readonly_detail_navigation", "source_surface_snapshot", "readonly_surface_snapshot");
  expect("graph_source_navigation_consumer_relation", "readonly_detail_navigation", "source_collection_consumer", "readonly_collection_consumer_payload");
  expect("graph_source_session_navigation_relation", "readonly_session_drilldown", "source_detail_navigation", "readonly_detail_navigation");
  expect("graph_source_bridge_relation", "readonly_session_drilldown", "source_bridge_payload", "bridge_readable_payload");
  expect("graph_source_queue_session_relation", "readonly_metadata_accumulation_queue", "source_session_drilldown", "readonly_session_drilldown");
  expect("graph_source_queue_bridge_relation", "readonly_metadata_accumulation_queue", "source_bridge_payload", "bridge_readable_payload");
  expect("graph_source_queue_contract_relation", "readonly_metadata_accumulation_queue", "source_accumulation_contract", "metadata_accumulation_contract");
  expect("graph_source_queue_consumer_input_relation", "readonly_metadata_accumulation_queue_consumer", "source_queue", "readonly_metadata_accumulation_queue");
  expect("graph_source_queue_consumer_relation", "readonly_metadata_accumulation_queue_query", "source_queue_consumer", "readonly_metadata_accumulation_queue_consumer");
  expect("graph_source_queue_surface_query_relation", "readonly_metadata_accumulation_queue_surface_snapshot", "source_query", "readonly_metadata_accumulation_queue_query");
  expect("graph_source_queue_surface_consumer_relation", "readonly_metadata_accumulation_queue_surface_snapshot", "source_queue_consumer", "readonly_metadata_accumulation_queue_consumer");
  expect("graph_source_queue_detail_surface_relation", "readonly_metadata_accumulation_queue_detail_view", "source_surface_snapshot", "readonly_metadata_accumulation_queue_surface_snapshot");
  expect("graph_source_queue_navigation_surface_relation", "readonly_metadata_accumulation_queue_detail_navigation", "source_surface_snapshot", "readonly_metadata_accumulation_queue_surface_snapshot");
  expect("graph_source_workspace_session_relation", "readonly_review_workspace", "source_session_drilldown", "readonly_session_drilldown");
  expect("graph_source_workspace_metadata_navigation_relation", "readonly_review_workspace", "source_metadata_queue_navigation", "readonly_metadata_accumulation_queue_detail_navigation");
  expect("graph_source_matrix_workspace_relation", "readonly_review_workspace_case_matrix", "source_workspace", "readonly_review_workspace");
  expect("graph_source_matrix_collection_relation", "readonly_review_workspace_case_matrix", "source_collection_consumer", "readonly_collection_consumer_payload");
  expect("graph_source_matrix_metadata_navigation_relation", "readonly_review_workspace_case_matrix", "source_metadata_queue_navigation", "readonly_metadata_accumulation_queue_detail_navigation");
  ctx.addResult(
    "graph_source_corpus_matrix_relation",
    (graph.artifacts.readonly_review_workspace_corpus.data.source_case_matrices || []).includes(pathFor("readonly_review_workspace_case_matrix")),
    JSON.stringify(graph.artifacts.readonly_review_workspace_corpus.data.source_case_matrices || [])
  );
  expect("graph_source_renderer_corpus_relation", "readonly_review_corpus_renderer", "source_corpus", "readonly_review_workspace_corpus");
  expect("graph_source_renderer_matrix_relation", "readonly_review_corpus_renderer", "source_case_matrix", "readonly_review_workspace_case_matrix");
  expect("graph_source_handoff_renderer_relation", "review_console_readonly_corpus_renderer_static_handoff", "source_renderer_ref", "readonly_review_corpus_renderer");
  expect("graph_source_handoff_corpus_relation", "review_console_readonly_corpus_renderer_static_handoff", "source_corpus_ref", "readonly_review_workspace_corpus");
  expect("graph_source_handoff_matrix_relation", "review_console_readonly_corpus_renderer_static_handoff", "source_case_matrix_ref", "readonly_review_workspace_case_matrix");
}

function validateReviewConsistency(graph, ctx) {
  const taxonomyPath = graph.artifacts.failure_taxonomy.entry.path;
  const accumulationPath = graph.artifacts.metadata_accumulation_contract.entry.path;
  const tagIndex = taxonomyIndex(graph.artifacts.failure_taxonomy.data);
  const rows = canonicalRows(graph);
  const byReviewId = new Map(rows.map((row) => [row.review_result_id, row]));
  const reviewObjects = collectReviewObjects(graph);

  ctx.addResult("graph_canonical_outcomes_exact", sameSet(rows.map((row) => row.outcome), expectedOutcomes), rows.map((row) => row.outcome).join(", "));
  ctx.addResult("graph_canonical_review_result_ids_unique", new Set(rows.map((row) => row.review_result_id)).size === rows.length);
  ctx.addResult("graph_canonical_candidate_ids_unique", new Set(rows.map((row) => row.candidate_id)).size === rows.length);
  ctx.addResult("graph_canonical_case_ids_unique", new Set(rows.map((row) => row.case_id)).size === rows.length);

  const identityMismatches = [];
  const sessionMismatches = [];
  const caseMismatches = [];
  const taxonomyMismatches = [];
  const tagMismatches = [];
  const exactTagMismatches = [];
  const summaryMismatches = [];
  const reasonsMismatches = [];
  const nextActionMismatches = [];
  const metadataActionMismatches = [];
  const accumulationMismatches = [];
  const neverProductionMismatches = [];

  for (const object of reviewObjects) {
    const row = object.value;
    const canonical = byReviewId.get(row.review_result_id);
    if (!canonical) {
      identityMismatches.push(`${object.role}:${object.path}: unknown review_result_id ${row.review_result_id}`);
      continue;
    }
    for (const field of ["candidate_id", "outcome"]) {
      if (Object.prototype.hasOwnProperty.call(row, field) && row[field] !== canonical[field]) {
        identityMismatches.push(`${object.role}:${object.path}.${field}=${row[field]} expected ${canonical[field]}`);
      }
    }
    if (Object.prototype.hasOwnProperty.call(row, "session_id") && row.session_id !== canonical.session_id) {
      sessionMismatches.push(`${object.role}:${object.path}.session_id=${row.session_id} expected ${canonical.session_id}`);
    }
    if (Object.prototype.hasOwnProperty.call(row, "case_id") && row.case_id !== canonical.case_id) {
      caseMismatches.push(`${object.role}:${object.path}.case_id=${row.case_id} expected ${canonical.case_id}`);
    }
    if (Object.prototype.hasOwnProperty.call(row, "taxonomy_ref") && row.taxonomy_ref !== taxonomyPath) {
      taxonomyMismatches.push(`${object.role}:${object.path}.taxonomy_ref=${row.taxonomy_ref}`);
    }
    if (Array.isArray(row.taxonomy_refs) && row.taxonomy_refs.some((ref) => ref !== taxonomyPath)) {
      taxonomyMismatches.push(`${object.role}:${object.path}.taxonomy_refs=${JSON.stringify(row.taxonomy_refs)}`);
    }
    if (Object.prototype.hasOwnProperty.call(row, "accumulation_ref") && row.accumulation_ref !== accumulationPath) {
      identityMismatches.push(`${object.role}:${object.path}.accumulation_ref=${row.accumulation_ref}`);
    }
    if (Object.prototype.hasOwnProperty.call(row, "summary") && row.summary !== canonical.summary) {
      summaryMismatches.push(`${object.role}:${object.path}.summary drifted`);
    }
    if (Array.isArray(row.reasons) && !sameArray(row.reasons, canonical.reasons)) {
      reasonsMismatches.push(`${object.role}:${object.path}.reasons=${JSON.stringify(row.reasons)} expected ${JSON.stringify(canonical.reasons)}`);
    }
    for (const tag of row.failure_tags || []) {
      const tagMetadata = tagIndex.get(tag);
      if (!tagMetadata || tagMetadata.default_outcome !== canonical.outcome) {
        tagMismatches.push(`${object.role}:${object.path}.failure_tags includes ${tag} for ${canonical.outcome}`);
      }
    }
    if (Array.isArray(row.failure_tags) && !pathIsProjectionOnly(object.path, row) && !sameArray(row.failure_tags, canonical.failure_tags)) {
      exactTagMismatches.push(`${object.role}:${object.path}.failure_tags=${JSON.stringify(row.failure_tags)} expected ${JSON.stringify(canonical.failure_tags)}`);
    }
    if (Array.isArray(row.failure_taxonomy)) {
      const failureTaxonomyTags = row.failure_taxonomy.map((tag) => tag.tag_id);
      if (!sameArray(failureTaxonomyTags, canonical.failure_tags)) {
        exactTagMismatches.push(`${object.role}:${object.path}.failure_taxonomy=${JSON.stringify(failureTaxonomyTags)} expected ${JSON.stringify(canonical.failure_tags)}`);
      }
      for (const tag of row.failure_taxonomy) {
        const canonicalTag = tagIndex.get(tag.tag_id);
        if (!canonicalTag || tag.category_id !== canonicalTag.category_id || tag.severity !== canonicalTag.severity || tag.default_outcome !== canonicalTag.default_outcome) {
          tagMismatches.push(`${object.role}:${object.path}.failure_taxonomy.${tag.tag_id} metadata drifted`);
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(row, "next_review_action") &&
      row.next_review_action !== canonical.next_review_action) {
      nextActionMismatches.push(`${object.role}:${object.path}.next_review_action=${row.next_review_action}`);
    }
    if (Object.prototype.hasOwnProperty.call(row, "metadata_accumulation_action") &&
      row.metadata_accumulation_action !== canonical.metadata_accumulation_action) {
      metadataActionMismatches.push(`${object.role}:${object.path}.metadata_accumulation_action=${row.metadata_accumulation_action}`);
    }
    if (row.metadata_accumulation && stableJson(row.metadata_accumulation) !== stableJson(canonical.metadata_accumulation)) {
      accumulationMismatches.push(`${object.role}:${object.path}.metadata_accumulation drifted`);
    }
    if (row.metadata_actions && !pathIsProjectionOnly(object.path, row) &&
      stableJson(row.metadata_actions) !== stableJson(canonicalMetadataActions(canonical))) {
      accumulationMismatches.push(`${object.role}:${object.path}.metadata_actions=${stableJson(row.metadata_actions)} expected ${stableJson(canonicalMetadataActions(canonical))}`);
    }
    if (Object.prototype.hasOwnProperty.call(row, "never_production")) {
      const expected = canonical.outcome === "reject";
      if (row.never_production !== expected) {
        neverProductionMismatches.push(`${object.role}:${object.path}.never_production=${row.never_production} expected ${expected}`);
      }
    }
  }

  ctx.addResult("graph_review_identity_consistency", identityMismatches.length === 0, identityMismatches.join("; "));
  ctx.addResult("graph_review_session_ids_resolve", sessionMismatches.length === 0, sessionMismatches.join("; "));
  ctx.addResult("graph_review_case_ids_resolve", caseMismatches.length === 0, caseMismatches.join("; "));
  ctx.addResult("graph_taxonomy_refs_resolve", taxonomyMismatches.length === 0, taxonomyMismatches.join("; "));
  ctx.addResult("graph_failure_tags_taxonomy_membership", tagMismatches.length === 0, tagMismatches.join("; "));
  ctx.addResult("graph_failure_tags_exact", exactTagMismatches.length === 0, exactTagMismatches.join("; "));
  ctx.addResult("graph_summary_exact", summaryMismatches.length === 0, summaryMismatches.join("; "));
  ctx.addResult("graph_reasons_exact", reasonsMismatches.length === 0, reasonsMismatches.join("; "));
  ctx.addResult("graph_next_action_semantics", nextActionMismatches.length === 0, nextActionMismatches.join("; "));
  ctx.addResult("graph_metadata_action_semantics", metadataActionMismatches.length === 0, metadataActionMismatches.join("; "));
  ctx.addResult("graph_accumulation_semantics_exact", accumulationMismatches.length === 0, accumulationMismatches.join("; "));
  ctx.addResult("graph_reject_never_production_semantics", neverProductionMismatches.length === 0, neverProductionMismatches.join("; "));
  ctx.addResult("projection_summary_consistent", summaryMismatches.length === 0, summaryMismatches.join("; "));
  ctx.addResult("projection_reasons_consistent", reasonsMismatches.length === 0, reasonsMismatches.join("; "));
  ctx.addResult("projection_failure_tags_consistent", exactTagMismatches.length === 0, exactTagMismatches.join("; "));
  ctx.addResult("projection_taxonomy_ref_consistent", taxonomyMismatches.length === 0, taxonomyMismatches.join("; "));
  ctx.addResult("projection_next_review_action_consistent", nextActionMismatches.length === 0, nextActionMismatches.join("; "));
  ctx.addResult("projection_metadata_accumulation_consistent", accumulationMismatches.length === 0, accumulationMismatches.join("; "));
}

function validateSelectedPatchThread(graph, ctx) {
  const selectedMismatches = [];
  const selectedPaths = [
    ["readonly_detail_view", "selected_review_result_id"],
    ["readonly_detail_view", "selected_card.review_result_id"],
    ["readonly_detail_navigation", "selected_review_result_id"],
    ["readonly_detail_navigation", "selected_detail.selected_review_result_id"],
    ["readonly_session_drilldown", "selected_review_result_id"],
    ["readonly_session_drilldown", "session_panel.selected_review_result_id"],
    ["readonly_session_drilldown", "selected_review_row.review_result_id"],
    ["readonly_session_drilldown", "selected_metadata_accumulation.review_result_id"],
    ["readonly_metadata_accumulation_queue", "selected_review_result_id"],
    ["readonly_metadata_accumulation_queue_consumer", "selected_patch_plan.review_result_id"],
    ["readonly_metadata_accumulation_queue_surface_snapshot", "surface.selected_review_result_id"],
    ["readonly_metadata_accumulation_queue_detail_view", "selected_review_result_id"],
    ["readonly_metadata_accumulation_queue_detail_view", "selected_card.review_result_id"],
    ["readonly_metadata_accumulation_queue_detail_navigation", "selected_detail.selected_review_result_id"],
    ["readonly_review_workspace", "selected_review_result_id"],
    ["readonly_review_workspace", "review_session_panel.selected_review_result_id"],
    ["readonly_review_workspace", "selected_result_panel.review_result_id"],
    ["readonly_review_workspace_case_matrix", "selected_review_result_id"],
  ];
  for (const [role, fieldPath] of selectedPaths) {
    const actual = getValue(graph.artifacts[role]?.data, fieldPath);
    if (actual !== expectedSelectedReviewResultId) {
      selectedMismatches.push(`${role}.${fieldPath}=${actual}`);
    }
  }

  const selectedSurfaceItems = graph.artifacts.readonly_metadata_accumulation_queue_surface_snapshot.data.surface.selected_items || [];
  for (const item of selectedSurfaceItems) {
    if (item.review_result_id !== expectedSelectedReviewResultId) {
      selectedMismatches.push(`readonly_metadata_accumulation_queue_surface_snapshot.surface.selected_items.${item.section_id}=${item.review_result_id}`);
    }
  }

  const selectedNavigationKey =
    graph.artifacts.readonly_metadata_accumulation_queue_detail_navigation.data.selected_navigation_key;
  if (selectedNavigationKey !== `patch_plan_only:${expectedSelectedReviewResultId}`) {
    selectedMismatches.push(`readonly_metadata_accumulation_queue_detail_navigation.selected_navigation_key=${selectedNavigationKey}`);
  }

  ctx.addResult("graph_selected_review_result_consistency", selectedMismatches.length === 0, selectedMismatches.join("; "));
}

function validateBoundaries(graph, ctx) {
  const forbiddenMatches = [];
  const pathMatches = [];
  const repoRefMismatches = [];

  walk({ catalog: graph.catalog, artifacts: Object.fromEntries(Object.entries(graph.artifacts).map(([role, artifact]) => [role, artifact.data])) }, (value, pathParts) => {
    const key = pathParts[pathParts.length - 1];
    const pathLabel = pathParts.join(".");
    if (value === true && forbiddenTrueFields.has(key)) {
      forbiddenMatches.push(pathLabel);
    }
    if (hasAbsoluteLoopbackOrSecret(value)) {
      pathMatches.push(pathLabel || "<root>");
    }
    if (typeof value === "string" && /^(tests|docs|kernel|scripts|schemas|review_console)\//.test(value)) {
      if (!fs.existsSync(repoPath(value))) repoRefMismatches.push(`${pathLabel}=${value}`);
    }
  });

  ctx.addResult("graph_forbidden_flags_false", forbiddenMatches.length === 0, forbiddenMatches.join("; "));
  ctx.addResult("graph_no_absolute_or_loopback_or_secret", pathMatches.length === 0, pathMatches.join("; "));
  ctx.addResult("graph_repo_relative_refs_exist", repoRefMismatches.length === 0, repoRefMismatches.join("; "));
}

function validateGraph(graph) {
  const ctx = createContext();
  validateCatalogClosure(graph, ctx);
  validateSourceRelations(graph, ctx);
  validateReviewConsistency(graph, ctx);
  validateDerivedOwnership(graph, ctx);
  validateSelectedPatchThread(graph, ctx);
  validateBoundaries(graph, ctx);
  return ctx;
}

function collectFailureCodes(fn) {
  const ctx = fn();
  return ctx.errors.map((error) => error.check);
}

function validateNegativeCases(baseGraph, ctx) {
  ctx.addResult("graph_negative_cases_count_expected", expectedNegativeCases.length === 21, expectedNegativeCases.length);
  for (const negativeCase of expectedNegativeCases) {
    const graph = deepClone(baseGraph);
    negativeCase.mutate(graph);
    const failureCodes = collectFailureCodes(() => validateGraph(graph));
    ctx.addResult(`graph_negative_case_${negativeCase.case_id}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    ctx.addResult(
      `graph_negative_case_${negativeCase.case_id}_expected_failure_code`,
      failureCodes.includes(negativeCase.expected_failure_code),
      failureCodes.join(", ")
    );
  }
}

function main() {
  const graph = loadGraph();
  const ctx = validateGraph(graph);
  validateNegativeCases(graph, ctx);
  const passed = ctx.errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_artifact_graph",
    passed,
    catalog: catalogPath,
    artifact_count: graph.catalog.artifact_entries?.length || 0,
    negative_case_count: expectedNegativeCases.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_002_started: false,
    Batch_005_started: false,
    failed_count: ctx.errors.length,
    errors: ctx.errors,
    results: ctx.results,
  }, null, 2)}\n`);
  process.exitCode = passed ? 0 : 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_artifact_graph",
    passed: false,
    errors: [{ check: "graph_validator_exception", detail: error.message }],
  }, null, 2)}\n`);
  process.exitCode = 1;
}
