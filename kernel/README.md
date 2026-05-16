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
