"use strict";
const assert = require("node:assert/strict");
const { analyzePassword } = require("./analyzer.js");

const empty = analyzePassword("");
assert.equal(empty.score, 0);
assert.equal(empty.rating, "Not assessed");

const weak = analyzePassword("password123");
assert.ok(weak.score < 55, "predictable short password should not score well");
assert.ok(weak.checks.some(check => check.label.includes("predictable") && !check.pass));

const stronger = analyzePassword("Cobalt!River-Tree-82");
assert.ok(stronger.score > weak.score, "longer varied password should score higher");
assert.equal(stronger.checks.length, 6);

console.log("All password analyzer tests passed.");
