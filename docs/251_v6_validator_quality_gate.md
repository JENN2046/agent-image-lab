# v6 Validator Quality Gate

## 目的

新增 meta-validator 检查所有 v6 validators 的质量，防止再次出现空检查（`return true` 占位）。

## 检查项

1. 每个 validator 必须有 `check_count`
2. 每个 validator 必须能输出 JSON summary
3. 每个 validator 不能包含明显空检查：`check("...", () => true)` 或 `return true;` 作为唯一函数体
4. 每个 validator 不能把 forbidden strings 写成危险正向字面量导致 self-match
5. 每个 validator 必须包含 `failed_count`
6. 每个 validator 必须在失败时 `process.exitCode = 1`
7. `validate_mvp.ps1` 必须引用所有 v6 validators
