# Registry Validator Dry-Run Design

Status: draft, no behavior change to existing validators.

The registry validator checks registry evidence against repository reality. It does not make the registry authoritative.

Validation rules:

1. `path` must exist unless `lifecycle_status` is `archived`, `superseded`, or `blocked`.
2. `archive_target`, when present, must be under `docs/archive/`.
3. `reference_class` must match the latest reference scan.
4. Any `scripts_refs` or `tests_refs` must set `validator_blocked: true`.
5. `lifecycle_status: active` must not point only to archived evidence.
6. `human_navigation_refs` must be non-empty when `reference_class` is `human_navigation`.
7. Registry rows must include `scan_source` and `last_scanned_at`.

Allowed future implementation:

- local read-only validator script
- no external reads
- no runtime integration
- no changes to existing validator behavior without a separate local implementation task

Failure examples:

- registry marks a missing current path as `active`
- archive target points outside `docs/archive/`
- scripts refs exist but `validator_blocked` is false
- reference class says `zero_ref` while current scan finds README refs
