# Premium Portable LED Camping Lantern Prompt Package Static Review v1

```yaml
review_id: premium_portable_led_camping_lantern_prompt_package_static_review_v1
reviewed_artifact: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
reviewed_product: premium_portable_led_camping_lantern
review_scope: docs_only_static_review
provider_contact: false
image_generation: false
memory_write: false
A5_authorization_created: false
```

## Static Review Result

```yaml
static_review_result: pass_ready_for_A5_decision
recommendation: proceed_to_A5_authorization_decision_gate_only
```

The prompt package is complete enough for an A5 path decision gate. This does
not authorize provider execution. It only means the prompt package can be used
as input to a later human decision about whether to draft a one-shot generation
authorization package.

## Field Review Matrix

| Check | Result | Notes |
|---|---|---|
| `prompt: |` independent line | pass | canonical runner-facing prompt field is present |
| `positive_prompt: |` independent line | pass | human-review alias is present |
| `negative_prompt: |` independent line | pass | negative prompt is present as a literal block |
| prompt / positive_prompt synchronized | pass | positive prompt mirrors canonical prompt |
| `selected_product` accurate | pass | locks `premium_portable_led_camping_lantern` |
| product identity locked | pass | requires compact premium portable LED camping lantern |
| locked structure clear | pass | diffuser, attached handle loop, body, and base are defined |
| material constraints | pass | diffuser, matte/dark premium body, handle, base, and finish are covered |
| structure constraints | pass | blocks flashlight, candle, speaker, humidifier, thermos, desk lamp, and smart speaker drift |
| scene constraints | pass | requires restrained outdoor tabletop context and blocks people, hands, flame, and scene dominance |
| negative prompt coverage | pass | covers fake text, logo, people, hands, open flame, unsafe wet electronics, drift, warped handle, blown diffuser, broken geometry, over-cinematic scene, cyberpunk, and gaming look |
| human review checklist | pass | covers glow control, handle geometry, diffuser readability, product dominance, and drift checks |
| `provider_contact_allowed: false` | pass | provider boundary is explicit |
| `image_generation_allowed: false` | pass | image generation boundary is explicit |
| `memory_write_allowed: false` | pass | memory boundary is explicit |
| `production_candidate_002_allowed: false` | pass | production boundary is explicit |
| prompt package is not A5 authorization | pass | `prompt_package_is_A5_authorization: false` is explicit |

## Watch Items

- Future A5 prompt review should preserve the controlled warm glow language; it is the highest-risk visual variable.
- The negative prompt is intentionally broad around wrong product type drift because the object can collapse into a flashlight, candle, speaker, or desk lamp.
- If a future generation is authorized, human review should pay special attention to handle attachment, diffuser exposure, and whether the scene becomes too cinematic.

## Safety Boundary

```yaml
prompt_package_safety_boundary:
  prompt_package_created: true
  A5_authorization_created: false
  A5_execution_started: false
  provider_contact: false
  image_generation: false
  env_local_secret_value_read: false
  output_directory_created: false
  memory_write: false
  accepted_samples_written: false
  runs_output_committed: false
```

## Recommendation

Proceed to `v13_010_premium_portable_led_camping_lantern_A5_authorization_decision_gate`.
That next gate should present choices only. It must not create execution
confirmation, contact a provider, generate images, read `.env.local`, or create
an output directory.
