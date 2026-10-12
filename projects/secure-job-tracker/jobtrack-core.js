(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.JobTrackCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const STATUSES = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected"];
  const LIMITS = { company: 100, role: 120, notes: 1000 };

  function cleanText(value, maxLength) {
    if (typeof value !== "string") throw new TypeError("Expected text.");
    const text = value.trim();
    if (!text || text.length > maxLength) throw new Error("Text is empty or exceeds its length limit.");
    return text;
  }

  function isValidIsoDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number(value.slice(0, 4)) < 1) {
      return false;
    }
    const parsed = new Date(value + "T00:00:00.000Z");
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }

  function isServiceRoleKey(value) {
    if (typeof value !== "string") return false;
    const key = value.trim();
    if (/^(?:sb_secret_|service_role(?:$|_))/i.test(key)) return true;

    // Older Supabase keys are JWTs. Decode only the payload to reject a key
    // whose role is service_role; never log or persist it.
    const parts = key.split(".");
    if (parts.length !== 3) return false;
    try {
      let encoded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      encoded += "=".repeat((4 - encoded.length % 4) % 4);
      const payload = JSON.parse(atob(encoded));
      return payload.role === "service_role";
    } catch {
      return false;
    }
  }

  function validateApplication(input) {
    if (!input || typeof input !== "object") throw new TypeError("Application must be an object.");
    const company = cleanText(input.company, LIMITS.company);
    const role = cleanText(input.role, LIMITS.role);
    const notes = typeof input.notes === "string" ? input.notes.trim() : "";
    if (notes.length > LIMITS.notes) throw new Error("Notes exceed 1,000 characters.");
    const status = input.status || "Saved";
    if (!STATUSES.includes(status)) throw new Error("Choose a supported application status.");
    const date = String(input.application_date || "");
    if (!isValidIsoDate(date)) throw new Error("Application date must be a real calendar date in YYYY-MM-DD format.");
    const followUp = input.follow_up_date ? String(input.follow_up_date) : null;
    if (followUp && !isValidIsoDate(followUp)) {
      throw new Error("Follow-up date must be a real calendar date in YYYY-MM-DD format.");
    }
    const jobUrl = input.job_url ? String(input.job_url).trim() : "";
    if (jobUrl) {
      let parsed;
      try { parsed = new URL(jobUrl); } catch { throw new Error("Job link must be a valid HTTP or HTTPS URL."); }
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Job link must use HTTP or HTTPS.");
    }
    return { company, role, application_date: date, status, follow_up_date: followUp, job_url: jobUrl || null, notes };
  }

  function csvCell(value) {
    let text = String(value == null ? "" : value);
    // Prefix potentially executable spreadsheet formulas before CSV quoting.
    if (/^[\u0000-\u0020]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function toCsv(applications) {
    const headers = ["Company", "Role", "Application date", "Status", "Follow-up date", "Job link", "Notes"];
    const rows = applications.map((a) => [
      a.company, a.role, a.application_date, a.status, a.follow_up_date, a.job_url, a.notes
    ]);
    return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  }

  return { STATUSES, LIMITS, validateApplication, isValidIsoDate, isServiceRoleKey, csvCell, toCsv };
});
