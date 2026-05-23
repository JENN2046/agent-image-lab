# v0.6.9 Exact New-Trial Request Text Regenerated

base_contract: AGENTS.md
phase: v0_6_9_exact_new_trial_request_text_regenerated
status: local_request_text_regeneration_validator

## Purpose

This phase regenerates one exact request text from the resolved `v0.6.8`
candidate values.

It does not submit the request.
It does not grant A5.
It does not authorize provider contact, image generation, output-directory
creation, receipt writing, registry writing, memory writing, DailyNote writing,
runtime integration, or a real executor.

## Regeneration Header

```yaml
exact_new_trial_request_text_regenerated:
  authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
  phase: v0_6_9_exact_new_trial_request_text_regenerated
  authorization_status: draft_not_submitted
  approval_status: not_requested
  active: false
  execute_now: false
  submit_ready: false
  exact_request_text_regenerated: true
  request_text_regeneration_only: true
```

## Source Bindings

- `reports/visual_asset_eval_dry_run/v0_6_8_exact_new_trial_intake_field_resolution.json`
- `reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json`
- `reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json`

## Regenerated Exact Request Text

This is now a non-placeholder exact text.
It is still not a granted approval phrase because no human has issued it yet.

```text
批准进入 AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001 A5 preflight：使用 Codex 内置 image generation，命令 generate，provider_route=image_gen.imagegen，model=managed_by_codex_image_tool，prompt_package_ref=prompts/image_generation/safe_adult_editorial_portrait_v1.yaml，output_directory=runs/real_generation/v0_3_3_exact_new_trial_001/，receipt_path=reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json，registry_path=reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json，review_console_bridge_ref=review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001，max_provider_calls=1，max_image_candidates=1，retry_limit=0；仅运行 preflight，不调用 provider，不生成图片，不读取任何 env 密钥值，不写 DailyNote，不写 VCP memory，不 push/tag/release/deploy；审批人 Jenn。
```

## Regeneration Assertions

- `copyable_exact_request_text_present: true`
- `placeholders_remaining: false`
- `request_text_matches_v0_6_8_resolved_values: true`
- `exact_request_text_regenerated: true`
- `human_approval_phrase_received: false`
- `human_send_step_still_required: true`
- `request_not_submitted: true`
- `can_submit_now: false`
- `can_execute_now: false`

## Fixed Constraint Confirmation

- `provider_target: codex_builtin_image_generation`
- `plugin_id_or_provider_route: image_gen.imagegen`
- `model: managed_by_codex_image_tool`
- `command: generate`
- `exact_call_count: 1`
- `max_image_candidates: 1`
- `retry_limit: 0`
- `review_required_after_generation: true`
- `no_memory_write_default: true`
- `overwrite_existing_files_allowed: false`

## Explicit Non-Authorization

- `provider_call_performed: false`
- `image_generation_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `runtime_call_performed: false`
- `secret_value_read_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `package_dependency_change_performed: false`
- `commit_performed: false`
- `push_performed: false`

## Current Result

The route now has:

```text
ready_for_exact_new_trial_authorization
+ exact_new_trial_intake_field_resolution
+ exact_new_trial_request_text_regenerated
```

That means the request text is no longer placeholder-based, but it still remains
local-only until a human separately issues the phrase and later decides whether
to submit or execute anything.

## Recommended Next

Stop at the regenerated exact request text, or later ask for an explicit human
decision on whether to issue that text as the real approval phrase. Do not
submit or execute anything by default.
