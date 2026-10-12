import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const CORE = window.JobTrackCore;
const CONFIG_KEY = "jobtrack-supabase-config-v1";
let supabase = null;
let authSubscription = null;
let currentUser = null;
let applications = [];
const $ = (id) => document.getElementById(id);
const statusOptions = CORE.STATUSES;

function showMessage(message, isError = false) {
  const node = $("feedback");
  node.textContent = message;
  node.dataset.kind = isError ? "error" : "success";
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}
function getConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || "null"); }
  catch { return null; }
}
function showSetup(show) {
  $("setupPanel").hidden = !show;
  $("authPanel").hidden = show || Boolean(currentUser);
  $("trackerPanel").hidden = show || !currentUser;
  $("sessionBar").hidden = show || !currentUser;
}
function connectFromSavedConfig() {
  const config = getConfig();
  if (!config?.url || !config?.publishableKey) {
    showSetup(true);
    return false;
  }
  if (CORE.isServiceRoleKey(config.publishableKey)) {
    showSetup(true);
    showMessage("This saved key is a secret/service-role key. Remove it and enter a publishable or anon key instead.", true);
    return false;
  }
  try {
    const url = new URL(config.url);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co")) {
      throw new Error("Use the HTTPS URL for your Supabase project.");
    }
    supabase = createClient(url.origin, config.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    showSetup(false);
    return true;
  } catch (error) {
    showSetup(true);
    showMessage(error.message || "Supabase configuration is invalid.", true);
    return false;
  }
}
function statusSelect(selected, id) {
  return '<select data-status="' + escapeHtml(id) + '" aria-label="Update application status">' +
    statusOptions.map((s) => '<option' + (s === selected ? " selected" : "") + ">" + s + "</option>").join("") +
    "</select>";
}
function render() {
  const count = (status) => applications.filter((a) => a.status === status).length;
  $("allCount").textContent = applications.length;
  $("appliedCount").textContent = count("Applied");
  $("interviewCount").textContent = count("Interview") + count("Assessment");
  $("offerCount").textContent = count("Offer");
  const query = $("search").value.trim().toLowerCase();
  const filter = $("filter").value;
  const list = applications.filter((a) =>
    (!filter || a.status === filter) &&
    (a.company + " " + a.role).toLowerCase().includes(query)
  ).sort((a, b) => b.application_date.localeCompare(a.application_date));

  if (!list.length) {
    $("jobs").innerHTML = '<p class="muted">No matching applications. Add one above or change the filters.</p>';
    return;
  }
  $("jobs").innerHTML = list.map((a) =>
    '<article class="job"><div><h3>' + escapeHtml(a.role) + ' <span class="status">' + escapeHtml(a.status) +
    '</span></h3><strong>' + escapeHtml(a.company) + '</strong><br><small>Application date: ' +
    escapeHtml(a.application_date) + (a.follow_up_date ? " · Follow up: " + escapeHtml(a.follow_up_date) : "") +
    '</small>' + (a.notes ? "<p>" + escapeHtml(a.notes) + "</p>" : "") +
    (a.job_url ? '<p><a href="' + escapeHtml(a.job_url) + '" target="_blank" rel="noopener noreferrer">Open job listing ↗</a></p>' : "") +
    '</div><div class="jobControls">' + statusSelect(a.status, a.id) +
    '<button class="danger" data-delete="' + escapeHtml(a.id) + '">Delete</button></div></article>'
  ).join("");

  document.querySelectorAll("[data-status]").forEach((node) => {
    node.addEventListener("change", async () => {
      const { error } = await supabase.from("job_applications")
        .update({ status: node.value, updated_at: new Date().toISOString() })
        .eq("id", node.dataset.status).select("id").single();
      if (error) return showMessage(error.message, true);
      await loadApplications();
      showMessage("Application status updated.");
    });
  });
  document.querySelectorAll("[data-delete]").forEach((node) => {
    node.addEventListener("click", async () => {
      if (!confirm("Delete this application? This cannot be undone.")) return;
      const { error } = await supabase.from("job_applications").delete().eq("id", node.dataset.delete);
      if (error) return showMessage(error.message, true);
      await loadApplications();
      showMessage("Application deleted.");
    });
  });
}
async function loadApplications() {
  const { data, error } = await supabase.from("job_applications")
    .select("id,company,role,application_date,status,follow_up_date,job_url,notes,created_at")
    .order("application_date", { ascending: false });
  if (error) {
    showMessage("Could not load applications. Confirm the SQL migration is applied and RLS is enabled. " + error.message, true);
    applications = [];
  } else applications = data || [];
  render();
}
function watchAuthState() {
  if (authSubscription) authSubscription.unsubscribe();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const nextUser = session?.user || null;
    currentUser = nextUser;
    $("sessionBar").hidden = !nextUser;
    $("authPanel").hidden = Boolean(nextUser);
    $("trackerPanel").hidden = !nextUser;
    $("signedInAs").textContent = nextUser?.email || "";

    // Avoid issuing Supabase queries inside the auth callback itself; defer
    // data loading until the callback has returned.
    window.setTimeout(() => {
      if (nextUser && currentUser?.id === nextUser.id) void loadApplications();
      else if (!nextUser && !currentUser) { applications = []; render(); }
    }, 0);
  });
  authSubscription = data.subscription;
}

