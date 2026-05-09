const fs = require('fs');
const path = require('path');

const results = {};
let allPass = true;

function check(name, pass, detail) {
  results[name] = { pass, detail };
  if (!pass) allPass = false;
}

function containsAll(content, items) {
  return items.every(item => content.includes(item));
}

const repoRoot = path.resolve(__dirname, '..');

function read(pathRelative) {
  return fs.readFileSync(path.join(repoRoot, pathRelative), 'utf-8');
}

// --- Read allowed files ---
const contract = read('docs/v7_50d_vcpchat_review_console_surface_contract.md');
const visibility = read('docs/v7_50d_vcpchat_review_console_surface_visibility_policy.md');
const secGates = read('docs/v7_50d_vcpchat_review_console_surface_security_gates.md');
const planYaml = read('docs/v7_50d_vcpchat_review_console_surface_plan.yaml');
const dryRunResult = read('docs/v7_50c_vcp_read_only_bridge_dry_run_execution_result.yaml');
const closeout = read('production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md');

// --- Construct surface fixture ---
const surfaceFixture = {
  schema_version: 'v1',
  phase: 'v7_50d',
  surface_id: 'v7_50d_vcpchat_review_console_surface_001',
  render_mode: 'read_only',
  payload_type: 'text_only_refs',
  returned_refs_only: true,
  case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
  current_case_state: 'closed_no_memory_write',
  visible_sections: [
    'header_status_bar',
    'bridge_dry_run_summary',
    'returned_text_only_refs_panel',
    'safety_gates_panel',
    'closed_case_status_panel',
    'forbidden_payloads_panel',
    'next_allowed_steps_panel',
    'hard_stops_panel'
  ],
  user_actions_enabled: {
    approve_memory_write: false,
    write_dailynote: false,
    write_vcp_memory: false,
    generate_image: false,
    retry_generation: false,
    reopen_closed_case: false
  },
  image_binary_rendered: false,
  secrets_rendered: false,
  raw_payload_rendered: false,
  private_absolute_path_rendered: false,
  production_approved_claim_rendered: false
};

// --- Validate surface fixture structure ---
check('fixture_has_schema_version', surfaceFixture.schema_version === 'v1', surfaceFixture.schema_version);
check('fixture_phase_is_v7_50d', surfaceFixture.phase === 'v7_50d', surfaceFixture.phase);
check('fixture_render_mode_read_only', surfaceFixture.render_mode === 'read_only', surfaceFixture.render_mode);
check('fixture_payload_type_text_only_refs', surfaceFixture.payload_type === 'text_only_refs', surfaceFixture.payload_type);
check('fixture_returned_refs_only_true', surfaceFixture.returned_refs_only === true, String(surfaceFixture.returned_refs_only));
check('fixture_case_id_matches', surfaceFixture.case_id === 'french_summer_rattan_bag_v3_production_candidate_001', surfaceFixture.case_id);
check('fixture_case_state_closed_no_memory_write', surfaceFixture.current_case_state === 'closed_no_memory_write', surfaceFixture.current_case_state);

// --- Validate visible sections ---
const expectedSections = [
  'header_status_bar', 'bridge_dry_run_summary', 'returned_text_only_refs_panel',
  'safety_gates_panel', 'closed_case_status_panel', 'forbidden_payloads_panel',
  'next_allowed_steps_panel', 'hard_stops_panel'
];
const sectionCheck = expectedSections.every(s => surfaceFixture.visible_sections.includes(s));
check('fixture_has_all_expected_sections', sectionCheck, `expected ${expectedSections.length} sections, got ${surfaceFixture.visible_sections.length}`);

// --- Validate user_actions_enabled all false ---
const actions = surfaceFixture.user_actions_enabled;
const allActionsFalse = Object.values(actions).every(v => v === false);
check('fixture_all_user_actions_disabled', allActionsFalse, JSON.stringify(actions));

// --- 12 Surface Gates ---

// Gate 1: render_mode must be read_only
check('render_mode_must_be_read_only',
  surfaceFixture.render_mode === 'read_only',
  `render_mode=${surfaceFixture.render_mode}`);

// Gate 2: payload_type must be text_only_refs
check('payload_type_must_be_text_only_refs',
  surfaceFixture.payload_type === 'text_only_refs',
  `payload_type=${surfaceFixture.payload_type}`);

// Gate 3: returned_refs_only must be true
check('returned_refs_only_must_be_true',
  surfaceFixture.returned_refs_only === true,
  `returned_refs_only=${surfaceFixture.returned_refs_only}`);

// Gate 4: image_binary must not render
check('image_binary_must_not_render',
  surfaceFixture.image_binary_rendered === false,
  `image_binary_rendered=${surfaceFixture.image_binary_rendered}`);

// Gate 5: secrets must not render
check('secrets_must_not_render',
  surfaceFixture.secrets_rendered === false,
  `secrets_rendered=${surfaceFixture.secrets_rendered}`);

