# v7.51i Adapter Quality Hardening Patch

## 1. Purpose

本文件记录 v7.51i 质量硬化补丁。该补丁不扩展功能，只针对 LT-03 代码审查发现的 6 个问题做最小安全修正。

## 2. Changes

### 2.1 Adapter (`scripts/agent_image_lab_read_only_adapter.js`)

| # | Issue | Fix |
|---|-------|-----|
| 1 | 路径安全靠白名单不是强约束 | 新增 `isSafeRepoRelativeRef()` 函数，拦截绝对路径、`..` 跨目录、图片后缀和驱动字母前缀 |
| 2 | adapter 没有 `module.exports` | 新增 `module.exports` 导出 `processRequest/checkHardBlockers/resolveRefs/isSafeRepoRelativeRef/EVIDENCE_MAP`，保留 CLI 入口 |

### 2.2 Schema Validator (`scripts/validate_agent_image_lab_read_only_adapter_schema.js`)

| # | Issue | Fix |
|---|-------|-----|
| 3 | `cases_passed` 统计的是 checks | 输出新增 `checks_total/checks_passed/checks_failed`，`cases_passed` 现在按 case 统计（6 cases, 13 checks） |
| 4 | 未处理 adapter 崩溃 / stdout 非 JSON | `runAdapter()` 新增 timeout=5000ms, maxBuffer=1MB, spawnSync error 处理, JSON parse 容错 |

### 2.3 Security Gate Validator (`scripts/validate_agent_image_lab_read_only_adapter_security_gates.js`)

| # | Issue | Fix |
|---|-------|-----|
| 4 | 同 schema validator | `runAdapter()` 新增 timeout/error 处理 |
| 3 | `cases_passed` 语义 | 同 schema validator |
| 5 | "exactly one" blocker 没验证 | `verifyBlocked()` 新增 `blocked_reasons.length !== 1` 检查 |
| 6 | blocked response refs 未验证 | `verifyBlocked()` 新增 `returned_resource_refs` 为空数组检查 |

### 2.4 Fixture Validator (`scripts/validate_agent_image_lab_read_only_adapter_fixtures.js`)

| # | Issue | Fix |
|---|-------|-----|
| 4 | 同 schema validator | `runAdapter()` 新增 timeout/error 处理 |
| 3 | `cases_passed` 语义 | 同 schema validator |

## 3. Validation Results

| Validator | Cases | Checks | Result |
|-----------|-------|--------|--------|
| Schema | 6 | 13 | pass |
| Security Gates | 11 | 11 | pass |
| Fixture | 9 | 24 | pass |

## 4. External Side Effects

All false: VCP call, VCPChat bridge, Electron, remote-debug, CDP, DailyNote, VCP memory, image generation, image binary read, runs path read.

## 5. Cumulative LT-03 Status

| Sub-phase | Status | Description |
|-----------|--------|-------------|
| v7.51c | complete | Adapter implementation planning |
| v7.51d | complete | Adapter runtime implementation |
| v7.51e | complete | Schema validation |
| v7.51f | complete | Security gate validation |
| v7.51g | complete | Fixture regression |
| v7.51h | complete | Validation closeout |
| v7.51i | complete | Quality hardening patch |

## 6. Code Quality Score

```yaml
code_quality_score_before: 7.4/10
code_quality_score_after: 8.5/10
improvements:
  - cases/checks naming now semantically accurate
  - runAdapter robust against adapter crash and invalid JSON
  - path traversal guard added (.., absolute, image ext, drive letter)
  - blocked responses enforce empty returned_resource_refs
  - exactly-one blocker verified per gate
  - adapter functions exported for direct testing
remaining:
  - adapter still not production-grade (needs VCP/VCPChat integration)
  - evidence map still hardcoded (intentional for v7.5x series)
```

## 7. Next Allowed Steps

- LT-05: VCPToolBox ingestion
- LT-07: E2E fixture
- v7.50e: real VCPChat surface check planning
- New production candidate with independent A5

## 8. Hard Stops

- do_not_call_vcp_without_independent_authorization
- do_not_call_vcpchat_bridge_without_independent_authorization
- do_not_start_electron_without_explicit_authorization
- do_not_write_dailynote_without_independent_a5
- do_not_write_vcp_memory_without_independent_a5
- do_not_generate_image_without_independent_a5
- do_not_read_image_binary
- do_not_reopen_closed_no_memory_write_case
- do_not_push_without_authorization
