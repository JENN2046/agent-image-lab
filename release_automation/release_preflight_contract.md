# Release Preflight Contract

本文定义 v1.7 Release Automation Readiness。当前阶段只定义发布前检查合同，不创建 tag，不生成 zip，不计算新的 SHA256，不发布 GitHub Release，不上传资产。

## Purpose

Release preflight 用于把未来发布动作拆成可审查的步骤：

- 工作区状态检查。
- tag 指向检查。
- release package 生成计划。
- SHA256 记录计划。
- package-inside validation。
- GitHub Release preflight。
- 授权点和回滚路径。

## Required Preflight Steps

```yaml
release_preflight:
  git_status_checked: true
  working_tree_clean_required: true
  tag_name_planned: string
  tag_created: false
  package_creation_planned: true
  package_created: false
  sha256_planned: true
  sha256_created: false
  package_inside_validation_planned: true
  package_inside_validation_completed: false
  github_release_planned: true
  release_published: false
```

## Authorization Rules

- 创建 tag 必须单独授权。
- 推送 tag 必须单独授权。
- 生成 zip 必须单独授权。
- 发布 GitHub Release 必须单独授权。
- 上传 release asset 必须单独授权。
- `ok` 或 `继续` 只能推进本地只读或文档工作，不能自动发布。

## Package Boundary

- `release_packages/` 必须保持 Git ignored。
- release package 不得被提交进 Git。
- package-inside validation 只能解压到 `release_packages/` 下的临时验收目录。
- 包内不得包含 secret、raw plugin output、图片二进制、runtime log 原文、endpoint 原文或私密路径。

## GitHub Release Boundary

- Release 创建前必须说明 tag、标题、notes、资产列表。
- Notes-only release 不上传 zip。
- 上传资产 release 必须列出 zip 和 sha256。
- GitHub Release 发布后必须做 read-only intake review。

## Acceptance

- Contract 不执行发布动作。
- 样例中 `tag_created=false`。
- 样例中 `package_created=false`。
- 样例中 `release_published=false`。
- 样例中 `release_assets_uploaded=false`。
