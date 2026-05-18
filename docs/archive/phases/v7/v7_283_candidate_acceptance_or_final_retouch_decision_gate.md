# v7.283 Candidate Acceptance Or Final Retouch Decision Gate

```yaml
phase: v7.283_candidate_acceptance_or_final_retouch_decision_gate
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_phase: v7.282_human_review_of_fourth_real_outputs
source_commit: 7970dec11e6a6195259ebb51049f19ef13e98d2e
```

## Purpose

This gate records the current decision point for the first V7 real product-image chain. It does not generate a new image, contact a provider, call a plugin, retry, write memory, write DailyNote, or promote a production candidate.

Current best candidate:

```text
runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
```

Current review state:

```yaml
asset_status: accepted_candidate_with_minor_retouch
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
fifth_generation_auto_start: false
production_candidate_002: false
memory_write: false
DailyNote_write: false
VCP_memory_write: false
```

## Decision Options

### Option A - Keep v4 as accepted candidate and stop generation

Meaning:

```text
Keep v4 as the current best accepted candidate. Do not continue real generation in this chain.
```

Risk:

```text
low
```

Recommendation:

```text
high
```

Next step:

```text
accepted candidate evidence package
```

Why this is favored:

```text
v4 fixed the main v3 handle regression, solved most colored-speck noise, preserved the product scale, and reached accepted_candidate_with_minor_retouch. Continuing generation risks drifting away from the current stable candidate.
```

### Option B - Final retouch planning, no new generation

Meaning:

```text
Do not generate a new image. Record a local final retouch plan for the accepted v4 candidate: upper handle attachment cleanup, slightly brighter background transparency, cleaner bottom shadow, and more refined ceramic surface microtexture.
```

Risk:

```text
low
```

Recommendation:

```text
medium_high
```

Next step:

```text
final retouch instruction package
```

Why this is reasonable:

```text
The remaining issues are localized retouch problems rather than prompt-direction problems. A retouch plan preserves the current best candidate while avoiding additional provider variance.
```

### Option C - Fifth minimal generation trial

Meaning:

```text
Run one more very narrow generation trial that only targets final polish and refined realism.
```

Risk:

```text
medium
```

Recommendation:

```text
low_to_medium
```

Required boundary:

```text
This option requires a new explicit human authorization package. It must not auto-start from this gate.
```

Why this is not the default:

```text
The v3 trial already showed that small prompt changes can regress geometry. A fifth trial may improve polish, but it may also lose the currently accepted v4 candidate quality.
```

## Recommended Default

```yaml
recommended_option: keep_v4_and_stop_generation
secondary_safe_option: final_retouch_planning_no_generation
not_default_option: fifth_minimal_generation_trial
human_decision_required_before_next_generation: true
recommended_next_phase: v7.284_accepted_candidate_evidence_package
auto_execution_allowed_for_next: false
```

## Safety Record

```yaml
fifth_generation_started: false
provider_contact: false
plugin_call: false
image_generation: false
retry: false
memory_write: false
DailyNote_write: false
VCP_memory_write: false
image_added_to_git: false
accepted_samples_written: false
production_candidate_002: false
Batch_005: false
dependency_change: false
package_json_modified: false
```

## Closeout

```yaml
closeout:
  phase: v7.283_candidate_acceptance_or_final_retouch_decision_gate
  source_commit: 7970dec11e6a6195259ebb51049f19ef13e98d2e
  current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  accepted_candidate: true
  commercial_delivery_ready: false
  memory_suitability: deferred
  options_presented:
    - keep_v4_and_stop_generation
    - final_retouch_planning_no_generation
    - fifth_minimal_generation_trial
  recommended_option: keep_v4_and_stop_generation
  human_decision_required_before_next_generation: true
  next_phase_started: false
```
