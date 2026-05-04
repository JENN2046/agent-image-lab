# Case Studies

本目录记录 Agent Image Lab 的视觉案例摘要。MVP 阶段只保存文字、路径占位、评分、规则和中文总结，不保存真实图片文件。

## 第一案例

`photo_studio_os_dashboard/` 是 Photo Studio OS 的 MVP 样例案例，用于验证以下无执行闭环：

```text
用户需求
→ task_envelope
→ prompt_package
→ review_score
→ human_review
→ memory_delta
→ case_summary
```

## 边界

- 不引用真实图片文件。
- 不调用真实 VCP 插件。
- 不写 API key、token、cookie、密码、私密路径或客户隐私。
- 不把 case study 内容直接当作 VCP 长期记忆。
- 如果要写入 VCP 记忆，必须先生成中文 `memory_delta` 并经过人工审批。

## 资产引用规则

案例中出现的路径都是占位路径或未来资产库引用。VCP 记忆只允许写摘要、路径引用、评分和规则，不写图片二进制。