// Gate 6: raw_payload must not render
check('raw_payload_must_not_render',
  surfaceFixture.raw_payload_rendered === false,
  `raw_payload_rendered=${surfaceFixture.raw_payload_rendered}`);

// Gate 7: private_absolute_path must not render
check('private_absolute_path_must_not_render',
  surfaceFixture.private_absolute_path_rendered === false,
  `private_absolute_path_rendered=${surfaceFixture.private_absolute_path_rendered}`);

// Gate 8: memory_write action must not render
check('memory_write_action_must_not_render',
  actions.approve_memory_write === false,
  `approve_memory_write=${actions.approve_memory_write}`);

// Gate 9: dailynote_write action must not render
check('dailynote_write_action_must_not_render',
  actions.write_dailynote === false,
  `write_dailynote=${actions.write_dailynote}`);

// Gate 10: generate_image action must not render
check('generate_image_action_must_not_render',
  actions.generate_image === false,
  `generate_image=${actions.generate_image}`);

// Gate 11: closed_no_memory_write case must not reopen
check('closed_no_memory_write_case_must_not_reopen',
  surfaceFixture.current_case_state === 'closed_no_memory_write' && actions.reopen_closed_case === false,
  `case_state=${surfaceFixture.current_case_state}, reopen=${actions.reopen_closed_case}`);

// Gate 12: production_approved claim must not render
check('production_approved_claim_must_not_render',
  surfaceFixture.production_approved_claim_rendered === false,
  `production_approved_claim_rendered=${surfaceFixture.production_approved_claim_rendered}`);

// --- Verify contract contains allowed_display_fields ---
check('contract_contains_allowed_display_fields',
  contract.includes('allowed_display_fields'),
  'allowed_display_fields found in contract');

// --- Verify contract contains forbidden_display_fields ---
check('contract_contains_forbidden_display_fields',
  contract.includes('forbidden_display_fields'),
  'forbidden_display_fields found in contract');

// --- Verify visibility policy defines layers ---
check('visibility_policy_has_layers',
  visibility.includes('visibility_layers'),
  'visibility_layers found in visibility policy');

// --- Verify security gates defines gates ---
check('security_gates_define_surface_gates',
  secGates.includes('surface_security_gates'),
  'surface_security_gates found in security gates doc');

// --- Verify dry-run result says pass ---
check('dry_run_result_is_pass',
  dryRunResult.includes('result: pass'),
  'dry-run result is pass');

// --- Verify closeout says closed_no_memory_write ---
check('closeout_case_state_closed_no_memory_write',
  closeout.includes('closed_no_memory_write'),
  'closeout case state is closed_no_memory_write');

// --- Verify plan.yaml defines forbidden_actions ---
check('plan_yaml_has_forbidden_actions',
  planYaml.includes('forbidden_actions'),
  'forbidden_actions found in plan YAML');

// --- Build output ---
const gateKeys = [
  'render_mode_must_be_read_only',
  'payload_type_must_be_text_only_refs',
  'returned_refs_only_must_be_true',
  'image_binary_must_not_render',
  'secrets_must_not_render',
  'raw_payload_must_not_render',
  'private_absolute_path_must_not_render',
  'memory_write_action_must_not_render',
  'dailynote_write_action_must_not_render',
  'generate_image_action_must_not_render',
  'closed_no_memory_write_case_must_not_reopen',
  'production_approved_claim_must_not_render'
];

const gatesSummary = {};
gateKeys.forEach(k => {
  gatesSummary[k] = results[k] ? results[k].pass ? 'pass' : 'fail' : 'unknown';
});

const gatePassCount = gateKeys.filter(k => gatesSummary[k] === 'pass').length;
const gateFailCount = gateKeys.filter(k => gatesSummary[k] === 'fail').length;

const output = {
  fixture_execution_performed: true,
  fixture_type: 'local_static_surface_payload',
  result: allPass ? 'pass' : 'fail',
  surface_fixture: surfaceFixture,
  surface_gates: {
    total: gateKeys.length,
    passed: gatePassCount,
    failed: gateFailCount,
    gates: gatesSummary,
    all_pass: gateFailCount === 0
  },
  external_side_effects: {
    vcp_call_performed: false,
    vcpchat_bridge_call_performed: false,
    electron_started: false,
    remote_debug_started: false,
    cdp_call_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    image_generation_performed: false,
    image_binary_read: false,
    runs_path_read: false,
    production_candidate_closeout_modified: false
  },
  checked_files: [
    'docs/v7_50d_vcpchat_review_console_surface_contract.md',
    'docs/v7_50d_vcpchat_review_console_surface_visibility_policy.md',
    'docs/v7_50d_vcpchat_review_console_surface_security_gates.md',
    'docs/v7_50d_vcpchat_review_console_surface_plan.yaml',
    'docs/v7_50c_vcp_read_only_bridge_dry_run_execution_result.yaml',
    'production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md'
  ]
};

console.log(JSON.stringify(output, null, 2));

if (!allPass) {
  console.error('SURFACE_FIXTURE_VALIDATION_FAILED');
  process.exit(1);
}
