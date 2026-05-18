# Docs Registry

Status: minimal evidence-index draft.

The docs registry is not an authority source. Repository reality, git-tracked files, reference scans, and validators remain authoritative.

Purpose:

- record document lifecycle evidence
- support C1/C2 archive planning
- keep archive decisions machine-checkable
- avoid using historical docs as current authority by accident

Current files:

- `document_registry_schema_v1.yaml` defines the minimum document record shape.
- `registry_scanner_dry_run.md` describes the read-only scanner design.
- `registry_validator_dry_run.md` describes the validator rules.

Non-authorization:

- no directory migration
- no file movement
- no reference rewrite
- no wrapper creation
- no external reads
- no registry authority over repository reality
