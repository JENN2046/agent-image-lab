const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.0 next milestone planning";
const previousPhase = "v5.16 release publication preflight";
const currentHead = "e31e57e";
const releaseCandidateTag = "v5.14-release-candidate-validation-baseline";
const releasePackageSha = "2fa0204a855ea9b74a36c5f8bf701356dd35414d3b35d3e85e1bf367492197db";

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function main() {
  const requiredFiles = [
    "docs/142_v6_0_next_milestone_planning.md",
    "tests/schema_examples/v6_0_next_milestone_planning.example.yaml",
    "scripts/validate_v6_0_next_milestone_planning.js",
    "tests/validation_checklist.md",
    "docs/141_v5_16_release_publication_preflight.md",
    "scripts/validate_v5_16_release_publication_preflight.js"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.0 next milestone planning files: ${missingFiles.join(", ")}`);

  const doc = read("docs/142_v6_0_next_milestone_planning.md");
  const schema = read("tests/schema_examples/v6_0_next_milestone_planning.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    `release_candidate_tag: ${releaseCandidateTag}`,
    `release_package_sha256: ${releasePackageSha}`,
    "release_publication_preflight_ready: true",
    "github_release_published: false",
    "release_assets_uploaded: false"
  ]);

  const tracksRecorded = includesAll(combined, [
    "release_track",
    "v5.17 GitHub Release Publication Authorization",
    "runtime_product_track",
    "v6.1 Runtime Product Surface Audit",
    "runtime_state_track",
    "v6.2 Runtime State Model Alignment",
    "host_bridge_track",
    "v6.3 Host Bridge Contract v2",
    "adapter_review_console_track",
    "v6.4 Adapter -> Review Console Runtime Roundtrip Fixture",
    "memory_handoff_track",
    "v6.5 Memory Handoff Runtime Status",
    "vcpchat_integration_track",
    "v6.6 VCPChat Embed Implementation Preflight"
  ]);

  const sequenceRecorded = includesAll(combined, [
    "v6.1",
    "Runtime Product Surface Audit",
    "v6.2",
    "Runtime State Model Alignment",
    "v6.3",
    "Host Bridge Contract v2",
    "v6.4",
    "Adapter -> Review Console Runtime Roundtrip Fixture",
    "v6.5",
    "Memory Handoff Runtime Status",
    "v6.6",
    "VCPChat Embed Implementation Preflight",
    "v6.7",
    "Release or Integration Decision Gate"
  ]);

  const boundariesPreserved = includesAll(combined, [
    "tag_creation_required_now: false",
    "package_creation_required_now: false",
    "github_release_created: false",
    "github_release_published: false",
    "release_assets_uploaded: false",
    "release_publish_authorized: false",
    "real_vcpchat_source_read: false",
    "real_vcptoolbox_source_read: false",
    "real_manifest_read: false",
    "ipc_handler_created: false",
    "preload_runtime_code_created: false",
    "renderer_runtime_code_created: false",
    "adapter_execution_entrypoint_created: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_file_created: false"
  ]);

  const stopGatesRecorded = includesAll(combined, [
    "github_release_publication",
    "real_vcpchat_read",
    "runtime_implementation",
    "plugin_or_api_execution",
    "dailynote_or_vcp_memory_write",
    "allowed_without_new_authorization: false"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v6.0 Next Milestone Planning 检查",
    "docs/142_v6_0_next_milestone_planning.md",
    "tests/schema_examples/v6_0_next_milestone_planning.example.yaml",
    "scripts/validate_v6_0_next_milestone_planning.js",
    currentPhase,
    currentHead,
    releaseCandidateTag,
    "v6.1 Runtime Product Surface Audit",
    "v6.4 Adapter -> Review Console Runtime Roundtrip Fixture",
    "v6.6 VCPChat Embed Implementation Preflight"
  ]);

  assert(baselineRecorded, "v6.0 must record current baseline and v5.16 context.");
  assert(tracksRecorded, "v6.0 must record all next milestone work tracks.");
  assert(sequenceRecorded, "v6.0 must record recommended v6.x sequence.");
  assert(boundariesPreserved, "v6.0 must preserve no-release, no-read, no-execution, no-image boundaries.");
  assert(stopGatesRecorded, "v6.0 must record explicit stop gates.");
  assert(checklistCurrent, "validation checklist must include v6.0 checks.");

  const result = {
    passed: true,
    next_milestone_planning: {
      version: "v6.0",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      release_candidate_tag: releaseCandidateTag,
      release_publication_preflight_ready: true,
      default_next_phase: "v6.1 Runtime Product Surface Audit",
      tracks_recorded: tracksRecorded,
      sequence_recorded: sequenceRecorded,
      boundaries_preserved: boundariesPreserved,
      stop_gates_recorded: stopGatesRecorded,
      checklist_current: checklistCurrent,
      github_release_published: false,
      release_assets_uploaded: false,
      real_vcpchat_source_read: false,
      real_vcptoolbox_source_read: false,
      real_manifest_read: false,
      ipc_handler_created: false,
      preload_runtime_code_created: false,
      renderer_runtime_code_created: false,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_file_created: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
