#!/usr/bin/env node
"use strict";

const validator = require("./validators/governance/validate_repository_structure_governance.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
