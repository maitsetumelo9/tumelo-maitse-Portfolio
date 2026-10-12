const assert = require("node:assert/strict");
const core = require("./jobtrack-core.js");

const valid = {
  company: "Example Ltd",
  role: "Junior Security Analyst",
  application_date: "2026-10-12",
  status: "Applied",
  follow_up_date: "2026-10-20",
  job_url: "https://example.com/jobs/123",
  notes: "Send follow-up email"
};

assert.deepEqual(core.validateApplication(valid), valid);
assert.throws(() => core.validateApplication({ ...valid, company: " ".repeat(2) }), /empty|length/i);
assert.throws(() => core.validateApplication({ ...valid, role: "R".repeat(121) }), /empty|length/i);
assert.throws(() => core.validateApplication({ ...valid, status: "Admin" }), /status/i);
assert.throws(() => core.validateApplication({ ...valid, application_date: "not-a-date" }), /date/i);
assert.throws(() => core.validateApplication({ ...valid, follow_up_date: "2026-99-99" }), /date/i);
assert.throws(() => core.validateApplication({ ...valid, job_url: "javascript:alert(1)" }), /HTTP or HTTPS/i);
assert.throws(() => core.validateApplication({ ...valid, notes: "n".repeat(1001) }), /1,000/i);
assert.equal(core.csvCell("normal text"), '"normal text"');
assert.equal(core.csvCell('say "hi"'), '"say ""hi"""');
assert.equal(core.csvCell("=HYPERLINK(\"https://bad.example\")"), '"\'=HYPERLINK(""https://bad.example"")"');
const csv = core.toCsv([{ ...valid, company: "=1+1" }]);
assert.match(csv, /"'=1\+1"/);
assert.match(csv, /Company,Role,Application date/);
console.log("JobTrack core tests passed.");
