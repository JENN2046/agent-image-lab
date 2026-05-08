# Tag and Version Strategy

本文定义 Agent Image Lab 的 tag 命名规范和版本号策略。本策略只约束本地 tag 格式，正式 release 发布仍需单独授权。

```yaml
tag_strategy:
  status: completed_local_tag_strategy
  doc: docs/233_tag_and_version_strategy.md
  real_execution: false
  version_action_performed: false
```

## Tag 命名规范

### 格式

```
v<major>.<minor>-<descriptive-label-with-dashes>
```

### 当前 Tag 系列

| 系列 | 范围 | 含义 |
| --- | --- | --- |
| `v0.x` | v0.2.0–v0.9.0 | MVP baseline, phase completions, dry-run exports, release readiness |
| `v1.x` | v1.0.0–v1.2.0 | True-loop closeout, review console runtime prototype baseline |
| `v2.x` | v2.0.0–v2.9 | VCPChat auth chain baselines, runtime planning gates |
| `v3.x` | v3.0.0–v3.9 | First runtime patch series, guard extraction baseline |
| `v4.x` | v4.6, v4.8 | Guarded autopilot commit scope, local validation checkpoint |
| `v5.x` | v5.10–v5.22 | Runtime Review follow-up series, sustained autopilot chain, Phase E completion |
| `v7.x` | v7.46 | Remote-debug runtime verification |
| `v10.x` | v10.8 | A5 guarded delivery baseline |

### 命名规则

```yaml
tag_rules:
  - "tag 不使用语义化版本三段式（x.y.z）作为唯一格式；推荐 vX.Y-label"
  - "label 使用小写字母和连字符，描述 tag 对应的事件或里程碑"
  - "runtime-review 系列 tag 使用 v5.X-runtime-review-<description>"
  - "phase 系列 tag 使用 v5.X-phase-<letter>-<description>"
  - "tag message 必须包含中文描述"
  - "tag 不包含 raw path、endpoint、secret、token、cookie、密码"
```

### 当前活跃 Tag

```yaml
active_tags:
  - tag: "v5.18-runtime-review-sustained-autopilot-chain-complete"
    description: "Sustained autopilot chain 完成 (9A→10C→final, 7/7)"
  - tag: "v5.19-runtime-review-index-sync"
    description: "顶层索引同步 (README/MANIFEST/RELEASE_NOTES/checklist)"
  - tag: "v5.20-runtime-review-complete-validator-chain"
    description: "完整 batch validator 链 (9A/9B/9C/10A/10B/10C)"
  - tag: "v5.21-runtime-review-full-chain-validator"
    description: "全链 validator aggregator"
  - tag: "v5.22-phase-e-ipc-contract-and-security-checklist"
    description: "Phase E 完成 (任务书/IPC 契约/安全清单)"
```

## 版本号策略

```yaml
version_policy:
  major:
    when: "breaking changes to project architecture, VCPChat integration, or A5 execution model"
    example: "v1→v2 (productization baseline)"
  
  minor:
    when: "new phase completion, new validator chain, new draft surface, sustained autopilot milestone"
    example: "v5.10→v5.18 (sustained autopilot chain)"
  
  patch:
    when: "doc fixes, index sync, stale reference corrections, minor agent-board updates"
    current_usage: "not formally used; patch-level changes are absorbed into minor tags"

  tag_only:
    when: "small doc/index sync commits between major milestones"
    convention: "create tag for meaningful milestones; skip for intermediate sync commits"
```

## Tag 操作规范

```yaml
tag_operations:
  create:
    when: "significant milestone reached (phase completion, chain closure, new validator set)"
    command: "git tag -a vX.Y-description -m '中文描述'"
    auto_allowed: true

  push:
    when: "与 commits 一起 push 到 origin"
    command: "git push origin master --tags"
    auto_allowed: false
    requires: "explicit user authorization or active version-action package"

  delete:
    when: "tag 创建错误或指向错误 commit"
    command: "git tag -d <tag> && git push origin :refs/tags/<tag>"
    auto_allowed: false
    requires: "explicit user authorization"

  list:
    when: "查看当前 tag 状态"
    command: "git tag --list | sort -V"
    auto_allowed: true
```

## 未来 Release 发布策略

```yaml
release_strategy:
  current_state: "未发布正式 release"
  when_to_release:
    - "Phase F MVP-B controlled execution 完成后"
    - "或 sustained autopilot chain 被用户接受为 release candidate"
  release_format:
    tag: "v1.0.0-agent-image-lab-rc1 (or similar)"
    title: "Agent Image Lab v1.0.0 Release Candidate 1"
    body_must_include:
      - "中文变更摘要"
      - "完成的 phases 列表"
      - "validator 覆盖率"
      - "禁止输出声明"
      - "A5 执行授权门说明"
    body_must_not_include:
      - "raw path, endpoint, secret, token, cookie, password"
      - "raw plugin output, raw runtime log"
      - "image binary"
  auto_allowed: false
  requires: "explicit user authorization + active version-action package"
```

## 验证

```yaml
tag_validation:
  check_tag_format: "git tag --list | grep -E '^v[0-9]+\\.[0-9]+-'"
  check_tag_message: "git tag -l --format='%(tag) %(subject)'"
  check_tag_count: "git tag | wc -l"
  no_forbidden_content: "manual review of tag messages"
```
