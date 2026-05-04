# ImageLab Review Console 产品规格

## MVP 功能范围

- 打开 `review_session`。
- 显示当前图片引用或占位路径。
- 显示 AI 评分和分项说明。
- 允许人工评分覆盖 AI 评分。
- 允许写中文文本评论。
- 允许选择资产状态：`accepted`、`candidate`、`rejected`、`changes_required`。
- 显示中文 `memory_preview`。
- 允许批准、拒绝或要求修改记忆写入。
- 输出更新后的 `review_session`。
- 生成 `image_case` 草案。

## 页面区域

```text
顶部：任务信息 / 当前状态
左侧：图片预览 / 版本
中间：AI 评分 / 人工评分 / 评论
右侧：审批动作 / 记忆写入预览
底部：下一轮迭代建议 / 操作日志
```

## 用户操作流

1. 打开待审任务。
2. 查看图片版本、AI 评分和历史评论。
3. 填写人工评分与中文评论。
4. 选择入库、候选、拒绝或继续迭代。
5. 查看并编辑中文记忆写入预览。
6. 批准、拒绝或要求修改记忆写入。
7. 保存更新后的 `review_session` 草案。

## AI 评分与人工评分关系

- 人工评分 > AI 评分。
- 人工审批 > Agent 建议。
- 人工评论 > 自动摘要。
- 如果人工评分存在，最终分数采用人工评分。

## 评论模型

MVP 只做文本评论和区域标签，不做复杂坐标绘制。评论必须使用中文正文，并包含作者、目标、严重程度、状态和创建时间。

## 版本对比模型

MVP 只支持：

- 上一版 / 当前版左右并排的规格描述。
- 分数差异。
- 评论差异。

不做 pixel diff、overlay diff、锁定缩放或复杂图上绘制。

## 记忆写入预览与审批模型

记忆写入预览必须包含：

```yaml
target_notebook: Photo_Studio_OS_Style_Memory
chinese_diary_title: "Photo Studio OS 三仪表构图经验"
chinese_diary_content: "本次评审确认三仪表需要保持横向平衡，右侧小仪表不得贴近右侧栏。"
tags:
  - PhotoStudioOS
  - 三仪表
memory_safety:
  contains_secret: false
  contains_private_path: false
  contains_customer_private_data: false
  contains_image_binary: false
```

审批动作包括批准写入、拒绝写入、要求修改正文、标记为风格规则候选。

## 与 DailyNote / LightMemo / Image_Case_Archive 的关系

- DailyNote 是未来中文记忆写入入口。
- LightMemo 用于后续主动检索已写入的 VCP 日记 / 知识库。
- Image_Case_Archive 记录案例摘要、评分、路径引用和资产状态。
- Review Console 不直接写 DailyNote，只输出经过审批的写入请求草案。

## 需要在 VCPChat 中新增或改造的模块

未来可能新增：

```text
VCPChat/ImageLabmodules/review.html
VCPChat/ImageLabmodules/review.js
VCPChat/ImageLabmodules/review.css
VCPChat/modules/ipc/imageLabReviewHandlers.js
```

本 MVP 不修改 VCPChat，不实现 UI。

## 安全规则

- `contextIsolation: true`
- `nodeIntegration: false`
- 不在 URL query 中传 key、token、私密路径。
- renderer 不直接调用 DailyNote。
- renderer 不直接写文件。
- 所有写入动作走 IPC handler。
- 必须校验 IPC sender。

## 不建议 MVP 做的功能

多人审批、外部分享链接、完整图上绘制工具、像素级差异对比、overlay diff、批量审片、资产搜索、客户门户、自动邮件通知、复杂权限系统、真实插件执行按钮、DailyNote 自动写入无审批。

## 第一版验收标准

- 能说明如何打开和更新 `review_session`。
- 能说明人工评分如何覆盖 AI 评分。
- 能说明评论和审批动作。
- 能说明中文记忆预览与审批。
- 不包含真实 UI 实现。
- 不包含真实插件执行逻辑。
- 不修改 VCPChat。
