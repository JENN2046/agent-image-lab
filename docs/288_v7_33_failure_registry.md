# v7.33 Failure Registry

## 目的

建立 failure registry，与 accepted sample registry 成对存在。

## 规则

- 本 registry 只登记失败/偏差样本，不提交图片
- Git 只保存路径、prompt_package_ref、review_doc_ref、模型、provider、failure_tags、correction_phase

## 当前登记

1. v7.21 网球钱包第一发偏差
2. v7.26 法式藤编包第一发水印/叶子/书页偏差
3. v7.29 法式藤编包 v2 仍有水印

## 边界

- failure registry 不授权生成、不授权批量、不授权写 memory / DailyNote
- 下一步建议：3-shot Stability Test Plan 或 Prompt Correction Advisor v1
