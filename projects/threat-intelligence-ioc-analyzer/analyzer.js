(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.IOCAnalyzer = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
  const DOMAIN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
  const SHA256 = /^[a-f0-9]{64}$/i;
  const SHA1 = /^[a-f0-9]{40}$/i;
  const MD5 = /^[a-f0-9]{32}$/i;
  const PRIVATE_RANGES = [
    /^10\./, /^127\./, /^169\.254\./, /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./, /^0\./
  ];
  function classify(raw) {
    const value = String(raw ?? "").trim().replace(/^["']|["']$/g, "");
    if (!value) return { value, type: "empty", risk: "none", reason: "Empty indicator." };
    if (IPV4.test(value)) {
      const privateIP = PRIVATE_RANGES.some((range) => range.test(value));
      return { value, type: "IPv4", risk: privateIP ? "context" : "review", reason: privateIP ? "Private, loopback, link-local, or reserved-style address; context matters." : "Public-looking IPv4 address; reputation has not been checked." };
    }
    if (SHA256.test(value)) return { value, type: "SHA-256", risk: "review", reason: "Hash format matches SHA-256; this tool cannot determine whether the file is malicious." };
    if (SHA1.test(value)) return { value, type: "SHA-1", risk: "review", reason: "Hash format matches SHA-1; this tool cannot determine whether the file is malicious." };
    if (MD5.test(value)) return { value, type: "MD5", risk: "review", reason: "Hash format matches MD5; this tool cannot determine whether the file is malicious." };
    if (/^https?:\/\//i.test(value)) {
      try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase();
        const reasons = [];
        if (url.protocol === "http:") reasons.push("uses unencrypted HTTP");
        if (url.username || url.password) reasons.push("contains URL-embedded credentials");
        if (hostname.startsWith("xn--") || hostname.split(".").some((part) => part.startsWith("xn--"))) reasons.push("contains an internationalized/punycode hostname");
        if (reasons.length) return { value, type: "URL", risk: "review", reason: reasons.join("; ") + ". These are review signals, not proof of maliciousness." };
        return { value, type: "URL", risk: "context", reason: "Valid URL format; content and reputation have not been checked." };
      } catch (_) { return { value, type: "URL-like invalid", risk: "invalid", reason: "URL could not be parsed." }; }
    }
    if (DOMAIN.test(value)) {
      const lower = value.toLowerCase();
      const signals = [];
      if (lower.split(".").length >= 5) signals.push("many subdomain levels");
      if (lower.split(".").some((part) => part.length >= 25)) signals.push("unusually long label");
      return { value, type: "Domain", risk: signals.length ? "review" : "context", reason: signals.length ? signals.join("; ") + ". These signals need analyst context." : "Valid domain format; DNS and reputation have not been checked." };
    }
    return { value, type: "Unrecognised", risk: "invalid", reason: "Does not match the supported IPv4, domain, URL, MD5, SHA-1, or SHA-256 formats." };
  }
  function analyze(input) {
    const lines = Array.isArray(input) ? input : String(input ?? "").split(/\r?\n/);
    const seen = new Set();
    const results = [];
    const errors = [];
    for (let i = 0; i < lines.length; i++) {
      const raw = String(lines[i] ?? "").trim();
      if (!raw || raw.startsWith("#")) continue;
      const item = classify(raw);
      if (item.risk === "invalid") errors.push({ line: i + 1, value: raw, message: item.reason });
      const key = item.value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ ...item, line: i + 1 });
    }
    const counts = results.reduce((acc, item) => {
      acc[item.risk] = (acc[item.risk] || 0) + 1;
      return acc;
    }, {});
    return { generatedAt: new Date().toISOString(), total: results.length, counts, results, errors,
      disclaimer: "Format and heuristic checks only. No network requests or reputation lookups were performed. A risk label is not a verdict that an indicator is malicious." };
  }
  return { classify, analyze };
});
