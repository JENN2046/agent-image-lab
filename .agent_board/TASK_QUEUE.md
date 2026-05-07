# TASK_QUEUE.md — Agent Image Lab Sustained Autopilot

Persistent task queue for guarded local work.

This board does not authorize external reads, VCPToolBox/VCPChat changes, plugin calls, DailyNote writes, API calls, pushes, tags, releases, dependency changes, destructive commands, or writes outside the workspace root.

---

## Current Mission

```text
Maintain and advance Agent Image Lab as a VCP-native visual production orchestration project while preserving no-execution / no-external-read gates until explicit user authorization is given.
```

---

## Current Mode

```text
A4.5 — Smart Local Autopilot under A4 — Sustained Local Autopilot boundaries
```

---

## Hard Stop Gates

Stop before:

- real VCPChat read
- real VCPToolBox read
- real manifest read
- config/env/log/secret read
- raw source copy from external repos
- IPC / preload / renderer implementation in VCPChat
- executable Adapter implementation
- plugin/API/DailyNote call
- image file creation
- VCP memory write
- push / PR / merge / tag / release
- dependency change
- write outside workspace root
- A5 — Autonomous Production Execution without an active explicit authorization package

---

## Queue

### in_progress

```text
none
```

### todo

```text
1. Keep Adapter and Review Console work in no-execution / no-external-read mode unless an active A5 authorization package exists and preflight passes.
2. If user authorizes remote or release movement, request exact target and run preflight before any push/tag/release.
3. Stop before any real DoubaoGen/config read, provider-side echo, sanitized request capture, additional generation retry, DailyNote, VCP memory/image, push/tag/release until user explicitly authorizes real generation parameters, memory action, or version action.
4. Update CHECKPOINT.md, RUN_STATE.md, VALIDATION_LOG.md, and HANDOFF.md after each meaningful batch.
5. If the user wants deeper diagnosis, activate the v10.12 provider-side prompt fingerprint capture package only after explicit approval, or switch to alternate plugin/strategy planning.
6. If the user wants to reuse a short approval flow, present a new current capsule first; bare `批准` only applies when Codex has just presented that exact capsule.
7. After Batch 8A validation passes, stop before staging/commit/tag/push/PR until explicit version-action authorization is given.
```

### done

