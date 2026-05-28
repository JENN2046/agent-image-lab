# Top-Level Directory Ownership

Status: active top-level ownership map
Role: operating_standard
Authority: `docs/PROJECT_STRUCTURE.md`
Mode: Green Lane structure governance

This map explains what owns each current top-level directory and how future
agents should treat it. It is an index for navigation and planning only.

It does not authorize physical moves, deletion, runtime execution, provider contact,
plugin calls, API calls, image generation, memory writes, production
promotion, dependency changes, commit, push, tag, release, deploy, or
destructive filesystem actions.

## Operating Rule

Keep the repository organized around the visual production line:

```text
prompt and strategy
-> VCP / provider boundary
-> generation or retry evidence
-> Review Console review
-> accepted or failure archive
-> memory policy and memory candidates
-> future recall
```

Do not create broad generic buckets when an existing production-line owner can
hold the file. Do not move a top-level directory without a separate movement
plan, exact source and target paths, reference scan, validation path, and
rollback plan.

## Ownership Table

| Directory | Owner / domain | Current role | Portability | Top-level decision | Next safe action |
| --- | --- | --- | --- | --- | --- |
| `.agent_board/` | Agent operations | Current task rail, handoff, checkpoint, blockers, validation log | Git-portable status surface | Keep top-level | Compact only through a separate compaction plan. |
| `.agent_private/` | Local private workspace | Private local notes or scratch state | Local-only | Keep local-only | Never use as tracked project evidence. |
| `.claude/` | Local tool profile | Tool-specific local state | Local-only | Keep local-only | Do not treat as project authority. |
| `.omc/` | Local tool profile | Tool-specific local state | Local-only | Keep local-only | Do not treat as project authority. |
| `accepted_samples/` | Accepted sample registry | Registry and category indexes for accepted samples | Git-portable | Keep top-level compatibility surface | Keep aligned with `asset_archive/accepted_samples/`. |
| `adapter_dry_run_lab/` | Adapter dry-run lab | Local dry-run exploration and adapter evidence | Mixed; verify before relying on it | Review later | Add or verify README before any movement. |
| `adapters/` | Adapter layer | Adapter contracts, mock bridges, read-only bridge material | Git-portable when committed | Keep top-level for now | Clarify relation to `integrations/` before merging. |
| `agents/` | Agent definitions | Agent role prompts and project agent specs | Git-portable | Keep top-level | Add README if role inventory grows. |
| `asset_archive/` | Asset evidence archive | Git-portable accepted and failure evidence capsules | Git-portable evidence | Keep top-level | Prefer `asset_archive/accepted_samples/<sample_id>/` for new accepted evidence. |
| `asset_index/` | Asset index policy | Asset index policy and schema-facing records | Git-portable | Keep top-level for now | Keep policy aligned with archive validators. |
| `assets/` | Static assets | General static assets not covered by evidence archive | Mixed | Review later | Classify before adding product evidence here. |
| `briefs/` | Product brief layer | Product and shot brief inputs | Git-portable | Keep top-level | Keep distinct from prompt package instances. |
| `case_studies/` | Learning examples | Case study records and examples | Git-portable | Keep top-level for now | Consider linking from memory/style docs. |
| `codex/` | Codex working instructions | Codex task prompts and project operation notes | Git-portable | Keep top-level for now | Keep separate from global `AGENTS.md`. |
| `configs/` | Configuration examples | Local config examples and placeholders | Mixed; secret-sensitive | Keep top-level | Keep real secrets out; prefer sanitized examples. |
| `docs/` | Project documentation | Current authority, architecture, gates, roadmap, historical records | Git-portable | Keep top-level | Continue moving historical records toward `docs/archive/` through manifests. |
| `docs_registry/` | Documentation registry | Generated or dry-run doc registry evidence | Git-portable when tracked | Keep top-level for now | Keep generated evidence discoverable. |
| `exports/` | Export packages | Exported artifacts for external targets such as VCPToolBox | Mixed | Keep top-level for now | Verify target and sensitivity before using as evidence. |
| `failure_samples/` | Failure learning registry | Failure taxonomy and registry | Git-portable | Keep top-level | Keep aligned with `asset_archive/failure_samples/`. |
| `integrations/` | External integration contracts | VCP planning, dry-run contracts, authorization records | Git-portable planning | Keep top-level | Keep real external writes behind authorization gates. |
| `kernel/` | Orchestration kernel | Runtime or orchestration kernel material | Git-portable code or design | Keep top-level for now | Preserve runtime/A5 boundaries. |
| `memory_policy/` | Memory governance | Memory rules, DailyNote/VCP memory policy, recall rules | Git-portable | Keep top-level | Keep separate from production candidates and real memory writes. |
| `node_modules/` | Local dependency cache | Installed dependencies | Local-only | Keep untracked/local | Do not use as source authority. |
| `plugin_calls/` | Plugin call evidence | Plugin-call records or drafts | Potentially sensitive/mixed | Review later | Confirm redaction and side-effect boundary before treating as evidence. |
| `plugins/` | Plugin definitions or local plugin material | Plugin-related project material | Mixed | Review later | Clarify relationship to `integrations/` and external plugin systems. |
| `production/` | Production candidates | Production-candidate paperwork and memory-write candidates | Git-portable planning/evidence | Keep top-level | Does not authorize production promotion or writes. |
| `prompt_templates/` | Reusable prompt templates | Prompt package templates and checklists | Git-portable | Keep top-level | Keep templates separate from concrete prompt instances. |
| `prompts/` | Prompt instances | Concrete prompt packages and prompt sets | Git-portable | Keep top-level | Keep tied to briefs, review, and archive evidence. |
| `prototypes/` | Prototype experiments | General prototypes outside the current Review Console owner | Mixed | Review later | Prefer `review_console/` for active Review Console surfaces. |
| `release_automation/` | Release automation planning | Release helper records or automation material | Mixed; remote-sensitive | Keep top-level for now | No release, tag, deploy, or push without explicit authorization. |
| `reports/` | Evidence reports | Validation, memory, receipt, or analysis reports | Git-portable when redacted | Keep top-level | Keep raw private data and secrets out. |
| `review_console/` | Review product surface | Static prototype, runtime prototype, embed contracts | Git-portable design/prototype | Keep top-level | Treat as core product surface. |
| `reviews/` | Human or static reviews | Review records outside Review Console implementation | Git-portable when redacted | Keep top-level for now | Clarify relation to Review Console and reports if it grows. |
| `runs/` | Runtime outputs | Local runtime outputs and generated run material | Local-only by default | Keep local-only | Do not use as long-term evidence without tracked manifest. |
| `schemas/` | Schema definitions | Reusable JSON/YAML schemas | Git-portable | Keep top-level | Keep fixtures and validators aligned. |
| `scripts/` | Local automation and validators | Validators, suites, helpers, blocked runners | Git-portable code | Keep top-level | New validators default to `scripts/validators/<domain_or_version>/`. |
| `stability_tests/` | Stability evidence | Long-run or stability-focused tests and review notes | Git-portable when tracked | Keep top-level for now | Add README if expanded. |
| `style_memory_seed/` | Style memory seed | Reusable style and plugin behavior notes | Git-portable | Keep top-level | Keep separate from real memory writes. |
| `task_panel/` | Task panel surface | Task panel UI or interaction material | Git-portable when tracked | Review later | Clarify relation to `review_console/runtime_prototype/`. |
| `tests/` | Test fixtures | Schema examples and validation fixtures | Git-portable | Keep top-level | Do not relocate fixtures without reference map. |
| `tools/` | Local helper tools | Developer/project helper tools | Git-portable or local depending on tool | Keep top-level | Tools must not bypass safety gates. |
| `workflows/` | Operating workflows | Human/agent process docs and runbooks | Git-portable | Keep top-level | Keep workflows tied to the visual production line. |

## Current Gaps

- `adapter_dry_run_lab/`, `assets/`, `plugin_calls/`, `plugins/`,
  `prototypes/`, `reviews/`, and `task_panel/` need future classification
  before any merge or movement.
- `docs/` still mixes current authority and historical phase records. Continue
  archive movement only through manifest-backed slices.
- `scripts/validate_*.js` remains a heavy compatibility surface. Continue
  moving one validator family at a time with root wrappers and reference maps.
- Local-only directories must not become evidence of product readiness unless a
  tracked manifest and validator bind the exact artifacts.
