# DECISIONS — 架构决策记录

## D001：Agent Image Lab 独立，但接入 VCP

理由：避免污染 VCPToolBox 主体，同时复用 VCP 插件、记忆、分布式能力。

## D002：MVP 不真实执行生图插件

理由：先证明流程、评分、记忆、审批闭环，再接真实插件。

## D003：ImageLab_Master 先正式化，子 Agent 先岗位化

理由：防止人格过早分裂和记忆污染。子 Agent 仍必须有 memory_delta 与记忆署名。

## D004：DailyNote 正文必须中文

理由：方便人工审批、长期维护和风格规则复查。

## D005：Review Console 必须存在，但先写规格

理由：审片台是人工裁决和记忆审批门，不能跳过；但 MVP 不做重型 UI。

## D006：核心风格记忆必须审核

理由：Photo Studio OS 风格铁律不能被单次 AI 判断污染。
