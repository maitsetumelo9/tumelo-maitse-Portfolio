const assert=require("node:assert/strict");
const {parseLogs,analyzeEvents,summarize}=require("../log-analysis-dashboard/detection-engine.js");
const cases={
 spray:[
 "2026-10-11T08:00:00Z,192.0.2.44,failed_login,alex",
 "2026-10-11T08:01:00Z,192.0.2.44,failed_login,blair",
 "2026-10-11T08:02:00Z,192.0.2.44,failed_login,casey",
 "2026-10-11T08:03:00Z,192.0.2.44,failed_login,drew",
 "2026-10-11T08:04:00Z,192.0.2.44,failed_login,erin"].join("\n"),
 success:[
 "2026-10-11T09:00:00Z,192.0.2.77,failed_login,alex",
 "2026-10-11T09:02:00Z,192.0.2.77,failed_login,alex",
 "2026-10-11T09:04:00Z,192.0.2.77,failed_login,alex",
 "2026-10-11T09:05:00Z,192.0.2.77,successful_login,alex"].join("\n"),
 change:"2026-10-11T11:02:00Z,192.0.2.20,privilege_change,admin"
};
const spray=parseLogs(cases.spray);assert.equal(spray.errors.length,0);assert.ok(analyzeEvents(spray.events).some(x=>x.ruleId==="AUTH-02"),"CASE-001 should flag multiple accounts targeted");
const success=parseLogs(cases.success);assert.ok(analyzeEvents(success.events).some(x=>x.ruleId==="AUTH-04"),"CASE-002 should flag success after repeated failures");
const change=parseLogs(cases.change);assert.deepEqual(analyzeEvents(change.events).map(x=>x.ruleId),["IAM-01"],"CASE-003 should only flag privilege change for review");
assert.equal(summarize(success.events,analyzeEvents(success.events)).successfulLogins,1);
console.log("SOC Analyst Investigation Lab tests passed for all three synthetic case files.");
