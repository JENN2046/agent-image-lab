# v0.6.16 Exact New-Trial Human Approval Intake Validator

base_contract: AGENTS.md
phase: v0_6_16_exact_new_trial_human_approval_intake_validator
mode: Green Lane approval-intake validator only
status: local approval intake validator completed; real generation still blocked

## Purpose

v0.6.16 turns the v0.6.15 human approval gate into a local intake validator. It
does not capture a new human decision. It defines how the next human response
must be classified before Agent Image Lab can either stay idle, continue
dry-run work, or prepare a separate one-real-generation execution step.

This phase does not submit a request, contact a provider, generate an image,
create an output directory, write a provider receipt, write a registry,
materialize a review bridge, write DailyNote/VCP memory, run runtime surfaces,
commit, or push.

authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
action_packet_id: exact_new_trial_action_packet_v0_1
noop_rehearsal_id: exact_new_trial_noop_rehearsal_v0_1
human_approval_packet_id: exact_new_trial_human_approval_packet_v0_1
approval_intake_validator_id: exact_new_trial_human_approval_intake_validator_v0_1
phase: v0_6_16_exact_new_trial_human_approval_intake_validator
source_noop_gate_ref: reports/visual_asset_eval_dry_run/v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate.json

## Intake Classification

Allowed human choices:

- keep_idle
- continue_dry_run
- authorize_one_real_generation

Current intake state:

- intake_mode: `approval_intake_validator_only`
- current_user_choice: `not_captured`
- human_response_captured_now: false
- authorization_phrase_captured: false
- human_approval_status: `pending`
- decision_result: `stay_idle`
- can_execute_now: false
- real_generation_authorized_now: false

## Choice Effects

- `keep_idle`: stays local and does not submit or execute anything.
- `continue_dry_run`: allows additional local dry-run or validator work only.
- `authorize_one_real_generation`: is valid only if a future human message
  exactly names the authorization package, prompt, output directory, receipt,
  registry, review bridge, provider route, one call, one candidate, zero retry,
  no overwrite, no secret read, no raw provider capture, no DailyNote/VCP memory
  write, no accepted-sample promotion, no production-candidate promotion, and no
  push/tag/release/deploy.

Even a valid future authorization phrase must be handled as a separate next
step. This validator never performs real generation.

## Required Authorization Phrase

The validator requires the future one-real-generation phrase to include all of
these exact tokens:

- `Jenn`
- `AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001`
- `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- `runs/real_generation/v0_3_3_exact_new_trial_001/`
- `reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json`
- `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001`
- `image_gen.imagegen`
- `exactly 1 call`
- `exactly 1 candidate`
- `0 retry`
- `no overwrite`
- `no secret read`
- `no raw provider payload or response capture`
- `no DailyNote or VCP memory write`
- `no accepted-sample promotion`
- `no production-candidate promotion`
- `no push/tag/release/deploy`

## Boundary

- metadata_only: true
- approval_intake_validator_only: true
- no_new_human_approval_captured: true
- no_new_trial_executed: true
- provider_call_performed: false
- image_generation_performed: false
- output_directory_created: false
- receipt_write_performed: false
- registry_write_performed: false
- review_console_bridge_materialized: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- runtime_call_performed: false
- secret_value_read_performed: false
- production_candidate_created: false
- accepted_sample_auto_promotion: false
- memory_seed_promoted: false
- package_dependency_change_performed: false
- commit_performed: false
- push_performed: false

## Recommended Next

If Jenn chooses `keep_idle`, wait. If Jenn chooses `continue_dry_run`, continue
local validation or dry-run review work. If Jenn issues the exact
`authorize_one_real_generation` phrase, create a separate execution preflight
record before any provider/image call.
