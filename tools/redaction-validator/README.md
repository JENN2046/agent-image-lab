# Redaction Validator — Skeleton

Read-only validator for detecting forbidden raw fields, checking redaction consistency, verifying closeout integrity, and detecting permission drift in agent-image-lab documentation.

## Constraints

- **Read-only**: This validator does not modify files, access the network, call CDP, call bridges, call MCP, write memory, or generate images.
- **Skeleton**: This is a skeleton implementation. Rule modules define structure and basic patterns but are not exhaustive.
- **No dependencies**: Pure Node.js. No npm required.

## Usage

```bash
node tools/redaction-validator/validator.js <path1> [path2] ...
```

Example (do not run without explicit authorization):
```bash
node tools/redaction-validator/validator.js docs/ .agent_board/CHECKPOINT.md README.md
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Pass — no violations |
| 1 | Warning — non-blocking issues |
| 2 | Block — violations found |
| 3 | Internal error |

## Rule Modules

| Module | Purpose |
|--------|---------|
| `rules/forbiddenRawFields.js` | Scan for forbidden raw field keys/patterns |
| `rules/allowedSummaryFields.js` | Verify allowed summary field usage |
| `rules/closeoutIntegrity.js` | Check required closeout fields |
| `rules/permissionDrift.js` | Detect permission drift in boundary matrix |
