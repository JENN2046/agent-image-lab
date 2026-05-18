# Docs Archive D2 Registry Scanner Dry-Run

Status: D2 completed as scanner dry-run design.

Scanner design: `docs_registry/registry_scanner_dry_run.md`

## Scope

The scanner is a future local read-only tool design. It scans git-tracked project files and emits registry evidence.

It does not:

- read external systems
- read secrets
- move files
- rewrite references
- create wrappers
- call APIs/plugins/MCP
- write memory

## Output Concept

Future generated evidence may include:

- `docs_registry/generated/documents.scan.csv`
- `docs_registry/generated/reference_graph.scan.csv`

Those outputs remain evidence, not authority.

## Next

D3 registry validator dry-run design.
