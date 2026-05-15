# v10.013 Third Product Prompt Revision Or Candidate Evidence Decision Gate

```yaml
phase: v10_013_third_product_prompt_revision_or_candidate_evidence_decision_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R2
source_phase: v10_012_human_review_of_third_product_first_real_output
source_commit: 6c3708cfe3190869bd7e8968ab09322161051819
```

## Purpose

This gate presents the next path choices after the first real premium serum
bottle output was reviewed as `accepted_candidate_with_minor_watch_items`.

It does not generate a new image, contact a provider, retry, read `.env.local`,
write memory, write `accepted_samples/`, start `production_candidate_002`, or
commit any `runs/` output.

## Current Reviewed Candidate

```yaml
product: cosmetic_skincare_bottle / premium_serum_bottle
reviewed_output: runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg
prompt_package_used: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
execution_status: success
local_persistence_verified: true
asset_status: accepted_candidate_with_minor_watch_items
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
```

## Option A — Create Third Product Prompt Revision Plan

```yaml
option: create_prompt_revision_plan
risk: low
provider_contact: false
image_generation: false
A5_authorization_created: false
```

This option creates a prompt v2 revision plan focused on the watch items from
v10.012:

- label elegance
- glass depth / bottle shoulder / neck refinement
- dropper material quality
- shadow and reflection polish
- stronger premium beauty brand atmosphere

This option would remain docs-only unless a later independent A5 authorization
is explicitly created.

## Option B — Create Third Product Accepted Candidate Evidence Package

```yaml
option: create_accepted_candidate_evidence_package
risk: low
accepted_candidate: true
commercial_delivery_ready: false
accepted_samples_written: false
runs_output_committed: false
memory_write: false
```

This option preserves the current v10.011 output as accepted candidate evidence
without promoting it to commercial delivery ready. It records the chain from
third-product brief and prompt package through first real generation, local
persistence verification, and human review.

## Option C — Stop Third Product Route Here

```yaml
option: stop_third_product_route_here
risk: lowest
candidate_evidence_package_created: false
prompt_v2_created: false
```

This option keeps the third product brief, prompt package, and first real output
review, but does not create a dedicated evidence package and does not create a
prompt v2 plan.

## Recommendation

```yaml
recommended_option: create_accepted_candidate_evidence_package
human_decision_required: true
```

Option B is recommended because the current image is already
`accepted_candidate_with_minor_watch_items`. Sealing the candidate evidence
first is steadier than immediately continuing generation. Direct A5 retry,
memory write, and `production_candidate_002` are not recommended by this gate.

## Boundary Confirmation

```yaml
safety:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  secret_value_printed: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
  accepted_samples_written: false
  commercial_delivery_ready: false
```

## Recommended Next

```yaml
phase: pending_human_third_product_candidate_path_selection
auto_execution_allowed: false
purpose: 等待人工选择 Option A/B/C；不得自动进入 A5、memory、production 或真实交付。
```
