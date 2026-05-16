# PVOS Kernel

The PVOS kernel is the smallest local runnable core for Agent Image Lab's
Personal Visual Operating System direction.

It is deliberately narrow:

```text
repository-local fixture in
structured pvos_kernel_run JSON draft to stdout
no output file write
no provider contact
no plugin call
no API call
no DailyNote write
no VCP memory write
no image generation
no real manifest read
no VCPChat or VCPToolBox source read
```

## Usage

```powershell
node kernel\pvos_kernel.js --input tests\schema_examples\pvos_kernel_input.example.json
```

The CLI only accepts repository-relative input paths under
`tests/schema_examples/`. It emits a draft run manifest that links the local
domain models:

```text
ShotPlan
Shot
PromptLineage
ImageCandidate
ReviewRubric
VisualEvalDecision
FailureTaxonomy
AcceptedSample
RejectedSample
ReviewReport
ProvenanceRecord
EvalSeed
RunManifest
```

## Validation

```powershell
node --check kernel\pvos_kernel.js
node --check scripts\validate_pvos_kernel_minimal.js
node scripts\validate_pvos_kernel_minimal.js
node --check scripts\validate_pvos_kernel_dry_run_adapter.js
node scripts\validate_pvos_kernel_dry_run_adapter.js
```

This kernel is not a VCP runtime adapter. It is the local data spine that a
future adapter or review console binding can call after a separate gate defines
that integration boundary.

## Dry-Run Adapter Contract

```powershell
node adapters\pvos_kernel_dry_run_adapter.js --input tests\schema_examples\pvos_kernel_input.example.json
node adapters\pvos_kernel_dry_run_adapter.js --protocol-input tests\schema_examples\review_result_protocol_input.example.json
```

The adapter contract wraps the kernel output in local VCP adapter and Review
Console handoff drafts. It also attaches the local review-result protocol
report so a future Review Console can read pass/reject reasons, memory routes,
and production routes directly. It is still stdout-only and no-execution.

The adapter also binds the local review decision package into its handoff
surface. Future consumers can read accepted/rejected sample drafts, memory
delta drafts, memory-forbidden records, and production exclusion registers
without writing accepted samples, memory, provider outputs, or production
candidates.

The adapter negative guard fixture is pinned in
`tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json`.
It must match adapter CLI output exactly and its embedded
`evidence_blocker_contract` must match
`tests/schema_examples/evidence_blocker_contract_negative_guard.example.json`.

## Review Result Protocol

```powershell
node kernel\review_result_protocol.js --input tests\schema_examples\review_result_protocol_input.example.json
```

The review-result protocol turns the local kernel run into a hard per-candidate
decision report. Every candidate receives explicit pass or reject reasons, a
memory route, and a production route. A protocol pass is not production
approval; production remains blocked until human review and a separate
promotion gate. Rejected candidates with mapped failure tags are marked
`never_production`.

```powershell
node --check kernel\review_result_protocol.js
node --check scripts\validate_review_result_protocol.js
node scripts\validate_review_result_protocol.js
```

## Review Decision Package

```powershell
node kernel\review_decision_package.js --input tests\schema_examples\review_result_protocol_input.example.json
```

The review decision package wraps the hard review-result protocol into the
next local production-kernel layer:

```text
candidate decision records
accepted sample drafts
rejected sample drafts
memory delta drafts
memory forbidden records
production exclusion register
```

It keeps protocol pass separate from production approval. Accepted and rejected
sample entries are drafts only, memory entries require human approval, and every
`never_production` candidate is copied into `production_exclusion_register`.

```powershell
node --check kernel\review_decision_package.js
node --check scripts\validate_review_decision_package.js
node scripts\validate_review_decision_package.js
```

## Evidence Blocker Contract

```powershell
node kernel\evidence_blocker_contract.js --input tests\schema_examples\review_result_protocol_input.example.json
node kernel\evidence_blocker_contract.js --input tests\schema_examples\review_result_protocol_negative_guard_input.example.json
```

The evidence blocker contract turns the review decision package into the hard
arbiter surface for the local production kernel:

```text
EvidenceRecord
BlockerDecision
ProductionExclusionRegister
```

An `EvidenceRecord` explains what was observed and why the candidate passed or
rejected. A `BlockerDecision` explains why production or memory promotion is
blocked. `ProductionExclusionRegister` contains the candidates that must remain
`never_production`. None of these records perform writes or create production
candidates.

```powershell
node --check kernel\evidence_blocker_contract.js
node --check scripts\validate_evidence_blocker_contract.js
node scripts\validate_evidence_blocker_contract.js
```

The negative guard fixture is pinned in
`tests/schema_examples/evidence_blocker_contract_negative_guard.example.json`.
It must match the CLI output exactly and proves that memory-forbidden candidates
remain blocked from memory and permanently excluded from production.

## Review Blocker Arbiter

```powershell
node kernel\review_blocker_arbiter.js --input tests\schema_examples\review_result_protocol_input.example.json
node kernel\review_blocker_arbiter.js --input tests\schema_examples\review_result_protocol_negative_guard_input.example.json
```

The review blocker arbiter turns the evidence blocker contract into final
candidate-level verdicts for the local production kernel. It is still
stdout-only and does not approve production or write memory. It decides whether
each candidate is:

```text
pass_draft_only_pending_human_review
reject_failure_learning_only_never_production
reject_memory_forbidden_never_production
blocked_pending_required_review
```

The arbiter preserves the hard rules: every candidate must trace to an
EvidenceRecord and production BlockerDecision, memory-forbidden candidates
cannot create memory drafts, never-production candidates cannot become
production candidates, and all production promotion remains blocked until a
human review and separate promotion gate.

```powershell
node --check kernel\review_blocker_arbiter.js
node --check scripts\validate_review_blocker_arbiter.js
node scripts\validate_review_blocker_arbiter.js
```

The pinned fixtures are:

```text
tests/schema_examples/review_blocker_arbiter.example.json
tests/schema_examples/review_blocker_arbiter_negative_guard.example.json
```

## ReviewReport Contract

```powershell
node kernel\review_report_contract.js --input tests\schema_examples\review_result_protocol_input.example.json
node kernel\review_report_contract.js --input tests\schema_examples\review_result_protocol_negative_guard_input.example.json
```

The ReviewReport contract turns final blocker-arbiter routes into the report
object that a Review Console or future adapter can display. It records why a
candidate passed or rejected, which evidence and blocker records control the
route, whether memory is draft-only or forbidden, and whether production is
blocked forever.

The contract is still stdout-only. It does not write memory, create accepted
samples, create production candidates, call providers, call plugins, call APIs,
or create images.
