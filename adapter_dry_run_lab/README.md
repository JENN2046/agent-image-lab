# Adapter Dry-Run Lab

本目录是 Phase D 的项目内 dry-run 实验目录，不是 VCP 插件，不安装到真实 VCPToolBox，也不是 `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` 的执行入口。

## 边界

- 只读取本地 JSON fixture。
- 只向 stdout 输出 dry-run 草案 JSON。
- 不调用 VCP 插件。
- 不调用外部 API。
- 不写文件。
- 不写 DailyNote。
- 不创建图片。
- 不保存 raw manifest。
- 不复制密钥、token、cookie、密码、私密路径或客户隐私。

## 使用方式

```powershell
node adapter_dry_run_lab\adapter_dry_run.js adapter_dry_run_lab\fixtures\accepted_request.json
node adapter_dry_run_lab\adapter_dry_run.js adapter_dry_run_lab\fixtures\rejected_request.json
```

输出只代表 dry-run 草案或拒绝草案，不代表真实插件选择、dry-run 实测完成或真实执行授权。
