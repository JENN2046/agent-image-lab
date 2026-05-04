# 12 MVP 验收标准

## MVP-A：无执行闭环

必须完成：

- 生成 task_envelope。
- 生成 prompt_package。
- 生成 review_score。
- 人工评分覆盖 AI 评分。
- 生成 memory_delta。
- 生成 case_summary。
- 不调用真实插件。

## MVP-B：最小真实执行闭环

必须完成：

- Adapter dry-run 可用。
- Review Console 可打开 review_session。
- 可人工评分。
- 可批准 / 拒绝 memory_delta。
- 只接一个真实插件。
- 可回滚 dry-run。

## 不通过条件

- 出现英文 DailyNote 正文。
- 出现真实 API key / token。
- 真实调用未通过审批。
- 图片大文件进入长期记忆。
- 子 Agent 没有 memory_delta。
