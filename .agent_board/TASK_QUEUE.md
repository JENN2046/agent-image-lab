# TASK_QUEUE.md — Agent Image Lab Sustained Autopilot

Persistent task queue for guarded local work.

This board does not authorize external reads, VCPToolBox/VCPChat changes, plugin calls, DailyNote writes, API calls, image creation, VCP memory writes, pushes, tags, releases, dependency changes, destructive commands, or writes outside the workspace root.

---

## Current Mission

```text
Complete v7.239 product image generation plan draft gate and route the next phase to paper-level scope match review.
```

---

## Current Mode

```text
A4.5 — Smart Local Autopilot under A4 — Sustained Local Autopilot boundaries
Single-Window 4-Agent Compact Autopilot
```

---

## Hard Stop Gates

Stop before:

- real VCPChat read without a concrete active authorization package and passing preflight
- real VCPToolBox read without a concrete active authorization package and passing preflight
- real manifest read without a concrete active authorization package and passing preflight
- config/env/log/secret read
- raw source copy from external repositories
- IPC / preload / renderer implementation in VCPChat
- executable Adapter implementation
- plugin/API/DailyNote call without a concrete active authorization package and passing preflight
- image file creation without a concrete active authorization package and passing preflight
- VCP memory write without a concrete active authorization package and passing preflight
- push / PR / merge / tag / release without a concrete active version-action package, standing authorization, and passing preflight
- dependency change without a concrete active dependency-change package and passing preflight
- write outside workspace root without a concrete active external-write package and passing preflight
- A5 production action without an active authorization package and passing preflight

```text
production actions remain blocked
active authorization package required for A5
```

---

## Queue

### in_progress

```text
none
```

### todo

```text
1. v7.240_product_image_generation_plan_authorization_match_review_gate.
```

### recommended_next_after_v7_239

```text
v7.240_product_image_generation_plan_authorization_match_review_gate — review the paper-level match between generation plan draft and authorization draft; active A5 execution remains blocked.
```

### done

```text
1. v7.187-v7.203 Smart Commander protocol track consolidated and made portable.
2. v7.205-v7.213 Static Review Console mockup track reached quality stop.
3. v7.214-v7.221 mainline/provider/release readiness reviews reached quality stop.
4. Validator Governance Chain v1: closed.
5. batch_005_allowed_now: false.
6. production_candidate_002_allowed_now: false.
7. memory_write_path_allowed_now: false.
8. .agent_board current-state calibration content updated.
9. git diff --check passed.
10. node scripts/validate_agent_board_state.js passed.
11. guarded push preflight passed.
12. board calibration pushed to origin/master.
13. v7.223 read-only value selection selected v7.224 as the only safe next task.
14. v7.224 README / roadmap / .agent_board freshness alignment passed git diff --check.
15. v7.224 agent_board_freshness passed node scripts/validate_agent_board_state.js.
16. v7.224 commit and guarded push completed.
17. v7.224a startup rule intake completed before edits.
18. v7.224a AGENTS / overlay / README autopilot / docs / .agent_board freshness diff inspected.
19. v7.224a git diff --check passed.
20. v7.224b read-only smoke test passed; no edits, commit, or push performed.
21. v7.225 balanced codex exec Worker/Verifier contract patch completed_validated.
22. v7.226 image workflow product return gate selected Prompt Package Builder as the next unique route.
23. v7.227 prompt package builder taskbook gate created the schema, reusable taskbook, human review handoff, A5 authorization handoff, and memory suitability handoff.
24. v7.228 product image prompt package template instance gate created the fillable non-executing instance template.
25. v7.229 prompt package human review checklist gate created review checklist, status taxonomy, approval requirements, and rejection reasons.
26. v7.230 prompt package A5 authorization handoff gate created the non-executing handoff template from approved package to future A5 authorization draft inputs.
27. v7.231 review console asset status taxonomy gate created future asset status taxonomy and review surface fields.
28. v7.232 memory suitability decision matrix gate created non-writing memory suitability decisions for future reviewed assets.
29. v7.233 delivery review surface package gate created a package that links prompt package, future A5 handoff, human review, asset status, and memory suitability.
30. v7.234 product image workflow runbook gate created an operator SOP for the package chain without execution.
31. v7.235 product image workflow static walkthrough gate created a synthetic matte ceramic coffee mug walkthrough without execution.
32. v7.236 product image workflow A5 readiness review gate confirmed readiness for a non-active A5 authorization draft, not active execution.
33. v7.237 product image generation authorization draft gate created a non-active draft with status=draft and approval_status=not_requested.
34. v7.238 product image generation authorization draft review gate confirmed the draft is safe-to-keep A4 paperwork, but not active A5-ready.
35. v7.239 product image generation plan draft gate created GP-DRAFT-20260512-001 as a non-executing plan draft.
```

### blocked

```text
1. A5 provider contact is blocked until explicit matching authorization.
2. Runtime integration is blocked until explicit matching authorization.
3. Tag/release is blocked until explicit matching authorization and preflight.
4. Repetitive A4 docs-only gates are blocked unless they create new product value.
5. A5/provider/runtime/plugin/image/memory remain blocked in v7.224.
6. v7.224a does not authorize A5/provider/runtime/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
7. v7.225 does not authorize A5/provider/runtime/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
8. v7.226 does not authorize A5/provider/runtime/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
9. v7.227 does not authorize A5/provider/runtime/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
10. v7.228 does not authorize A5/provider/runtime/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
11. v7.229 does not authorize A5/provider/runtime/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
12. v7.230 does not authorize A5 activation/provider/runtime/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
13. v7.231 does not authorize A5/provider/runtime/Review Console runtime/renderer/preload/IPC/plugin/image/memory/CDP/bridge/MCP/tag/release/deploy.
14. v7.232 does not authorize A5/provider/runtime/plugin/image/DailyNote/VCP memory/memory authorization activation/CDP/bridge/MCP/tag/release/deploy.
15. v7.233 does not authorize A5/provider/runtime/plugin/image/DailyNote/VCP memory/output save/Review Console runtime/CDP/bridge/MCP/tag/release/deploy.
16. v7.234 does not authorize A5/provider/runtime/plugin/image/DailyNote/VCP memory/output save/Review Console runtime/CDP/bridge/MCP/tag/release/deploy.
17. v7.235 does not authorize A5/provider/runtime/plugin/image/DailyNote/VCP memory/output save/Review Console runtime/CDP/bridge/MCP/tag/release/deploy.
18. v7.236 does not authorize active A5/provider/runtime/plugin/image/DailyNote/VCP memory/output save/Review Console runtime/real manifest read/CDP/bridge/MCP/tag/release/deploy.
19. v7.237 does not authorize active A5/provider/runtime/plugin/image/DailyNote/VCP memory/output save/Review Console runtime/real manifest read/real output path/raw payload/CDP/bridge/MCP/tag/release/deploy.
20. v7.238 does not authorize active A5/human approval request/provider/runtime/plugin/image/DailyNote/VCP memory/output save/Review Console runtime/real manifest read/real output path/raw payload/CDP/bridge/MCP/tag/release/deploy.
21. v7.239 does not authorize active A5/provider/model/plugin selection/provider contact/runtime/plugin/image/DailyNote/VCP memory/output save/Review Console runtime/real manifest read/real output path/raw payload/CDP/bridge/MCP/tag/release/deploy.
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
