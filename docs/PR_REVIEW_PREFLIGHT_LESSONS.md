# PR Review Preflight Lessons

Status: active local process note.

Purpose: prevent evidence and metadata pull requests from using GitHub review as the first full validation suite.

## Trigger

PR #7 merged the AIL visual production run evidence, accepted sample promotion, git-tracked headphones artifact, validator repairs, and post-push closeout into `master`.

During review, repeated P1/P2 findings were useful but expensive. The common pattern was not that the product direction was wrong; it was that local proof surfaces did not fully validate the claims they published.

## Required Local Preflight Before Review

For future evidence, metadata, accepted sample, recoverability, or governance-summary PRs, run a local review-preflight bundle before requesting or re-requesting review:

- Targeted validators for every changed status claim.
- `npm run validate:mvp`.
- Parent validator entrypoints touched by summary contract changes, especially PowerShell governance/MVP wrappers when the child summary shape changes.
- `git diff --check`.
- A fresh clone or git-tracked artifact check when metadata claims `portable_after_clone`, `git_tracked_verified`, or equivalent recoverability.

## Recoverability Rule

Do not treat file existence as recoverability proof.

When a sample is marked `recoverable`, `workspace_local_verified`, `git_tracked_verified`, `portable_after_clone`, or similar, local validation must verify the bytes and metadata behind that claim:

- Source path exists.
- Actual SHA-256 matches the registry and metadata.
- Actual dimensions match the registry and metadata.
- Actual MIME/signature matches the registry and metadata.
- Manifest, metadata, source evidence, and category index agree.

## Summary Contract Rule

When a child validator changes a machine-readable summary field, update every parent consumer in the same local batch.

Examples from PR #7:

- A boolean field cannot silently become a string such as `mixed` unless parent validators are updated.
- A new recoverability status such as `git_tracked_verified` must be included in every count that claims to count recoverable samples.
- Resume-surface guards must require explicit boundary markers instead of passing on a broad phase mention.

## Review Loop Rule

Batch local fixes before pushing and re-requesting review.

Recommended loop:

1. Cluster all actionable findings.
2. Patch locally as one coherent slice.
3. Run targeted validators and parent validators.
4. Run MVP and whitespace checks.
5. Push once.
6. Request review once.

Do not repeatedly push one tiny fix at a time unless the finding blocks understanding of the next fix.

## Boundary

This note does not authorize push, merge, release, deploy, provider calls, image generation, memory writes, or production candidate work. It is a local process guard for future PR readiness.
