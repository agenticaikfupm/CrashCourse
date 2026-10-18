/* Agentic AI Governance: control-layer diagram and approval policy simulator.
   The risk policy mirrors examples/gov_human_approval.py. */
(function () {
  "use strict";

  const LAYERS = {
    title: "Defense in depth: where controls sit around an agent",
    width: 1000, height: 330, minWidth: 680, legend: true,
    nodes: [
      { id: "req", label: "Request", sub: "user or event", x: 70, y: 110, w: 120, kind: "user" },
      { id: "ing", label: "Input guardrails", sub: "injection, scope", x: 235, y: 110, w: 160, kind: "human" },
      { id: "agent", label: "Agent", sub: "LLM + memory", x: 405, y: 110, w: 140, kind: "llm" },
      { id: "perm", label: "Tool permissions", sub: "allowlist, limits", x: 575, y: 110, w: 160, kind: "human" },
      { id: "hitl", label: "Human approval", sub: "high-risk only", x: 575, y: 235, w: 160, kind: "human" },
      { id: "act", label: "Action", sub: "tool call", x: 745, y: 110, w: 120, kind: "tool" },
      { id: "outg", label: "Output guardrails", sub: "PII, policy", x: 905, y: 110, w: 160, kind: "human" },
      { id: "log", label: "Logging, monitoring, and evaluation", sub: "traces, metrics, alerts, audits", x: 405, y: 260, w: 330, kind: "data" }
    ],
    edges: [
      { from: "req", to: "ing" }, { from: "ing", to: "agent" }, { from: "agent", to: "perm" },
      { from: "perm", to: "act", label: "low risk" },
      { from: "perm", to: "hitl", label: "high risk" },
      { from: "hitl", to: "act", label: "approved" },
      { from: "act", to: "outg" },
      { from: "agent", to: "log", dashed: true, label: "every step is traced" }
    ],
    steps: [
      { nodes: ["req", "ing"], edges: ["req>ing"], text: "<strong>Input guardrails</strong> block obvious attacks (\"ignore previous instructions\") and out-of-scope requests before the model sees them." },
      { nodes: ["agent"], edges: ["ing>agent"], text: "The <strong>agent</strong> reasons and proposes an action. It is treated as untrusted until checked." },
      { nodes: ["perm"], edges: ["agent>perm"], text: "<strong>Tool permissions</strong> check the proposed call against an allowlist, argument rules, and spending or rate limits." },
      { nodes: ["act"], edges: ["perm>act"], text: "Low-risk actions, such as reading a calendar, run automatically." },
      { nodes: ["hitl", "act"], edges: ["perm>hitl", "hitl>act"], text: "High-risk actions, such as sending external email or spending money, wait for <strong>human approval</strong>." },
      { nodes: ["outg"], edges: ["act>outg"], text: "<strong>Output guardrails</strong> remove personal data and check policy before anything leaves the system." },
      { nodes: ["log"], edges: ["agent>log"], text: "Throughout, <strong>logs and traces</strong> feed monitoring dashboards, alerts, evaluations, and audits." }
    ]
  };

  const RISK = { read: 1, draft: 1, send_email: 3, spend_money: 4, delete: 5 };
  const NAMES = { read: "Read data", draft: "Draft a message", send_email: "Send an email", spend_money: "Spend money", delete: "Delete records" };

  function initSimulator() {
    const form = document.getElementById("approval-form");
    const out = document.getElementById("approval-result");
    if (!form || !out) return;
    const amountRow = document.getElementById("amount-row");
    function update() {
      const type = form.action.value;
      const amount = Number(form.amount.value || 0);
      const external = form.external.checked;
      const threshold = Number(form.threshold.value);
      amountRow.hidden = type !== "spend_money";
      document.getElementById("threshold-value").textContent = threshold;
      let score = RISK[type];
      const why = [`base risk of "${NAMES[type]}" is ${score}`];
      if (type === "spend_money" && amount > 500) { score = 5; why.push("amount above the 500 SAR limit raises risk to 5"); }
      if (external) { score += 1; why.push("external recipient adds 1"); }
      score = Math.min(score, 5);
      const needs = score >= threshold;
      out.className = "decision-result " + (needs ? "d-manual_review" : "d-approve");
      out.innerHTML = `<span class="kicker">Policy result</span>
        Risk score <strong>${score} / 5</strong>: ${needs ? "<strong>needs human approval</strong>" : "<strong>runs automatically</strong> (and is logged)"}.
        <span class="small muted" style="display:block;margin-top:.3rem">Why: ${why.join("; ")}. Approval threshold is ${threshold}.</span>`;
    }
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", e => e.preventDefault());
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSimulator();
    const fig = document.getElementById("layers-diagram");
    if (fig && window.FlowDiagram) window.FlowDiagram.create(fig, LAYERS);
  });
})();
