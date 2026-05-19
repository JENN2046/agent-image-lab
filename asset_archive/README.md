# Asset Archive

本目录只作为资产分类占位和 Git-portable preview evidence capsule 根目录。不要把原图大文件直接提交 Git。

- `accepted_samples/`：新的 accepted sample preview capsule 路径，使用 `<sample_id>/manifest.json + preview.webp`。
- `failure_samples/`：未来 failure sample preview capsule 路径，使用 `<sample_id>/manifest.json + preview.webp + failure_record.json + review_record.json`；当前只记录目录策略，不创建样本。
- `accepted/`：旧 bucket 名称，保留为 legacy 占位；新 accepted sample 证据不要继续写入这里。
- `candidates/`：候选资产。
- `rejected/`：拒绝资产。
- `references/`：参考图。

VCP 记忆只写摘要、路径引用、评分和规则，不写图片二进制。

`preview.webp` 创建、复制或转换需要单独授权。本 README 不授权图片生成、provider/plugin/API 调用、DailyNote 写入、VCP memory 写入或 runtime 集成。
