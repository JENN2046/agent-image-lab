# v7.8 A5 Template + Prompt Library Separation

## 目的

将提示词从 A5 授权模板中分离，建立独立的提示词库。
A5 模板只通过 `prompt_package_ref` 引用提示词包。

## 新增结构

```text
prompts/image_generation/
  └── product_still_life_outdoor_tennis_v1.yaml

docs/a5_templates/
  └── A5_SINGLE_REAL_GENERATION_TEMPLATE.md
```

## 规则

```text
- 所有提示词存入 prompts/image_generation/ 目录
- 每个提示词包是一个独立 YAML 文件
- A5 模板只引用 prompt_package_ref，不内嵌 prompt
- 提示词包包含 safety 字段（person_or_face_allowed 等）
- 提示词包包含 execution 字段（model、size 等）
- reference_policy 固定为 text_only_no_image_input
```

## 后续

```text
- 新增提示词时只新增 YAML 文件，不改 A5 模板
- A5 激活时填写 prompt_package_ref 即可引用
```
