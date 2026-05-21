# Agent Image Lab Sustained Autopilot Rails

Version: v0.1-refactor
Source reviewed: `universal_sustained_autopilot_pack_v1_1.zip`
Target project: `agent-image-lab`

This pack refactors the universal sustained autopilot rails into an Agent Image Lab-specific operating rail.

Active startup model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope.

Every future Codex session should begin with the v3 intake: Goal Compiler,
Truth Model, Green / Amber / Red Lane Classifier, Autonomy Envelope, Receipt,
and Red Lane hard stops. A4.8 is retained only as the legacy local-safe rail and
Green Lane substrate.

It is intentionally conservative:

```text
Continue local docs/schema/review-console work while safe.
Stop before external reads, real plugin execution, DailyNote writes, VCPToolBox/VCPChat modifications, tags, pushes, releases, or dependency changes.
```

## Why this is not a direct copy

The upstream universal pack is generic. Agent Image Lab has sharper boundaries:

- no-execution baselines matter
- VCPToolBox and VCPChat must not be modified without explicit authorization
- real VCPChat/VCPToolBox reads require separate authorization
- DailyNote content must be Chinese
- sub-agents must produce `memory_delta`
- Review Console is a controlled gate, not a full DAM
- Adapter recon must remain dry-run / authorization-first

Therefore this pack should be installed as an overlay, not blindly copied over existing project files.

## Recommended install

Copy these files into the root of `agent-image-lab` only after review:

```text
.agent_board/
scripts/validate-agent-image-lab-local.ps1
scripts/validate-agent-image-lab-local.sh
codex/AGENT_IMAGE_LAB_AUTOPILOT_PROMPT.md
AGENTS.autopilot-overlay.md
```

Do **not** overwrite the existing root `AGENTS.md` automatically. Instead, review `AGENTS.autopilot-overlay.md` and merge the useful parts into the project `AGENTS.md` if needed.

## Recommended Codex opening prompt

Use:

```text
请读取 AGENTS.md、AGENTS.autopilot-overlay.md、.agent_board/HANDOFF.md、.agent_board/RUN_STATE.md、.agent_board/TASK_QUEUE.md 和 .agent_board/CHECKPOINT.md。
使用 Agent Image Lab Smart Standing Authorization v3 — Budgeted Autonomy Envelope。
先只做 repo reality 检查和 Autopilot Rule Intake，不修改文件。
请复述 active_autonomy_model、a4_8_role、a5_status、goal_compiler_available、receipt_required_for_meaningful_Amber、hard stops、exact-file staging / no git add .、以及本任务是否需要更新 .agent_board resume surfaces。
如果没有 hard stop，再执行 .agent_board/TASK_QUEUE.md 中的第一个安全本地任务。
```

## Current principle

```text
Let Codex move through v3 Green and budgeted Amber work.
Do not let Codex cross Red Lane gates by implication.
```
