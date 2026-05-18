# Docs Archive C1r Post-Move Reference Map

Status: C1r post-move reference map completed validated
Mode: A4.8 local docs-only post-move validation
Move record: `docs/archive/DOCS_ARCHIVE_C1Q_EXACT_MOVE_EXECUTION_RECORD.md`

This map verifies repository references after the 67-candidate exact-file physical move.

## Boundary

This validation did not:

- move additional files
- delete files
- create wrappers
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, MCP, or runtime
- read `.env`, `.env.local`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Post-Move Scan

| Check | Result |
| --- | ---: |
| exact move pairs checked | 67 |
| source paths still existing | 0 |
| destination files missing | 0 |
| total old-path hit records | 394 |
| total old-path hits | 508 |
| archive planning/audit hit records | 394 |
| archive planning/audit hits | 508 |
| operational hits in scripts/tests | 0 |
| authority/navigation hits | 0 |
| `.agent_board` hits | 0 |
| non-archive docs hits | 0 |
| production/other non-archive hits | 0 |

## Narrow Link Repair

Post-move scanning found 3 non-archive references to moved files. C1r repaired the 2 authority/navigation links and, after Jenn's narrow approval, the 1 production plan link:

| File | Old path | New archive path |
| --- | --- | --- |
| `MANIFEST.md` | `docs/251_v6_validator_quality_gate.md` | `docs/archive/numbered_legacy/251_v6_validator_quality_gate.md` |
| `RELEASE_NOTES.md` | `docs/251_v6_validator_quality_gate.md` | `docs/archive/numbered_legacy/251_v6_validator_quality_gate.md` |
| `production/plans/french_summer_rattan_bag_v3_production_candidate_001_plan.yaml` | `docs/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md` | `docs/archive/phases/v7/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md` |

## Decision

C1r validates that the 67-file move is complete and that docs/archive, authority/navigation, `.agent_board`, scripts/tests, non-archive docs, and the separately authorized production plan reference are clean. `scripts/validate_mvp.ps1` now includes an exact-file scope entry for the authorized production plan repair only, so C1s commit readiness audit may proceed.
