# v0.6.6 Exact New-Trial A5 Request Draft

base_contract: AGENTS.md
phase: v0_6_6_exact_new_trial_a5_request_draft
status: local_inactive_request_draft_validator

## Purpose

This draft closes the Batch B no-new-A5 branch by turning
`future_exact_approval_phrase_required=true` into one concrete, copyable,
non-executable request text.

It does not request A5 by itself.
It does not grant A5.
It does not authorize provider contact, image generation, output-directory
creation, receipt writing, registry writing, memory writing, DailyNote writing,
runtime integration, or a real executor.

## Draft Header

```yaml
exact_new_trial_a5_request_draft:
  authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
  phase: v0_6_6_exact_new_trial_a5_request_draft
  authorization_status: draft_not_submitted
  approval_status: not_requested
  active: false
  execute_now: false
  exact_approval_phrase_received: false
```

## Carried-Forward Fixed Limits

- `provider_target: codex_builtin_image_generation`
- `plugin_id_or_provider_route: image_gen.imagegen`
- `model: managed_by_codex_image_tool`
- `command: generate`
- `max_provider_calls: 1`
- `max_image_candidates: 1`
- `retry_limit: 0`
- `no_memory_write_default: true`
- `overwrite_existing_files_allowed: false`

## Unresolved Exact Fields

The next real request still must fill these exact values instead of silently
reusing the old failed route:

- `exact_new_prompt_package_or_override_statement_required: true`
- `exact_new_output_directory_required: true`
- `exact_new_receipt_path_required: true`
- `exact_new_registry_path_required: true`
- `exact_new_review_console_bridge_ref_required: true`

## Recommended Exact Approval Phrase Draft

This is a draft only.
It keeps placeholders on purpose.
It is not executable until every placeholder is replaced and a human separately
issues the exact approval phrase.

```text
批准进入 AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001 A5 preflight：使用 Codex 内置 image generation，命令 generate，provider_route=image_gen.imagegen，model=managed_by_codex_image_tool，prompt_package_ref=<new_prompt_package_ref_under_prompts_image_generation_or_exact_override_statement>，output_directory=<new_output_directory_under_runs_real_generation>，receipt_path=<new_receipt_path_under_reports_provider_receipts>，registry_path=<new_registry_path_or_existing_registry_refresh_plan_ref>，review_console_bridge_ref=<new_review_console_bridge_ref>，max_provider_calls=1，max_image_candidates=1，retry_limit=0；仅运行 preflight，不调用 provider，不生成图片，不读取任何 env 密钥值，不写 DailyNote，不写 VCP memory，不 push/tag/release/deploy；审批人 Jenn。
```

## Draft Guardrails

- `recommended_exact_approval_phrase_present: true`
- `draft_uses_placeholders_only: true`
- `draft_not_executable_until_placeholders_replaced: true`
- `reuse_original_prompt_by_default: false`
- `reuse_retry_001_prompt_by_default: false`
- `ready_for_exact_new_trial_authorization: true`
- `can_execute_now: false`

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

The month route now has both:

```text
ready_for_exact_new_trial_authorization checkpoint
+ one concrete future exact A5 request draft
```

That means the no-new-A5 branch is fully evidenced without reopening execution.

## Recommended Next

If no explicit new A5 authorization is granted, stop at
`ready_for_exact_new_trial_authorization`.

If the owner later wants one new minimal real trial, replace every placeholder
in the draft, issue a separate exact human approval phrase, run preflight only,
and stop again before any real provider call.
