# Registry Scanner Dry-Run Design

Status: draft, read-only design.

The scanner reads git-tracked project files and produces registry evidence. It does not write production state and does not replace direct reference scans.

Inputs:

- `git ls-files`
- C1/C2 candidate lists
- current reference scan output
- existing archive manifests

Output concept:

```text
docs_registry/generated/documents.scan.csv
docs_registry/generated/reference_graph.scan.csv
```

The generated files are future evidence outputs, not current authority.

Minimum scan fields:

- `path`
- `archive_target`
- `doc_type`
- `lifecycle_status`
- `reference_class`
- `current_path_exists`
- `archive_target_exists`
- `source_refs`
- `scripts_refs`
- `tests_refs`
- `human_navigation_refs`
- `validator_blocked`
- `scan_source`
- `last_scanned_at`

Safety rules:

- read-only repository scan only
- no `.env` or secret path reads
- no real VCPChat / VCPToolBox / manifest reads
- no provider/API/plugin/MCP calls
- no file movement
- no reference rewrite
- no wrapper creation
- no push/tag/release/deploy

Verifier requirement:

Every scanner output must be reproducible from git reality and current reference scans.
