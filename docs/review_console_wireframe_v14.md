# Review Console Wireframe v14

```yaml
wireframe_id: review_console_wireframe_v14
source_phase: v14_004_review_console_wireframe_and_data_contract_gate
source_commit: 33e26855758a9205f7e3c53342e81302017d7867
status: markdown_low_fidelity_wireframe
```

## Wireframe Boundary

This is a low-fidelity markdown wireframe only. It does not create UI files,
frontend assets, runtime code, browser entrypoints, image previews, provider
actions, memory writes, accepted_samples writes, or retouch/delivery execution.

The wireframe uses path references as text. It must not read or ingest `runs/`
image binaries.

## 1. Review Console Home

```text
+--------------------------------------------------------------------------------+
| Review Console                                                                 |
| Route: review_console_productization_planning     Mode: observation/decision   |
+----------------------+----------------------+----------------------+----------+
| Filters              | Asset Queue          | Pending Actions      | Boundary |
| - by asset           | - asset_id           | - action_type        | Summary  |
| - by product         | - product            | - risk_level         | - no gen |
| - by status          | - asset_status       | - allowed_now        | - no mem |
| - by pending action  | - route_status       | - recommended        | - no run |
| - by risk boundary   | - next blocker       | - human auth needed  | - no UI  |
| - by route closeout  |                      |                      | exec     |
+----------------------+----------------------+----------------------+----------+
| Recent Route Closeouts                                                          |
| - premium_portable_led_camping_lantern_v13_013                                  |
| - premium_serum_bottle_v10_011                                                  |
| - ceramic_mug_v4                                                                |
| - sports_visor_v8_033                                                           |
+--------------------------------------------------------------------------------+
```

Home must make the current safety boundary visible before any next action is
shown. No action on this page is executable in v14.004.

## 2. Asset Detail View

```text
+--------------------------------------------------------------------------------+
| Asset Detail: <asset_id>                                                        |
+--------------------------------------------------------------------------------+
| Asset Summary                                                                  |
| product | source_output | asset_status | route_status                           |
| accepted_candidate | commercial_delivery_ready | memory_suitability             |
| accepted_samples_ready                                                         |
+--------------------------------------+-----------------------------------------+
| Review Timeline                      | Safety Boundary                         |
| phase / commit / event / result      | provider_contact: false                 |
| source_doc / validation_status       | image_generation: false                 |
|                                      | memory_write: false                     |
|                                      | accepted_samples_written: false         |
+--------------------------------------+-----------------------------------------+
| Evidence Package Panel               | Delivery Readiness Panel                |
| evidence ref / prompt ref            | package ref / review ref                |
| generation output path ref only      | commercial_delivery_ready               |
| local persistence / key findings     | QA blockers / export policy             |
+--------------------------------------+-----------------------------------------+
| Watch Items Panel                    | Next Action Queue                       |
| severity / delivery impact           | action_type / risk / allowed_now        |
| retouch_required / blocks_delivery   | auth_required / blocker_reason          |
+--------------------------------------+-----------------------------------------+
| Route Closeout Panel                                                           |
| closeout ref | final status | downstream work not performed                    |
+--------------------------------------------------------------------------------+
```

Asset Detail is the default detail surface for all existing asset examples.

## 3. Evidence Package Panel

```text
+---------------------------------------------------------------+
| Evidence Package                                               |
+---------------------------------------------------------------+
| evidence_package: <docs/*evidence_package*.md>                 |
| prompt_package: <prompt package path reference>                 |
| generation_output: <runs/...jpg path reference only>            |
| local_persistence_success: true | false | not_applicable        |
| provider_calls_used: number | not_applicable                    |
| generation_attempts_used: number | not_applicable               |
| accepted_candidate: true | false                                |
+---------------------------------------------------------------+
| Key Findings                                                   |
| - finding 1                                                     |
| - finding 2                                                     |
+---------------------------------------------------------------+
| Watch Items                                                    |
| - watch_item_id / severity / delivery impact                    |
+---------------------------------------------------------------+
```

