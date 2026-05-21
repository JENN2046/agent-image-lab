# Amber-02 Production Candidate Metadata Receipt Replay

base_contract: AGENTS.md
policy_model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope
task_id: amber_02_production_candidate_metadata_receipt_replay
lane: Amber
trial_type: local production-candidate metadata receipt replay
status: completed_validated

## Purpose

Amber-02 maps the existing tennis-wallet production candidate metadata write
into the Smart Standing Authorization v3 receipt ledger.

This is a local replay. It does not create a new production candidate, does not
modify `production/`, does not call providers, plugins, APIs, image generation,
DailyNote, or VCP memory, and does not read secrets or external VCP source.

## Envelope

```yaml
envelope_id: envelope-amber-02-production-candidate-receipt-replay
task_id: amber_02_production_candidate_metadata_receipt_replay
lane: Amber
target_systems:
  - local_repository_only
  - existing_production_candidate_metadata
max_provider_calls: 0
max_plugin_calls: 0
max_api_calls: 0
max_image_candidates: 0
max_external_read_files: 0
max_write_files: 4
max_dependency_actions: 0
max_runtime_probe_minutes: 0
retry_count: 0
overwrite_existing_files_allowed: false
secret_value_read_allowed: false
raw_private_data_print_allowed: false
push_allowed: false
tag_release_deploy_allowed: false
destructive_action_allowed: false
```

## Replay Source Evidence

```yaml
historical_activation_report: reports/production_candidate_authorization/2026-05-21_tennis_wallet_production_candidate_A5_activation_preflight.json
historical_authorization_id: AUTH-PENDING-TENNIS-WALLET-PRODUCTION-CANDIDATE-20260520-001
historical_candidate_id: accepted_product_still_life_tennis_wallet_001_production_candidate_001
historical_metadata_outputs:
  - production/plans/accepted_product_still_life_tennis_wallet_001_production_candidate_001_plan.yaml
  - production/reviews/accepted_product_still_life_tennis_wallet_001_production_candidate_001_review.md
```

The replay records the existing metadata write as historical evidence under the
v3 receipt model. It does not repeat the write.

## Actual Action

```yaml
action_performed: local_production_candidate_metadata_receipt_replay
target_systems:
  - local_repository_only
  - existing_production_candidate_metadata
files_read:
  - reports/production_candidate_authorization/2026-05-21_tennis_wallet_production_candidate_A5_activation_preflight.json
  - production/plans/accepted_product_still_life_tennis_wallet_001_production_candidate_001_plan.yaml
  - production/reviews/accepted_product_still_life_tennis_wallet_001_production_candidate_001_review.md
files_written:
  - docs/AMBER_02_PRODUCTION_CANDIDATE_RECEIPT_REPLAY.md
  - tests/schema_examples/autopilot_execution_receipt.amber_02_production_candidate_replay.example.json
  - .agent_board/AUTOPILOT_LEDGER.md
  - scripts/validate_autopilot_governance_kernel.js
```

## Boundary

```yaml
replayed_prior_action: true
historical_production_candidate_write_performed: true
new_production_candidate_created_now: false
production_candidate_metadata_written_now: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
dependency_change_performed: false
runtime_probe_performed: false
secret_value_read_performed: false
push_tag_release_deploy_performed: false
```

No Red Lane condition was triggered.

## Continuation Judge

```yaml
current_goal_clear: true
inside_envelope_budget: true
red_condition_seen: false
receipt_recorded: true
validation_path_clear: true
next_auto_step_allowed: true
stop_reason: none
```

The next step may continue with another local receipt replay or a bounded Amber
task only when its envelope is explicit and no Red condition appears.
