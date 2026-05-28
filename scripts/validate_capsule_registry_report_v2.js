#!/usr/bin/env node
"use strict";

const validator = require("./validators/capsule/validate_capsule_registry_report_v2.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
