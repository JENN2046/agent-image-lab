# v7.3 Asset Acceptance Gate

## 目的

定义真实生成后资产验收门。

## 资产状态

```text
- accepted_candidate
- needs_human_review
- rejected
- blocked
```

## Gate Checklist

```text
- prompt_subject_match
- style_direction_match
- no_person_or_face_unless_expected
- no_readable_text_or_logo_unless_expected
- composition_acceptable
- commercial_usability
- memory_suitability
- archive_suitability
```

## 规则

```text
- accepted_candidate 不等于自动交付
- accepted_candidate 不等于自动写 memory
- needs_human_review 不得写 memory
- rejected 不得写 memory
- blocked 不得 retry
- memory write requires separate authorization
- DailyNote write requires separate authorization
```
