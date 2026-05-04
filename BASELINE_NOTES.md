# Agent Image Lab v0.2 Baseline Notes

## Baseline label

`Agent Image Lab v0.2 MVP Skeleton + Review Console Static Prototype + Adapter Dry-Run Planning`

## Scope summary

This baseline is a documentation, schema, workflow, memory-policy, static-prototype, and dry-run integration planning snapshot.

It does not include:

- real VCP plugin execution code
- real image generation calls
- real API calls
- DailyNote writes
- image files
- secret values
- customer private data
- modifications to real VCPToolBox
- modifications to real VCPChat

## Completed phases

### Phase 1.5: policy and schema hardening

Completed:

- hardened `AGENTS.md` memory and sensitive-information rules
- clarified that sub Agents generate `memory_delta` drafts only
- clarified DailyNote / VCP long-term memory approval flow
- added `write_mode` and `approval_status` invariants
- turned memory review checklist into a real human review checklist
- clarified that Memory Router is a future abstraction, not an MVP component

### Phase 2: Review Console static prototype

Completed:

- added isolated browser-only static prototype under `review_console/static_prototype/`
- aligned Review Console schema fields with root `schemas/review_session.schema.yaml`
- documented human review overriding AI review
- documented memory preview and memory approval boundaries
- documented static prototype safety boundary: no API, no DailyNote, no VCP plugin, no file write, no image saving

### Phase 3: VCPChat integration design

Completed:

- added VCPChat integration design notes
- documented future Electron safety requirements
- kept the work at design/spec level only
- did not modify real VCPChat
- did not implement IPC handlers

### Phase 4: MVP-B / Adapter dry-run integration planning

Completed:

- strengthened VCP task envelope and dispatch plan dry-run constraints
- documented Adapter preflight and refusal flow
- kept plugin capability matrix as placeholder / pending test only
- kept `selected_plugin=null`
- kept `max_plugin_calls=0`
- kept execution blocked and external API disabled
- did not create executable Adapter logic

### Phase 5: full read-only validation

Result:

- overall conclusion: conditional pass
- no P0 issue found
- no P1 issue found
- P2 notes remain: uncommitted changes, static prototype untracked, LF/CRLF warnings, placeholder image-extension references in text only

## Commit candidate scope

Tracked modified files currently expected in the baseline candidate:

- `AGENTS.md`
- `docs/11_review_console_design.md`
- `docs/12_mvp_acceptance.md`
- `integrations/vcp/vcp_adapter_plugin_plan.md`
- `integrations/vcp/vcp_dispatch_plan.schema.yaml`
- `integrations/vcp/vcp_plugin_capability_matrix.md`
- `integrations/vcp/vcp_task_envelope.schema.yaml`
- `integrations/vcp/vcp_tool_request_examples.md`
- `memory_policy/memory_architecture.md`
- `memory_policy/memory_delta.schema.yaml`
- `memory_policy/memory_review_checklist.md`
- `memory_policy/write_permissions.md`
- `review_console/review_console_product_spec.md`
- `review_console/review_session.schema.yaml`
- `review_console/vcpchat_integration_notes.md`
- `schemas/dispatch_plan.schema.yaml`
- `schemas/image_case.schema.yaml`
- `schemas/memory_delta.schema.yaml`
- `schemas/review_session.schema.yaml`
- `tests/validation_checklist.md`

Untracked files expected to be included only after explicit commit authorization:

- `review_console/static_prototype/FIELD_MAPPING.md`
- `review_console/static_prototype/README.md`
- `review_console/static_prototype/app.js`
- `review_console/static_prototype/index.html`
- `review_console/static_prototype/mock_data.js`
- `review_console/static_prototype/styles.css`
- `BASELINE_NOTES.md`

## Baseline safety gates

Before commit, tag, or package, re-run the current validation gates:

- `node --check review_console\static_prototype\app.js`
- `node --check review_console\static_prototype\mock_data.js`
- `git diff --check`
- scan for secret-like text
- scan for runtime calls such as `fetch(`, `XMLHttpRequest`, `writeFile`, `fs.`, `DailyNote`, and `call_plugin`
- scan for real image files
- confirm no nested `agent-image-lab/` directory exists
- confirm no real VCPToolBox or VCPChat path was modified

## Not yet authorized

The following actions are not performed by this baseline note:

- staging files
- creating commits
- creating tags
- creating zip archives
- modifying external repositories
- invoking any VCP plugin
- invoking any API
- writing DailyNote
- selecting a real image-generation plugin
- implementing MVP-B execution mode

## Next authorization point

Recommended next step:

1. review this baseline note
2. authorize a commit candidate review
3. if accepted, authorize staging and commit
4. after commit, authorize tag and packaging plan separately
