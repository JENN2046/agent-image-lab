# Phase F — F4 Generation + F5 Asset Review Record

```yaml
phase_f_f4_f5:
  status: generation_complete_reviewed
  timestamp: "2026-05-08"
  phase: "Phase F — F4 Portrait Generation + F5 Asset Review"
  max_plugin_calls_authorized: 2
  actual_plugin_calls_total: 2
  images_generated: 2
  daily_note_called: false
  memory_write_performed: false
  side_effects: "images written to runs/phase_f_f4_portrait_generation/ only"
```

## Run 1

```yaml
run_1:
  status: success
  image: "9745d771-d47b-45f4-8f0c-fe2dddf69fa7.jpg"
  bytes: 212306
  sha256: "06491cebdfc3570a9194b98a08883d689e5d1d5b20ce2aab12c6c8e9c9b590b4"

  review:
    prompt_subject_match: true
    person_or_face_detected: true
    readable_text_or_logo_detected: false
    brand_or_device_marks: false
    face_distorted_or_unrealistic: false
    composition: "professional half-body portrait"
    background: "clean gray, matches prompt"
    verdict: "accepted_candidate"
```

## Run 2

```yaml
run_2:
  status: success
  image: "704a6668-a011-462c-9b3a-76d81e83efbb.jpg"
  bytes: 204357
  sha256: "57326cf7e1403f69b0b37724df49d64feb0d11ae4d7b4852ea555883910f70b5"

  review:
    prompt_subject_match: true
    person_or_face_detected: true
    readable_text_or_logo_detected: false
    brand_or_device_marks: false
    face_distorted_or_unrealistic: false
    composition: "professional half-body portrait"
    background: "clean gray, matches prompt"
    verdict: "accepted_candidate"
```

## Model Note

```yaml
model_report:
  requested_model: "doubao-seedream-5-0-260128"
  plugin_reported_model: "doubao-seedream-3-0-t2i-250415"
  plugin_reported_model_matches_requested: false
  note: "Plugin used seedream 3.0 despite 5.0 request. Same behavior as v10.14-v10.19. Image quality acceptable for portrait use."
```

## F5 Verdict

| Run | Verdict |
| --- | --- |
| run_1 | ✅ accepted_candidate |
| run_2 | ✅ accepted_candidate |

推荐: **run_1** 作为首选（构图更端正，面部细节更佳）。

## Next

F6: 为 accepted_candidate(s) 生成 memory_delta 草案（daily_note_write_allowed=false，不执行 F7 真实写入）。
F8: 交付收束。
