const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/230_runtime_review_batch_10a_release_candidate_acceptance_matrix.md";

const requiredDomains = [
  "bridge",
  "plugin",
  "asset archive",
  "memory lifecycle",
  "runtime prototype",
  "validator suite",
  "operator docs",
  "release readiness"
];

const validStatuses = ["complete", "local_only_complete", "blocked_by_authorization", "requires_future_work"];

const forbiddenTerms = [
  /api[_-]?key/i,
  /token\s*[:=]/i,
  /password\s*[:=]/i,
  /secret\s*[:=]/i,
  /private[_-]?path/i
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const results = [];

  assert(exists(docPath), `Doc ${docPath} must exist`);
  results.push({ check: "doc_exists", passed: true });

  const content = read(docPath);

  // Verify all 8 domains are covered
  for (const domain of requiredDomains) {
    const re = new RegExp(domain, "i");
    assert(re.test(content), `Doc must cover domain: ${domain}`);
  }
  results.push({ check: "all_eight_domains_covered", passed: true, domains: requiredDomains });

  // Verify status summary section
  assert(/status.summary/i.test(content), "Doc must contain status summary section");
  results.push({ check: "status_summary_present", passed: true });

  // Count status labels in the doc
  const completeCount = (content.match(/\bcomplete\b/g) || []).length;
  const localOnlyCount = (content.match(/\blocal_only_complete\b/g) || []).length;
  const blockedCount = (content.match(/\bblocked_by_authorization\b/g) || []).length;
  const futureWorkCount = (content.match(/\brequires_future_work\b/g) || []).length;

  assert(completeCount > 0, "At least one row must be marked complete");
  assert(blockedCount > 0, "At least one row must be marked blocked_by_authorization");
  results.push({
    check: "status_counts",
    passed: true,
    complete: completeCount,
    local_only_complete: localOnlyCount,
    blocked_by_authorization: blockedCount,
    requires_future_work: futureWorkCount
  });

  // Verify no-execution evidence section
  assert(/no.execution.evidence/i.test(content), "Doc must contain no-execution evidence section");
  results.push({ check: "no_execution_evidence_present", passed: true });

  // Verify acceptance criteria section
  assert(/acceptance.criteria/i.test(content), "Doc must contain acceptance criteria section");
  results.push({ check: "acceptance_criteria_present", passed: true });

  // Verify blocked detail section
  assert(/blocked.by.authorization.detail/i.test(content), "Doc must contain blocked authorization detail");
  results.push({ check: "blocked_detail_present", passed: true });

  // Verify no forbidden terms
  for (const pattern of forbiddenTerms) {
    assert(!pattern.test(content), `Doc must not contain forbidden term: ${pattern.source}`);
  }
  results.push({ check: "no_forbidden_terms", passed: true });

  // Verify doc contains no-execution guard flags
  assert(/real_vcpchat_read.*false/i.test(content), "Doc must declare real_vcpchat_read: false");
  assert(/real_vcptoolbox_read.*false/i.test(content), "Doc must declare real_vcptoolbox_read: false");
  assert(/plugin_called.*false/i.test(content), "Doc must declare plugin_called: false");
  assert(/version_action_performed.*false/i.test(content), "Doc must declare version_action_performed: false");
  results.push({ check: "no_execution_guard_present", passed: true });

  const summary = {
    passed: true,
    phase: "Runtime Review Batch 10A release-candidate acceptance matrix",
    doc: docPath,
    check_count: results.length,
    failed_count: 0,
    domains_covered: requiredDomains.length,
    status_counts: {
      complete: completeCount,
      local_only_complete: localOnlyCount,
      blocked_by_authorization: blockedCount,
      requires_future_work: futureWorkCount
    },
    real_execution: false,
    external_network_required: false,
    file_write_performed: false,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
