#!/usr/bin/env node
"use strict";

const validator = require("./validators/autopilot_governance/validate_autopilot_agent_board_resume_compaction_guard.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