```text
1. Installed Agent Image Lab autopilot overlay files without overwriting existing project files.
2. Adjusted overlay local validation helpers to skip only known historical true-call execution records.
3. Added v4.0-v4.2 local runtime validation hardening.
4. Synchronized agent board files to current repository reality.
5. Added agent board state validation harness and integrated it into the local validation set.
6. Added local checkpoint readiness manifest validation for the v4.0-v4.5 local batch.
7. Added local commit scope manifest validation for the v4.0-v4.6 changed-file allowlist.
8. Recorded v4.6 pushed baseline and reconciled post-push state for the v4.7 local batch.
9. Added v4 index consistency validation for v4.0-v4.8 docs, schemas, scripts, and board indexes.
10. Recorded local v4.8 commit/tag readiness and push-pending state for v4.9.
11. Merged PR #1 and synced local master to origin/master before opening v5.0.
12. Completed v5.0 post-merge delivery readiness validation.
13. Completed v5.1 runtime delivery surface validation.
14. Completed v5.2 adapter delivery surface validation.
15. Completed v5.3 Review Console Adapter handoff validation.
16. Completed v5.4 local sync readiness preflight.
17. Completed v5.5 post-commit reconciliation checkpoint.
18. Completed v5.6 v5 index consistency validation.
19. Completed v5.7 local batch commit-readiness preflight.
20. Completed v5.8 handoff freshness validation.
21. Completed v5.9 expanded v5 index consistency validation.
22. Completed v5.10 local true-loop candidate delivery closeout.
23. Completed v5.11 post-merge reconciliation.
24. Completed v5.12 release candidate readiness.
25. Defined local A4 default autonomy in AGENTS.md.
26. Defined A5 Autonomous Production Execution as production-only mode gated by an active authorization package.
27. Completed v7.40 local A4/A5 autonomy mode alignment.
28. Updated MVP validation routing so full local validation passes at v7.40.
29. Completed v7.41 external remote-debug verification script creation record without creating the real script.
30. Completed v7.42 external remote-debug verification script creation authorization package template without activating approval.
31. Completed v7.43 remote-debug smoke script creation without running it.
32. Completed v7.44 remote-debug smoke script run and VCPChat launch without CDP or bridge access.
33. Completed v7.45 CDP read-only attempt; no available CDP endpoint, so Runtime.evaluate was not performed.
34. Completed v7.46 remote-debug relaunch and CDP Runtime.evaluate read-only surface verification; bridge methods were not called.
35. Recorded v10.0 A5 end-to-end activation package readiness and stopped at preflight because external target worktrees were not clean.
36. Recorded v10.1 A5 resume-after-clean package after the user reported external target worktrees clean; A5 preflight rerun is required before production execution.
37. Recorded v10.2 A5 clean preflight and bridge smoke block; imageLabReview was missing, bridge_calls_observed stayed 0, and the remote-debug runtime was closed after the failed smoke.
38. Recorded v10.3 VCPChat no-write bridge integration smoke; strict allowlist calls observed=3 and DoubaoGen continuation remains blocked pending human review.
39. Recorded v10.4 DoubaoGen single generation; actual plugin calls observed: 1, generated asset status: rejected, and memory writes blocked by asset review.
40. Recorded v10.5 DoubaoGen no-text retry; actual plugin calls observed in v10.5: 1, generated asset status in v10.5: rejected, and person/text/logo risks detected.
41. Recorded v10.6 prompt failure analysis; v10.5 prompt design failure acknowledged, safer positive-only strategy recorded, and no real generation in v10.6.
42. Recorded v10.7 A5 safer prompt review package; prompt risky terms absent, real generation still blocked, and user prompt approval required.
43. Recorded v10.8 positive still-life generation preflight gate; prompt locked for future authorization, real generation still blocked, and separate generation authorization required.
44. Calibrated post-v10.8 local state on master and drafted the inactive positive still-life real generation authorization package for future human review.
45. Added v10.8 short approval template and ignored private PluginDir binding pattern; no real path, secret, plugin call, API call, image, or memory write was performed.
46. Recorded v10.9 positive still-life generation; actual plugin calls observed in v10.9: 1, generated asset status in v10.9: rejected, and person/face and prompt mismatch detected.
47. Recorded v10.10 prompt handoff diagnostic preflight; max plugin calls allowed in v10.10: 0, no generation in v10.10, and diagnostic authorization still inactive.
48. Recorded v10.11 prompt handoff diagnostic result; prompt hash matches expected, actual plugin calls observed in v10.11: 0, and provider-side request remains unobserved.
49. Recorded v10.12 A5 provider-side prompt fingerprint capture authorization package; v10.12 local: provider-side prompt fingerprint capture authorization package ready, authorization status: inactive package, execution authorized by v10.12: false, and provider-side capture not performed.
50. Executed v10.12 provider-side prompt fingerprint capture activation once; sanitized request capture performed, provider echo unsupported, local payload prompt hash matched expected, outbound request prompt hash did not match expected, provider observed prompt hash remains unobserved, network was blocked before send, and no image/API/raw sensitive recording occurred.
51. Executed v10.13 real generation full validation once; actual plugin calls: 1, generated asset count: 1, asset status: rejected, prompt_subject_match: false, person_or_face_detected: true, readable_text_or_logo_detected: false, and memory writes remained blocked.
52. Executed v10.14 DoubaoGen 5.0 model lock diagnostic; current request model matched doubao-seedream-5-0-260128, default PowerShell stdin corrupted the Chinese prompt hash, UTF-8 no BOM stdin matched the locked prompt hash, network was blocked before send, and no image/API/raw sensitive recording occurred.
53. Patched v10.15 runner UTF-8 no BOM transport; both local real-execution runners now set StandardInputEncoding to UTF8Encoding(false), the validator was added, and no plugin/API/image/DailyNote/VCP memory action occurred.
54. Completed v10.16 no-generation request preflight; local dummy receiver confirmed three stable patched-transport payload writes with matching model and locked prompt hashes, no BOM, no real DoubaoGen/config read, and no plugin/API/image/DailyNote/VCP memory action.
55. Consumed v10.17 patched runner single real generation authorization, but the runner failed before plugin start because Windows PowerShell 5.1 lacks ProcessStartInfo.StandardInputEncoding; actual plugin calls: 0, image created: false, retry performed: false.
56. Completed v10.18 compatible runner byte-write transport patch; runners now write UTF-8 no BOM bytes to StandardInput.BaseStream, validator updated, and a 3-iteration dummy preflight passed without plugin/API/image/DailyNote/VCP memory action.
57. Executed v10.19 compatible byte-write runner two real generations; actual plugin calls total: 2, generated images: 2, run_1 asset_status=accepted_candidate, run_2 asset_status=needs_human_review, and DailyNote/VCP memory writes remained false.
58. Completed v10.20 plugin reported model recording patch; future DoubaoGen summaries record sanitized plugin_reported_model_ref, model sha256 fields, and requested/reported match boolean without plugin/API/image/DailyNote/VCP memory action.
59. Completed v10.21 local asset selection review; recommended v10.19 run_1 as accepted_candidate, kept run_2 as needs_human_review, and performed no plugin/API/image/DailyNote/VCP memory action.
60. Completed v10.22 local memory_delta draft for v10.19 run_1 accepted_candidate; draft remains approval_status=pending and should_write_to_vcp=false, with no plugin/API/image/DailyNote/VCP memory action.
61. Completed v10.23 local human review package for the v10.22 memory_delta draft; package includes sanitized summary, checklist, and approval decision template, with no plugin/API/image/DailyNote/VCP memory action.
62. Completed v10.24 approve_memory_write no-write preflight package; approved request and confirmed candidate were recorded, while daily_note_write_authorized=false and actual_write_performed=false remain enforced.
63. Completed v10.25 single real DailyNote/VCP memory write using DailyNoteWrite; actual_write_calls=1, plugin_status=success, saved file existence verified by sanitized read-only check, no retry or second write.
64. Completed v10.26 real DailyNote/VCP memory write closeout records, indexes, validator routing, and local validation; no additional write or version action was performed.
65. Completed v10.27 DailyNoteWrite root path correction; KNOWLEDGEBASE_ROOT_PATH now classifies as vcp_root_dailynote and no-write recomputation passed.
66. Completed v10.28 DailyNote canonical location guard; plugin_success_sufficient=false and canonical_target_hash_match_required=true, with local validation passed.
67. Completed Runtime Review Console batch preauthorization review; candidate_review_state / preauthorization_status, batch_decision_draft, a5_preauthorization_review_package_draft, and authorizable / blocked / next-attention shortcuts validated locally.
68. Completed Runtime Review Console session continuity and quality control; guarded export/import, batch selection/actions, risk tags, risk-grouped preauthorization, and Chinese inspection checklist validated locally.
69. Completed Runtime Review Console usability controls; queue search/sort, undo history, session fingerprint, import preview, status glossary, compact queue cards, and stronger side-surface guards validated locally.
70. Completed branch sync validator compatibility; codex/runtime-review-followup is now accepted by local commit scope and MVP validation, and the current board state tracks the new follow-up branch.
71. Completed Runtime Review Console follow-up requirements audit; P0 delivery package draft and memory completion state split are now defined as next local implementation targets.
72. Completed Runtime Review Console Batch 2A/2C local draft surfaces; accepted_candidate_delivery_package_draft and human_override_traceability_draft are now rendered, exported, guarded, and smoke-validated without real execution.
73. Completed Runtime Review Console Batch 2B memory completion state split; memory_delta_draft now carries a separate memory_completion_state_draft, and the runtime prototype / guard / smoke / delivery surface validations passed locally.
74. Completed Runtime Review long task delivery plan; Batch 3A through Batch 8A are documented with A4 local scope, A5/real-write/remote authorization gates, validation matrix, and stop conditions.
75. Completed Runtime Review Batch 3A/3B/3C local stabilization; inactive_authorization_capsules_draft, runtime_review_state_draft, and local_commit_scope_plan_draft are rendered, exported, guarded, and runtime-validated locally.
76. Completed Runtime Review Batch 4A bridge mock roundtrip candidate; bridge_mock_roundtrip_candidate_draft records project-local loadSession / previewDraft mock flow with submitDraft=0 and no real CDP/bridge/plugin/API/memory/image actions.
77. Completed Runtime Review Batch 4B/5A/6A local readiness; real_bridge_authorization_package_draft, plugin_reliability_prompt_discipline_draft, and memory_write_completion_candidate_draft are rendered, exported, guarded, and ready for local validation.
78. Completed Runtime Review Batch 5B/6B/7A local gate/archive readiness; single_real_generation_retry_gate_draft, real_memory_write_authorization_package_draft, and asset_archive_candidate_draft are rendered, exported, guarded, and validated locally.
79. Completed Runtime Review Batch 8A local release-candidate proposal; proposed commit scope now covers the Runtime Review follow-up accumulated runtime prototype, validators, docs/indexes, validation checklist, and agent-board files. Local validation passed, and version actions remain unauthorized.
```

### blocked

```text
1. Additional real DoubaoGen/config read, provider-side echo, sanitized request capture, plugin/API/DailyNote/VCP memory/image actions, generation retry, second DailyNote/VCP memory write, push/tag/release, and A5 production execution remain blocked until a new explicit authorization is provided. v10.25 consumed the single real write authorization.
```

### skipped

```text
none
```

---

## Task Template

```text
- [ ] ID:
      Title:
      Reason:
      Scope:
      Allowed files:
      Forbidden files/actions:
      Validation:
      Stop condition:
```

## Done Template

```text
- [x] ID:
      Title:
      Changed files:
      Validation:
      Result:
```
