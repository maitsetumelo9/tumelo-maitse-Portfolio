(() => {
  "use strict";
  const passwordInput = document.querySelector("#password");
  const toggleButton = document.querySelector("#toggle");
  const rating = document.querySelector("#rating");
  const scoreLabel = document.querySelector("#score");
  const meterFill = document.querySelector("#meter-fill");
  const summary = document.querySelector("#summary");
  const checksList = document.querySelector("#checks");

  function analyzePassword(password) {
    const checks = [
      { label: "At least 12 characters", pass: password.length >= 12, points: 30 },
      { label: "At least 16 characters", pass: password.length >= 16, points: 10 },
      { label: "Contains lowercase and uppercase letters", pass: /[a-z]/.test(password) && /[A-Z]/.test(password), points: 15 },
      { label: "Contains numbers", pass: /\d/.test(password), points: 10 },
      { label: "Contains symbols", pass: /[^A-Za-z0-9]/.test(password), points: 15 },
      { label: "Avoids common predictable words and sequences", pass: !/(password|qwerty|letmein|admin|welcome|123456|abcdef|iloveyou)/i.test(password), points: 20 }
    ];
    if (!password) return { score: 0, rating: "Not assessed", checks: [], summary: "Enter a sample to see feedback." };
    const score = Math.min(100, checks.reduce((sum, check) => sum + (check.pass ? check.points : 0), 0));
    const level = score < 30 ? "Weak" : score < 55 ? "Fair" : score < 80 ? "Good" : "Strong";
    const advice = score < 55
      ? "Try a longer, unique passphrase and avoid familiar words or sequences."
      : score < 80
        ? "Good progress. Increase length and avoid predictable patterns."
        : "These checks look promising. Use a unique password and a password manager.";
    return { score, rating: level, checks, summary: advice };
  }

  function render() {
    const result = analyzePassword(passwordInput.value);
    rating.textContent = result.rating;
    scoreLabel.textContent = result.score + " / 100";
    meterFill.style.width = result.score + "%";
    meterFill.style.background = result.score < 30 ? "var(--red)" : result.score < 55 ? "var(--amber)" : "var(--green)";
    summary.textContent = result.summary;
    checksList.replaceChildren();
    if (!result.checks.length) {
      const item = document.createElement("li");
      item.textContent = "Enter a sample password to run checks.";
      checksList.append(item);
      return;
    }
    result.checks.forEach(check => {
      const item = document.createElement("li");
      item.className = check.pass ? "pass" : "fail";
      item.textContent = (check.pass ? "✓ " : "○ ") + check.label;
      checksList.append(item);
    });
  }

  passwordInput.addEventListener("input", render);
  toggleButton.addEventListener("click", () => {
    const showing = passwordInput.type === "password";
    passwordInput.type = showing ? "text" : "password";
    toggleButton.textContent = showing ? "Hide" : "Show";
    toggleButton.setAttribute("aria-pressed", String(showing));
  });
  render();

  // Export the pure analyzer for optional Node-based tests.
  if (typeof module !== "undefined" && module.exports) module.exports = { analyzePassword };
})();
