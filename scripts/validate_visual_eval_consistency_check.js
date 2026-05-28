#!/usr/bin/env node
"use strict";

const validator = require("./validators/visual_eval/validate_visual_eval_consistency_check.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