The panel may display a source output path as text. It must not open, copy,
thumbnail, encode, stage, or commit the image binary.

## 4. Delivery Readiness Panel

```text
+---------------------------------------------------------------+
| Delivery Readiness                                             |
+---------------------------------------------------------------+
| delivery_readiness_package: <docs/*delivery_readiness*.md>      |
| delivery_readiness_review: <docs/*delivery_readiness*.md>       |
| commercial_delivery_ready: false                               |
| retouch_needed_later: optional_minor_retouch | none | required |
| export_naming_policy: draft | approved | not_defined           |
| accepted_samples_ready: false                                  |
| memory_suitability: deferred | false | true | not_applicable   |
+---------------------------------------------------------------+
| QA Blockers                                                    |
| - blocker or none_declared                                     |
+---------------------------------------------------------------+
```

Delivery readiness must not be inferred from accepted candidate state.

## 5. Watch Items Panel

```text
+----------------------------------------------------------------+
| Watch Items                                                     |
+----------------------------------------------------------------+
| id | severity | delivery_impact | retouch_required | blocks     |
| diffuser_center_brightness | minor | low | false | false        |
| lower_body_darkness        | minor | low | false | false        |
| base_body_separation       | minor | low | false | false        |
| edge_readability_in_crop   | minor | low | false | false        |
+----------------------------------------------------------------+
| Resolution                                                      |
| resolved_status: unresolved | deferred | resolved | not_applicable |
+----------------------------------------------------------------+
```

Watch items are review facts. They do not authorize retouch.

## 6. Safety Boundary Panel

```text
+---------------------------------------------------------------+
| Safety Boundary                                                |
+---------------------------------------------------------------+
| provider_contact: false                                        |
| image_generation: false                                        |
| retry: false                                                   |
| env_local_secret_value_read: false                             |
| memory_write: false                                            |
| accepted_samples_written: false                                |
| runs_output_committed: false                                   |
| real_retouch_execution: false                                  |
| production_candidate_002: false                                |
+---------------------------------------------------------------+
| Boundary Note                                                  |
| Review Console displays state and decisions only. Side effects |
| require independent authorization gates.                       |
+---------------------------------------------------------------+
```

This panel should be visible before any future implementation renders action
buttons or route decisions.

## 7. Next Action Queue

```text
+----------------------------------------------------------------+
| Next Action Queue                                               |
+----------------------------------------------------------------+
| action_type | risk_level | allowed_now | human_auth | recommend |
| static_review | low | true | false | true                         |
| retouch_authorization | medium | false | true | false             |
| memory_planning | medium | false | true | false                   |
| accepted_samples_planning | medium | false | true | false         |
| provider_generation | high | false | true | false                 |
+----------------------------------------------------------------+
| blocker_reason                                                  |
| allowed_now=false until the named authorization gate is complete |
+----------------------------------------------------------------+
```

The queue may recommend a future action. It must not execute that action.

## 8. Route Closeout Panel

```text
+---------------------------------------------------------------+
| Route Closeout                                                 |
+---------------------------------------------------------------+
| route_closeout_ref: <docs/*route_closeout*.md>                  |
| route_status: closed_as_accepted_candidate_with_delivery...     |
| final_asset_status: accepted_candidate_with_minor_watch_items   |
| commercial_delivery_ready: false                               |
| memory_write_performed: false                                  |
| accepted_samples_written: false                                |
| runs_output_committed: false                                   |
| production_candidate_002_started: false                        |
+---------------------------------------------------------------+
```

Route closeout must preserve what did not happen. Closed does not mean delivered,
remembered, copied to accepted_samples, or production-promoted.

## Future Implementation Notes

```yaml
future_implementation_requires:
  independent_UI_implementation_authorization: true
  exact_readonly_file_allowlist: true
  no_image_binary_ingestion_unless_separately_authorized: true
  no_provider_execution: true
  no_memory_write: true
  no_accepted_samples_write: true
  no_runtime_CDP_bridge_MCP: true
```
