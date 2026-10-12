/* 0xDev Log Analysis Engine: offline educational heuristics, not proof of compromise. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LogAnalysisEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const VALID_EVENTS = new Set(["failed_login", "successful_login", "password_reset", "account_locked", "access_denied", "privilege_change"]);
  const FIVE_MIN = 5 * 60 * 1000, TEN_MIN = 10 * 60 * 1000, FIFTEEN_MIN = 15 * 60 * 1000;

  function validIPv4(ip) {
    const parts = ip.split(".");
    return parts.length === 4 && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
  }
  function parseLogs(input) {
    const events = [], errors = [];
    String(input || "").split(/\r?\n/).forEach((raw, index) => {
      const line = raw.trim(); if (!line) return;
      const parts = line.split(",").map(part => part.trim());
      if (parts.length !== 4) { errors.push({line:index+1,message:"Expected four comma-separated fields"}); return; }
      const [timestamp,sourceIp,eventRaw,username] = parts, time = Date.parse(timestamp);
      if (!/^\d{4}-\d{2}-\d{2}T/.test(timestamp) || !Number.isFinite(time)) { errors.push({line:index+1,message:"Timestamp must be a valid ISO 8601 date/time"}); return; }
      if (!validIPv4(sourceIp)) { errors.push({line:index+1,message:"Source IP must be a valid IPv4 address"}); return; }
      const eventType = eventRaw.toLowerCase();
      if (!VALID_EVENTS.has(eventType)) { errors.push({line:index+1,message:"Unsupported event type: "+eventRaw}); return; }
      if (!username || username.length > 100) { errors.push({line:index+1,message:"Username must contain 1–100 characters"}); return; }
      events.push({timestamp,time,sourceIp,eventType,username,line:index+1});
    });
    events.sort((a,b)=>a.time-b.time || a.line-b.line);
    return {events,errors};
  }
  function withinWindow(events, anchor, predicate, windowMs) {
    return events.filter(e=>predicate(e) && e.time<=anchor.time && anchor.time-e.time<=windowMs);
  }
  function makeIncident(ruleId,title,severity,confidence,summary,evidence,recommendation) {
    return {ruleId,title,severity,confidence,summary,evidence,recommendation};
  }
  function analyzeEvents(events) {
    const incidents=[], seen=new Set();
    function add(item,key){if(!seen.has(key)){seen.add(key);incidents.push(item);}}
    events.filter(e=>e.eventType==="failed_login").forEach(anchor=>{
      const hits=withinWindow(events,anchor,e=>e.eventType==="failed_login"&&e.sourceIp===anchor.sourceIp,FIVE_MIN);
      if(hits.length>=3) add(makeIncident("AUTH-01","Repeated login failures from one source","high","medium",hits.length+" failed logins from "+anchor.sourceIp+" within five minutes.",hits,"Check timing, source ownership, affected accounts, and expected activity. Do not block an address based on this heuristic alone."),"AUTH-01|"+anchor.sourceIp);
    });
    events.filter(e=>e.eventType==="failed_login").forEach(anchor=>{
      const hits=withinWindow(events,anchor,e=>e.eventType==="failed_login"&&e.sourceIp===anchor.sourceIp,TEN_MIN);
      const users=[...new Set(hits.map(e=>e.username))];
      if(users.length>=3) add(makeIncident("AUTH-02","Multiple accounts targeted by one source","high","medium",anchor.sourceIp+" generated failures against "+users.length+" accounts within ten minutes.",hits,"Review whether attempts are spread across accounts, compare with authorised testing, and look for related activity from other sources."),"AUTH-02|"+anchor.sourceIp);
    });
    events.filter(e=>e.eventType==="failed_login").forEach(anchor=>{
      const hits=withinWindow(events,anchor,e=>e.eventType==="failed_login"&&e.username===anchor.username,TEN_MIN);
      const ips=[...new Set(hits.map(e=>e.sourceIp))];
      if(ips.length>=3) add(makeIncident("AUTH-03","One account targeted from multiple sources","high","medium","Account "+anchor.username+" received failures from "+ips.length+" source IPs within ten minutes.",hits,"Check for distributed guessing, VPN/proxy effects, and legitimate travel or shared networks. Follow your account-protection procedure."),"AUTH-03|"+anchor.username);
    });
    events.filter(e=>e.eventType==="successful_login").forEach(anchor=>{
      const hits=withinWindow(events,anchor,e=>e.eventType==="failed_login"&&e.sourceIp===anchor.sourceIp&&e.username===anchor.username,FIFTEEN_MIN);
      if(hits.length>=3) add(makeIncident("AUTH-04","Successful login after repeated failures","critical","medium","A successful login for "+anchor.username+" from "+anchor.sourceIp+" followed "+hits.length+" failures within fifteen minutes.",hits.concat(anchor).sort((a,b)=>a.time-b.time),"Prioritise review of account/session activity and MFA. Confirm with the account owner before disruptive action."),"AUTH-04|"+anchor.sourceIp+"|"+anchor.username+"|"+anchor.time);
    });
    events.filter(e=>e.eventType==="privilege_change").forEach(e=>add(makeIncident("IAM-01","Privilege change recorded","medium","low","A privilege-change event was recorded for account "+e.username+".",[e],"Verify the change against an approved request and review the actor, target, and audit trail. This event alone does not establish misuse."),"IAM-01|"+e.line));
    const order={critical:0,high:1,medium:2,low:3};
    return incidents.sort((a,b)=>order[a.severity]-order[b.severity]||a.ruleId.localeCompare(b.ruleId));
  }
  function summarize(events,incidents){
    return {totalEvents:events.length,failedLogins:events.filter(e=>e.eventType==="failed_login").length,successfulLogins:events.filter(e=>e.eventType==="successful_login").length,uniqueSources:new Set(events.map(e=>e.sourceIp)).size,uniqueAccounts:new Set(events.map(e=>e.username)).size,critical:incidents.filter(i=>i.severity==="critical").length,high:incidents.filter(i=>i.severity==="high").length,medium:incidents.filter(i=>i.severity==="medium").length};
  }
  return {parseLogs,analyzeEvents,summarize,validIPv4};
});
