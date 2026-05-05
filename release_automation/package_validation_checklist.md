# Package Validation Checklist

本清单用于未来 release package 生成后的包内验收。通过本清单不代表已经发布 GitHub Release。

## Preflight

- [ ] 是否已获得生成 package 的独立授权。
- [ ] `git status --short --branch` 是否干净。
- [ ] tag 名称是否明确。
- [ ] package 输出目录是否在 `release_packages/`。
- [ ] `release_packages/` 是否被 `.gitignore` 忽略。

## Package Content

- [ ] 包内是否包含项目文档、schema、样例和 runtime prototype。
- [ ] 包内是否不包含 `.git/`。
- [ ] 包内是否不包含 `release_packages/`。
- [ ] 包内是否不包含图片二进制。
- [ ] 包内是否不包含 raw 插件输出。
- [ ] 包内是否不包含 runtime log 原文。
- [ ] 包内是否不包含 endpoint 原文。
- [ ] 包内是否不包含 API key、token、cookie、密码。
- [ ] 包内是否不包含私密路径、客户隐私或客户未公开信息。

## Validation

- [ ] 包内 `scripts/validate_mvp.ps1` 是否通过。
- [ ] 包内关键 JS 是否通过 `node --check`。
- [ ] 包内是否有 SHA256 文件。
- [ ] SHA256 是否与 zip 匹配。
- [ ] package-inside validation 是否有中文摘要。

## GitHub Release

- [ ] 是否已获得 GitHub Release 发布授权。
- [ ] release tag 是否指向预期 commit。
- [ ] release notes 是否说明边界。
- [ ] 如果上传资产，zip 和 sha256 是否都上传。
- [ ] 发布后是否完成 read-only intake review。
