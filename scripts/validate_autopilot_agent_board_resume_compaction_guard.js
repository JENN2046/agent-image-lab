const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const fixturePath = "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json";

const resumeSurfacePaths = [
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/AUTOPILOT_LEDGER.md",
  "docs/00_project_roadmap.md"
];

const currentPhase = "agent_board_resume_compaction_guard_v1";
const completedTraceabilityPhase = "amber_packet_to_receipt_traceability_v1";
const nextBoundary = "future_real_provider_cost_boundary_v1";

const sideEffectFlags = {
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  dependency_change_performed: false,
  runtime_probe_performed: false,
  secret_value_read_performed: false,
  push_tag_release_deploy_performed: false
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function assertFalseFlags(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must be false`);
  }
}

function latestSection(text) {
  const leadingSeparators = text.match(/^(?:\s*---\s*)+/);
  const start = leadingSeparators ? leadingSeparators[0].length : 0;
  const contentAfterSeparators = text.slice(start).trimStart();
  if (contentAfterSeparators.startsWith("- [")) {
    const contentStart = text.indexOf(contentAfterSeparators, start);
    const nextSeparator = text.indexOf("\n---", contentStart);
    return text.slice(contentStart, nextSeparator === -1 ? text.length : nextSeparator);
  }

  const headingPattern = /^## .+$/gm;
  const firstHeading = headingPattern.exec(text);
  if (!firstHeading) {
    const nextSeparator = text.indexOf("\n---", start);
    return text.slice(start, nextSeparator === -1 ? text.length : nextSeparator);
  }
  const secondHeading = headingPattern.exec(text);
  return text.slice(firstHeading.index, secondHeading ? secondHeading.index : text.length);
}

function replaceLatestSection(text, replacer) {
  const latest = latestSection(text);
  return text.replace(latest, replacer(latest));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function taskQueueItemBlock(text, taskId) {
  const pattern = new RegExp(`^- \\[[ x]\\] ID: ${escapeRegExp(taskId)}\\s*$`, "m");
  const match = pattern.exec(text);
  assert(match, `task queue missing ${taskId}`);
  const blockStart = match.index;
  const afterMatchStart = blockStart + match[0].length;
  const rest = text.slice(afterMatchStart);
  const boundaryOffsets = [
    rest.search(/\r?\n- \[[ x]\] ID: /),
    rest.search(/\r?\n---\s*(?:\r?\n|$)/)
  ].filter((offset) => offset >= 0);
  const blockEnd = boundaryOffsets.length === 0
    ? text.length
    : afterMatchStart + Math.min(...boundaryOffsets);
  return text.slice(blockStart, blockEnd);
}

function replaceTaskQueueItemBlock(text, taskId, replacer) {
  const block = taskQueueItemBlock(text, taskId);
  return text.replace(block, replacer(block));
}

function validateSurface(pathName, text) {
  const latest = latestSection(text);
  assert(latest.includes(currentPhase), `${pathName} latest section must cite current phase`);
  assert(latest.includes(completedTraceabilityPhase), `${pathName} latest section must cite completed traceability phase`);
  assert(latest.includes(nextBoundary), `${pathName} latest section must cite next Red boundary`);
  assert(latest.includes("push_status: not_performed") || latest.includes("push_allowed: false"), `${pathName} latest section must preserve no-push state`);
  assert(
    latest.includes("provider_plugin_API_image_memory_source_read_dependency_runtime_performed: false") ||
      latest.includes("provider_contact_performed: false"),
    `${pathName} latest section must preserve no external/provider/runtime action state`
  );
  return {
    path: pathName,
    current_phase_present: latest.includes(currentPhase),
    completed_traceability_present: latest.includes(completedTraceabilityPhase),
    next_boundary_present: latest.includes(nextBoundary),
    no_push_present: latest.includes("push_status: not_performed") || latest.includes("push_allowed: false")
  };
}

function validateRoadmap(text) {
  assert(text.includes("current_phase: agent_board_resume_compaction_guard_v1"), "roadmap current_phase mismatch");
  assert(text.includes("agent_board_resume_compaction_guard_active: true"), "roadmap active flag missing");
  assert(text.includes("evolution_next_recommended_task: future_real_provider_cost_boundary_v1"), "roadmap next boundary mismatch");
}

function validateTaskQueue(text) {
  const resumeGuardBlock = taskQueueItemBlock(text, currentPhase);
  const futureProviderBlock = taskQueueItemBlock(text, nextBoundary);
  assert(resumeGuardBlock.includes(`- [x] ID: ${currentPhase}`), "task queue must mark resume guard completed");
  assert(futureProviderBlock.includes(`- [ ] ID: ${nextBoundary}`), "task queue must record future Red provider boundary as pending");
  assert(futureProviderBlock.includes("Lane: Red."), "future provider boundary must remain Red");
  assert(futureProviderBlock.includes("Required authorization:"), "future provider boundary must require authorization inside its own task block");
  for (const token of ["provider target", "call budget", "cost cap", "rollback"]) {
    assert(futureProviderBlock.includes(token), `future provider boundary authorization must mention ${token}`);
  }
}

function expectFailure(caseId, mutate) {
  const surfaces = Object.fromEntries(resumeSurfacePaths.map((surface) => [surface, read(surface)]));
  mutate(surfaces);

  try {
    for (const [surface, text] of Object.entries(surfaces)) {
      validateSurface(surface, text);
    }
    validateRoadmap(surfaces["docs/00_project_roadmap.md"]);
    validateTaskQueue(surfaces[".agent_board/TASK_QUEUE.md"]);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      expected_failure: true,
      failure_message: error.message
    };
  }

  throw new Error(`${caseId} was not caught`);
}

function buildReport() {
  const surfaceResults = resumeSurfacePaths.map((surface) => validateSurface(surface, read(surface)));
  validateRoadmap(read("docs/00_project_roadmap.md"));
  validateTaskQueue(read(".agent_board/TASK_QUEUE.md"));

  const evolution = readJson("tests/schema_examples/autopilot_evolution_backlog.example.json").autopilot_evolution_backlog;
  assert(evolution.completed_capabilities.some((capability) => capability.capability_id === currentPhase), "evolution must record resume guard as completed");
  assert(evolution.next_recommended_task === nextBoundary, "evolution next recommended boundary mismatch");
  assert(evolution.next_recommended_task_lane === "Red", "evolution next recommended lane must be Red");
  assert(evolution.red_lane_self_authorized === false, "Red lane must not be self-authorized");

  const negativeCases = [
    expectFailure("run_state_missing_current_phase_fails", (surfaces) => {
      surfaces[".agent_board/RUN_STATE.md"] = surfaces[".agent_board/RUN_STATE.md"].split(currentPhase).join("stale_phase");
    }),
    expectFailure("run_state_latest_section_missing_current_phase_even_when_history_has_it_fails", (surfaces) => {
      surfaces[".agent_board/RUN_STATE.md"] = replaceLatestSection(
        surfaces[".agent_board/RUN_STATE.md"],
        (latest) => latest.split(currentPhase).join("stale_phase")
      );
    }),
    expectFailure("task_queue_missing_red_boundary_fails", (surfaces) => {
      surfaces[".agent_board/TASK_QUEUE.md"] = surfaces[".agent_board/TASK_QUEUE.md"].split(nextBoundary).join("missing_red_boundary");
    }),
    expectFailure("task_queue_future_provider_missing_bound_authorization_fails", (surfaces) => {
      surfaces[".agent_board/TASK_QUEUE.md"] = replaceTaskQueueItemBlock(
        surfaces[".agent_board/TASK_QUEUE.md"],
        nextBoundary,
        (block) => block.replace("Required authorization:", "Authorization moved outside this task:")
      );
    }),
    expectFailure("checkpoint_missing_traceability_completion_fails", (surfaces) => {
      surfaces[".agent_board/CHECKPOINT.md"] = surfaces[".agent_board/CHECKPOINT.md"].split(completedTraceabilityPhase).join("missing_traceability");
    }),
    expectFailure("handoff_missing_no_push_state_fails", (surfaces) => {
      surfaces[".agent_board/HANDOFF.md"] = surfaces[".agent_board/HANDOFF.md"].split("push_status: not_performed").join("push_status: ambiguous");
    }),
    expectFailure("roadmap_current_phase_drift_fails", (surfaces) => {
      surfaces["docs/00_project_roadmap.md"] = surfaces["docs/00_project_roadmap.md"].replace("current_phase: agent_board_resume_compaction_guard_v1", "current_phase: stale_phase");
    })
  ];

  return {
    autopilot_agent_board_resume_compaction_guard: {
      version: "v1",
      phase: currentPhase,
      selected_task: "add_agent_board_resume_compaction_guard_validator",
      selected_task_lane: "Green",
      resume_surface_count: resumeSurfacePaths.length,
      resume_surfaces: surfaceResults,
      all_resume_surfaces_current: surfaceResults.every((surface) => surface.current_phase_present && surface.next_boundary_present),
      completed_traceability_phase: completedTraceabilityPhase,
      next_recommended_task: nextBoundary,
      next_recommended_task_lane: "Red",
      red_boundary_requires_authorization: true,
      evolution_completed_capability_verified: true,
      negative_cases: negativeCases,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      validator_strengthened: "Agent board resume compaction now fails if current phase, completed traceability, next Red boundary, no-push state, or roadmap/task queue alignment drifts.",
      side_effect_flags: sideEffectFlags
    }
  };
}

function main() {
  const report = buildReport();
  const actual = report.autopilot_agent_board_resume_compaction_guard;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "Agent board resume compaction guard deterministic output");
  assertDeepEqual(report, expected, "Agent board resume compaction guard fixture");
  assert(actual.phase === currentPhase, "phase mismatch");
  assert(actual.selected_task === "add_agent_board_resume_compaction_guard_validator", "selected task mismatch");
  assert(actual.selected_task_lane === "Green", "selected task lane mismatch");
  assert(actual.resume_surface_count === resumeSurfacePaths.length, "resume surface count mismatch");
  assert(actual.all_resume_surfaces_current === true, "all resume surfaces must be current");
  assert(actual.next_recommended_task === nextBoundary, "next recommended task mismatch");
  assert(actual.next_recommended_task_lane === "Red", "next recommended lane must be Red");
  assert(actual.red_boundary_requires_authorization === true, "Red boundary must require authorization");
  assert(actual.negative_case_count >= 5, "at least five resume negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "caught count must equal negative case count");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");
  assertFalseFlags(actual.side_effect_flags);

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    deterministic_output_verified: true,
    fixture_verified: true,
    selected_task: actual.selected_task,
    selected_task_lane: actual.selected_task_lane,
    resume_surface_count: actual.resume_surface_count,
    all_resume_surfaces_current: actual.all_resume_surfaces_current,
    completed_traceability_phase: actual.completed_traceability_phase,
    next_recommended_task: actual.next_recommended_task,
    next_recommended_task_lane: actual.next_recommended_task_lane,
    red_boundary_requires_authorization: actual.red_boundary_requires_authorization,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    dependency_change_performed: false,
    runtime_probe_performed: false,
    secret_value_read_performed: false,
    push_tag_release_deploy_performed: false
  }, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  buildReport
};
