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
