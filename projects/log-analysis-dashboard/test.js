const assert = require("node:assert/strict");
const {parseLogs,analyzeEvents,summarize,validIPv4} = require("./detection-engine.js");
function line(minute,ip,event,user,hour="08") { return `2026-10-11T${hour}:${String(minute).padStart(2,"0")}:00Z,${ip},${event},${user}`; }

// Representative multi-signal incident fixture: all five rules must fire.
const input=[
 line(0,"192.0.2.10","failed_login","alex"),
 line(1,"192.0.2.10","failed_login","alex"),
 line(2,"192.0.2.10","failed_login","alex"),
 line(3,"192.0.2.10","successful_login","alex"),
 line(4,"192.0.2.11","failed_login","bob"),
 line(5,"192.0.2.12","failed_login","bob"),
 line(6,"192.0.2.13","failed_login","bob"),
 line(7,"192.0.2.14","failed_login","carol"),
 line(8,"192.0.2.14","failed_login","dave"),
 line(9,"192.0.2.14","failed_login","erin"),
 line(10,"192.0.2.15","privilege_change","admin")
].join("\n");
const parsed=parseLogs(input);
assert.equal(parsed.errors.length,0,"valid fixture should parse");
assert.equal(parsed.events.length,11,"all fixture events should be retained");
assert.deepEqual(parsed.events.map(e=>e.time),[...parsed.events.map(e=>e.time)].sort((a,b)=>a-b),"events must be chronological");
const incidents=analyzeEvents(parsed.events);
for(const rule of ["AUTH-01","AUTH-02","AUTH-03","AUTH-04","IAM-01"]) assert.ok(incidents.some(i=>i.ruleId===rule),"expected detection: "+rule);
assert.ok(incidents.every(i=>i.evidence.length>0 && i.recommendation.length>0),"every alert should include evidence and an action");
assert.ok(incidents.some(i=>i.severity==="critical"),"success after repeated failures should be critical");
const summary=summarize(parsed.events,incidents);
assert.equal(summary.totalEvents,11);
assert.equal(summary.failedLogins,9);
assert.equal(summary.successfulLogins,1);
assert.equal(summary.uniqueSources,6);
assert.equal(summary.uniqueAccounts,6);

// Validation rejects malformed timestamps, IPv4, event names, and usernames.
const malformed=parseLogs([
 "not-a-date,192.0.2.1,failed_login,alex",
 "2026-10-11T08:00:00Z,999.0.0.1,failed_login,alex",
 "2026-10-11T08:00:00Z,192.0.2.1,unknown_event,alex",
 "2026-10-11T08:00:00Z,192.0.2.1,failed_login,",
 "2026-10-11T08:00:00Z,192.0.2.1,failed_login,"+"x".repeat(101),
 "2026-10-11T08:00:00Z,192.0.2.1,failed_login,alex,extra"
].join("\n"));
assert.equal(malformed.events.length,0);
assert.equal(malformed.errors.length,6,"all malformed records should be rejected");
assert.equal(validIPv4("192.0.2.255"),true);
assert.equal(validIPv4("256.0.2.1"),false);
assert.equal(validIPv4("192.0.2"),false);
assert.equal(validIPv4("192.0.2.-1"),false);

// Benign activity should not trigger rules, and thresholds should not fire early.
const normal=parseLogs([
 line(0,"192.0.2.20","successful_login","safe"),
 line(1,"192.0.2.20","failed_login","safe"),
 line(2,"192.0.2.21","failed_login","safe")
].join("\n"));
assert.equal(analyzeEvents(normal.events).length,0,"normal success and fewer than three failures should not trigger");
const twoFailures=parseLogs([line(0,"192.0.2.30","failed_login","pat"),line(1,"192.0.2.30","failed_login","pat")].join("\n"));
assert.equal(analyzeEvents(twoFailures.events).length,0,"two failures must not satisfy the three-failure threshold");

// Events outside the correlation window should not be combined into one alert.
const oldAndNew=parseLogs([
 "2026-10-11T08:00:00Z,192.0.2.40,failed_login,sam",
 "2026-10-11T08:01:00Z,192.0.2.40,failed_login,sam",
 "2026-10-11T08:02:00Z,192.0.2.40,failed_login,sam",
 "2026-10-11T09:00:00Z,192.0.2.40,successful_login,sam"
].join("\n"));
assert.equal(analyzeEvents(oldAndNew.events).some(i=>i.ruleId==="AUTH-04"),false,"success an hour later must not match a 15-minute rule");

// Duplicate records should not create duplicate findings for the same rule/key.
const duplicate=parseLogs([line(0,"192.0.2.50","failed_login","lee"),line(1,"192.0.2.50","failed_login","lee"),line(2,"192.0.2.50","failed_login","lee"),line(3,"192.0.2.50","failed_login","lee")].join("\n"));
const duplicateAlerts=analyzeEvents(duplicate.events).filter(i=>i.ruleId==="AUTH-01");
assert.equal(duplicateAlerts.length,1,"one source should yield one deduplicated AUTH-01 finding");
console.log("All Log Analysis Dashboard tests passed (validation, five detections, evidence, thresholds, time windows, false positives, and deduplication).");
