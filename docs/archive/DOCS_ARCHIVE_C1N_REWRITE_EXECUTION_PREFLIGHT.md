# Docs Archive C1n Rewrite Execution Preflight

Status: C1n rewrite execution preflight completed pass_with_warnings
Mode: A4.8 local docs-only rewrite preflight
Scope basis: `docs/archive/DOCS_ARCHIVE_C1K_DOCS_ONLY_REFERENCE_REWRITE_AUTHORIZATION_PACKAGE_DRY_RUN.md`
Baseline: `88567bd docs: record C1h-C1l archive route planning`

This preflight refreshes the C1k rewrite package against the current repository before C1o exact rewrite execution. It does not rewrite references, move files, create wrappers, stage, commit, push, tag, release, deploy, or authorize any A5 action.

## Boundary

This preflight did not:

- move docs
- delete files
- create wrappers
- rewrite references
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, MCP, or runtime
- read `.env`, `.env.local`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Refreshed Scan

| Check | Result |
| --- | ---: |
| branch / upstream | `master` / `origin/master` |
| ahead / behind before C1n | `0 / 0` |
| staged files before C1n | 0 |
| source docs allowlist | 29 |
| replacement rules | 65 |
| missing source docs | 0 |
| missing old target files | 0 |
| existing archive destinations | 0 |
| non-archive docs scanned | 788 |
| allowlist hit records | 98 |
| allowlist replacement hits | 100 |
| outside non-archive hit records | 3 |
| outside non-archive hit total | 9 |
| archive planning/audit hit total | 466 |

## Warning Classification

C1k expected 98 replacement hits. The current exact scan finds 100 hits inside the 29 allowed source docs. The extra count is still inside the exact source allowlist and exact replacement-rule set, so it is safe for C1o to replace all 100 current exact hits.

The 3 outside non-archive hit records are not additional source docs to rewrite. They are target-file self-references inside files already included in the 65 docs-only-reference move candidate set:

| File | Old path | Hits | Decision |
| --- | --- | ---: | --- |
| `docs/v7_184_static_review_console_mockup_planning_gate.md` | `docs/v7_184_static_review_console_mockup_planning_gate.md` | 3 | defer to C1q/C1r move cleanup |
| `docs/v7_185_core_independent_vcp_native_adr_gate.md` | `docs/v7_185_core_independent_vcp_native_adr_gate.md` | 3 | defer to C1q/C1r move cleanup |
| `docs/v7_186_static_review_console_mockup_alignment_gate.md` | `docs/v7_186_static_review_console_mockup_alignment_gate.md` | 3 | defer to C1q/C1r move cleanup |

These self-references remain in top-level docs until the physical move phase. They are not operational references, authority/navigation references, `.agent_board` references, script references, test references, validator references, or external runtime references.

## C1o Execution Guard

C1o may proceed only if:

- it modifies only the 29 C1k source docs plus explicit status/index surfaces
- it replaces only the 65 exact old path strings with their exact archive path strings
- it performs exactly the current 100 source-doc replacements unless the pre-execution scan changes
- it does not rewrite the 3 target self-reference files during C1o
- it does not move files, delete files, create wrappers, modify validators, stage, commit, push, tag, release, deploy, or run A5 actions

## Decision

C1n passes with warnings. The warnings are classified and bounded:

- actual source-doc replacement hits: 100
- target self-reference hits deferred to C1q/C1r: 9

Recommended next: execute C1o docs-only-reference exact rewrite under the narrowed guard above.