async function refreshSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) showMessage(error.message, true);
  currentUser = data?.session?.user || null;
  showSetup(false);
  $("sessionBar").hidden = !currentUser;
  $("authPanel").hidden = Boolean(currentUser);
  $("trackerPanel").hidden = !currentUser;
  $("signedInAs").textContent = currentUser ? currentUser.email : "";
  if (currentUser) await loadApplications();
  else applications = [];
}
$("setupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const url = $("projectUrl").value.trim().replace(/\/$/, "");
  const publishableKey = $("publishableKey").value.trim();
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".supabase.co")) {
      throw new Error("Use the HTTPS Project URL ending in .supabase.co.");
    }
    if (!publishableKey || CORE.isServiceRoleKey(publishableKey)) {
      throw new Error("Use a publishable/anon key only. Never enter a secret or service_role key, including legacy JWT service-role keys.");
    }
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: parsed.origin, publishableKey }));
    if (connectFromSavedConfig()) {
      $("projectUrl").value = "";
      $("publishableKey").value = "";
      watchAuthState();
      showMessage("Connection settings saved in this browser. Sign in to continue.");
      refreshSession();
    }
  } catch (error) { showMessage(error.message || "Invalid configuration.", true); }
});
$("changeConfig").addEventListener("click", () => {
  const config = getConfig();
  $("projectUrl").value = config?.url || "";
  $("publishableKey").value = config?.publishableKey || "";
  showSetup(true);
});
$("authMode").addEventListener("click", () => {
  const signup = $("authMode").dataset.mode !== "signup";
  $("authMode").dataset.mode = signup ? "signup" : "signin";
  $("authMode").textContent = signup ? "Already registered? Sign in" : "Need an account? Create one";
  $("authSubmit").textContent = signup ? "Create account" : "Sign in";
  $("authTitle").textContent = signup ? "Create your account" : "Sign in";
});
$("authForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase && !connectFromSavedConfig()) return showMessage("Configure your Supabase project first.", true);
  const email = $("email").value.trim();
  const password = $("password").value;
  if (password.length < 8) return showMessage("Use a password with at least 8 characters.", true);
  const isSignup = $("authMode").dataset.mode === "signup";
  const result = isSignup
    ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.href } })
    : await supabase.auth.signInWithPassword({ email, password });
  if (result.error) return showMessage(result.error.message, true);
  if (isSignup && !result.data.session) {
    showMessage("Account created. Check your email to confirm it, then sign in.");
    return;
  }
  showMessage(isSignup ? "Account created and signed in." : "Signed in.");
  await refreshSession();
});
$("signOut").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return showMessage(error.message, true);
  currentUser = null;
  applications = [];
  showSetup(false);
  $("authPanel").hidden = false;
  $("trackerPanel").hidden = true;
  $("sessionBar").hidden = true;
  render();
  showMessage("Signed out.");
});
$("jobForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const application = CORE.validateApplication({
      company: $("company").value,
      role: $("role").value,
      application_date: $("date").value,
      status: $("status").value,
      follow_up_date: $("follow").value || null,
      job_url: $("url").value,
      notes: $("notes").value
    });
    const { error } = await supabase.from("job_applications").insert(application);
    if (error) throw error;
    event.target.reset();
    $("date").value = new Date().toISOString().slice(0, 10);
    await loadApplications();
    showMessage("Application saved to your account.");
  } catch (error) { showMessage(error.message || "Could not save application.", true); }
});
$("search").addEventListener("input", render);
$("filter").addEventListener("change", render);
$("export").addEventListener("click", () => {
  const blob = new Blob([CORE.toCsv(applications)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "jobtrack-applications.csv";
  anchor.click();
  URL.revokeObjectURL(url);
});
$("date").value = new Date().toISOString().slice(0, 10);

if (connectFromSavedConfig()) {
  watchAuthState();
  refreshSession();
}
