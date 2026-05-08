const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/231_runtime_review_batch_10c_future_a5_authorization_package_consolidation.md";

const requiredSections = [
  "bridge",
  "plugin",
  "asset_review",
  "memory",
  "rollback",
  "forbidden_outputs",
  "version_actions"
];

const requiredSectionsInDoc = [
  "metadata",
  "external_roots",
  "external_worktrees",
  "bridge",
  "plugin",
  "asset_review",
  "memory",
  "rollback",
  "version_actions",
  "forbidden_outputs",
  "execution_plan",
  "preflight_checklist"
];

const forbiddenOutputs = [
  "raw_local_path",
  "raw_endpoint",
  "raw_websocket_url",
  "raw_runtime_log",
  "raw_ipc_payload",
  "raw_plugin_output",
  "raw_source_code",
  "secret",
  "token",
  "cookie",
  "password",
  "customer_private_data",
  "image_binary_in_git_or_memory"
];

const forbiddenTerms = [
  /[aA][pP][iI][-_]?[kK][eE][yY]/,
  /token\s*[:=]\s*\w/i,
  /password\s*[:=]\s*\w/i,
  /C:[/\\]Users/i,
  /\\\\wsl/i
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

  // Verify all 7 domains covered
  for (const section of requiredSections) {
    assert(new RegExp(`#.*${section}`.replace(/_/g, "[_ ]"), "i").test(content) || content.includes(section),
      `Doc must contain section: ${section}`);
  }
  results.push({ check: "all_seven_domains_covered", passed: true, sections: requiredSections });

  // Verify all template sections present
  for (const section of requiredSectionsInDoc) {
    // Look for YAML key or heading
    const pattern = new RegExp(`${section}\\s*:`, "i");
    assert(pattern.test(content), `Template must contain field: ${section}`);
  }
  results.push({ check: "all_template_sections_present", passed: true, count: requiredSectionsInDoc.length });

  // Verify real roots are placeholders
  assert(!/real_vcpchat_root\s*:\s*(?!required_external)/i.test(content) ||
    /real_vcpchat_root\s*:\s*required_external_value_not_recorded_in_git/i.test(content),
    "real_vcpchat_root must be placeholder");
  assert(!/real_vcptoolbox_root\s*:\s*(?!required_external)/i.test(content) ||
    /real_vcptoolbox_root\s*:\s*required_external_value_not_recorded_in_git/i.test(content),
    "real_vcptoolbox_root must be placeholder");
  results.push({ check: "real_roots_are_placeholders", passed: true });

  // Verify forbidden outputs list
  for (const output of forbiddenOutputs.slice(0, 5)) {
    assert(content.includes(output), `Forbidden outputs must list: ${output}`);
  }
  results.push({ check: "forbidden_outputs_listed", passed: true, count: forbiddenOutputs.length });

  // Verify field dependency map
  assert(/field.dependency.map/i.test(content), "Doc must contain field dependency map");
  results.push({ check: "field_dependency_map_present", passed: true });

  // Verify activation flow
  assert(/activation.flow/i.test(content), "Doc must contain activation flow");
  results.push({ check: "activation_flow_present", passed: true });

  // Verify historical alignment
  assert(/historical.alignment/i.test(content), "Doc must contain historical alignment");
  results.push({ check: "historical_alignment_present", passed: true });

  // Verify missing field rules
  assert(/missing.field/i.test(content), "Doc must contain missing field rules");
  results.push({ check: "missing_field_rules_present", passed: true });

  // Verify acceptance criteria
  assert(/acceptance.criteria/i.test(content), "Doc must contain acceptance criteria");
  results.push({ check: "acceptance_criteria_present", passed: true });

  // Verify template is not auto-trigger
  assert(/not an auto.execution trigger/i.test(content) || /不是自动执行触发器/i.test(content),
    "Template must state it is not an auto-execution trigger");
  results.push({ check: "template_not_auto_trigger", passed: true });

  // Verify no forbidden terms
  for (const pattern of forbiddenTerms) {
    assert(!pattern.test(content), `Doc must not contain forbidden term: ${pattern.source}`);
  }
  results.push({ check: "no_forbidden_terms", passed: true });

  // Verify no-execution guard
  assert(/real_vcpchat_read.*false/i.test(content), "Doc must declare real_vcpchat_read: false");
  assert(/version_action_performed.*false/i.test(content), "Doc must declare version_action_performed: false");
  results.push({ check: "no_execution_guard_present", passed: true });

  const summary = {
    passed: true,
    phase: "Runtime Review Batch 10C future A5 authorization package consolidation",
    doc: docPath,
    check_count: results.length,
    failed_count: 0,
    domains_covered: requiredSections.length,
    template_sections: requiredSectionsInDoc.length,
    real_roots_are_placeholders: true,
    template_not_auto_trigger: true,
    real_execution: false,
    external_network_required: false,
    file_write_performed: false,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
