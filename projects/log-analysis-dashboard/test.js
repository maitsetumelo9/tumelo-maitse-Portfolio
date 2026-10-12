const assert = require("node:assert/strict");
const {parseLogs,analyzeEvents,summarize} = require("./detection-engine.js");
function line(minute,ip,event,user){return `2026-10-11T08:${String(minute).padStart(2,"0")}:00Z,${ip},${event},${user}`;}
const input=[
line("00","192.0.2.10","failed_login","alex"),
line("01","192.0.2.10","failed_login","alex"),
line("02","192.0.2.10","failed_login","alex"),
line("03","192.0.2.10","successful_login","alex"),
line("04","192.0.2.11","failed_login","bob"),
line("05","192.0.2.12","failed_login","bob"),
line("06","192.0.2.13","failed_login","bob"),
line("07","192.0.2.14","failed_login","carol"),
line("08","192.0.2.14","failed_login","dave"),
line("09","192.0.2.14","failed_login","erin"),
line("10","192.0.2.15","privilege_change","admin")
].join("\n");
const parsed=parseLogs(input);
assert.equal(parsed.errors.length,0,"valid fixture should parse");
assert.equal(parsed.events.length,11,"all fixture events should be retained");
const incidents=analyzeEvents(parsed.events);
for(const rule of ["AUTH-01","AUTH-02","AUTH-03","AUTH-04","IAM-01"]) assert.ok(incidents.some(i=>i.ruleId===rule),"expected detection: "+rule);
const summary=summarize(parsed.events,incidents);
assert.equal(summary.totalEvents,11);
assert.equal(summary.failedLogins,9);
assert.equal(summary.successfulLogins,1);
assert.equal(summary.uniqueSources,6);
const malformed=parseLogs([
"not-a-date,192.0.2.1,failed_login,alex",
"2026-10-11T08:00:00Z,999.0.0.1,failed_login,alex",
"2026-10-11T08:00:00Z,192.0.2.1,unknown_event,alex",
"2026-10-11T08:00:00Z,192.0.2.1,failed_login,"
].join("\n"));
assert.equal(malformed.events.length,0);
assert.equal(malformed.errors.length,4,"malformed records should be rejected");
assert.equal(analyzeEvents(parseLogs(line("00","192.0.2.20","successful_login","safe")).events).length,0,"ordinary success should not trigger an incident");
console.log("All Log Analysis Dashboard tests passed.");
