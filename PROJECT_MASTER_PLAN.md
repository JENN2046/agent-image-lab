# Agent Image Lab Project Master Plan

Purpose: short index for current project direction. This file is not the only
source of truth. Detailed history and operating authority remain in `README.md`,
`docs/00_project_roadmap.md`, `AGENTS.md`, and `.agent_board/`.

## Current Baseline

```text
branch: master
latest_visible_head_before_v7_245: 6bc09de
origin_master_before_v7_245: 6bc09de
status: failed_no_image_repeated_quota_or_rate_limit
mode: A4 code/static hardening after active A5 diagnostic retries
same_provider_retry_allowed_now: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
native_doubao_static_hardening: completed
```

## Product Direction

Agent Image Lab remains a VCP-native visual production orchestration layer.
The product mainline has returned to image workflow planning. The Prompt Package
Builder now defines the first controllable artifact before generation
authorization or provider contact: a reviewable product image prompt package.
v7.228 adds the fillable instance template for that package without creating a
real generation task. v7.229 adds the human review checklist and status taxonomy
that decide whether a package may be referenced by a future A5 authorization
draft. v7.230 adds the non-executing handoff template from approved package to
future A5 authorization draft inputs. v7.231 defines the future generated asset
status taxonomy and review surface fields. v7.232 defines the non-writing
memory suitability decision matrix. v7.233 links these artifacts into a single
Delivery / Review Surface Package. v7.234 turns the chain into an operator
runbook. v7.235 validates the chain with a synthetic matte ceramic coffee mug
walkthrough. v7.236 confirms the chain is ready for a non-active A5
authorization draft, not active execution. v7.237 creates that non-active draft.
v7.238 reviews it as safe A4 paperwork while keeping active A5 blocked. v7.239
creates a non-executing generation plan draft to provide a future plan
reference. v7.240 confirms the plan draft and authorization draft are
compatible at paper level while keeping active A5 blocked. v7.241 patches the
non-active authorization draft with the plan ref/version while leaving all
executable A5 fields blocked. v7.242 classifies the remaining active
authorization gaps and separates A4 paper-preparable fields from fields that
must wait for explicit active authorization. v7.243 simplified the authorization
draft into a one-page preflight-pending record. Subsequent active A5 diagnostic
attempts reached `failed_no_image_repeated_quota_or_rate_limit`; the same
provider/model/account path must not be retried until quota/rate-limit is
resolved or a different path is explicitly authorized. v7.244 reconciled state
surfaces to that reality. v7.245 hardens the Native Doubao local execution
surface statically: syntax check, prompt path containment, output containment,
base URL validation, env allowlist, public result redaction, exact call budget,
and validator drift.

## Active Boundaries

```text
A5: not authorized
provider contact: not authorized
runtime execution: not authorized
plugin call: not authorized
image generation: not authorized
DailyNote / VCP memory write: not authorized
real manifest / VCPChat / VCPToolBox read: not authorized
tag / release / deploy / push: not authorized by this file
```

## Operating Model

Use one persistent commander as the source of judgment. Use temporary
`codex exec` Workers only for exact task contracts. Use read-only Verifiers only
for evidence review. The commander remains responsible for final scope review,
validation interpretation, staging, commit decisions, and next-task selection.

## Recommended Next

Recommended next is
`v7.246_no_generation_quota_or_provider_path_diagnostic_readiness_gate`: decide,
without provider contact or generation, whether quota/rate-limit should be
resolved externally, a different provider/model/account path should be prepared,
or generation attempts should remain stopped. Do not call plugins, contact
providers, generate images, save output, write memory, or perform remote/version
actions as part of this recommendation.
