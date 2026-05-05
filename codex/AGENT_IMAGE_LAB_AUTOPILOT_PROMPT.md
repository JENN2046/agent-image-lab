# Codex Prompt — Agent Image Lab Guarded Sustained Autopilot

Use this prompt after installing the overlay pack.

```text
你现在在 Agent Image Lab 项目根目录。

请先读取：
1. AGENTS.md
2. AGENTS.autopilot-overlay.md
3. .agent_board/TASK_QUEUE.md
4. .agent_board/CHECKPOINT.md
5. .agent_board/RUN_STATE.md
6. .agent_board/HANDOFF.md

模式：A4-Guarded Sustained Local Autopilot。

第一步只做只读检查：
- git branch --show-current
- git status --short
- git diff --stat
- 查看当前 HEAD 和 tags
- 检查 tests/validation_checklist.md

不要修改文件，除非我明确授权当前任务。

硬边界：
- 不读取真实 VCPChat
- 不读取真实 VCPToolBox
- 不读取真实 manifest
- 不读取 .env / config.env / secrets / logs / user data
- 不调用插件/API/DailyNote
- 不创建图片
- 不创建执行入口
- 不修改 VCPChat/VCPToolBox
- 不写出 workspace root

输出：
1. 你理解的当前任务
2. 当前 repo reality
3. 当前 hard stop gates
4. .agent_board 的下一个安全任务
5. 是否需要人工授权

不要开始写文件。
```
