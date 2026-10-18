/* Decision APIs: architecture diagram and a live decision-table demo.
   RULES mirrors examples/dec_rules_engine.py so learners can compare. */
(function () {
  "use strict";

  const RULES = [
    { id: "R1", when: [["safety_training", "==", false]], then: "reject", why: "Safety training is required" },
    { id: "R2", when: [["hazard_level", "==", "high"]], then: "manual_review", why: "High-hazard equipment needs a supervisor" },
    { id: "R3", when: [["hours", ">", 8]], then: "manual_review", why: "Long bookings need approval" },
    { id: "R4", when: [["role", "in", ["faculty", "researcher"]]], then: "approve", why: "Staff with training may book" },
    { id: "R5", when: [["role", "==", "student"], ["hours", "<=", 4]], then: "approve", why: "Short student bookings are fine" },
    { id: "R6", when: [], then: "manual_review", why: "Default rule" }
  ];
  const OPS = {
    "==": (a, b) => a === b, ">": (a, b) => a > b, "<=": (a, b) => a <= b, "in": (a, b) => b.includes(a)
  };
  const LABEL = { approve: "Approve", reject: "Reject", manual_review: "Manual review" };

  function condText(c) {
    const [f, op, v] = c;
    const val = Array.isArray(v) ? v.join(" or ") : String(v);
    return op === "in" ? `${f} is ${val}` : `${f} ${op} ${val}`;
  }

  function decide(facts) {
    for (const r of RULES) {
      if (r.when.every(([f, op, v]) => OPS[op](facts[f], v))) return r;
    }
    return null;
  }

  function initDemo() {
    const form = document.getElementById("decision-form");
    const body = document.getElementById("rules-body");
    const out = document.getElementById("decision-result");
    if (!form || !body || !out) return;

    body.innerHTML = RULES.map(r => `
      <tr data-rule="${r.id}">
        <th scope="row">${r.id}</th>
        <td>${r.when.length ? r.when.map(condText).join(" <strong>and</strong> ") : "<em>otherwise</em>"}</td>
        <td>${LABEL[r.then]}</td>
        <td>${r.why}</td>
      </tr>`).join("");

    function update() {
      const facts = {
        role: form.role.value,
        hours: Number(form.hours.value),
        hazard_level: form.hazard.value,
        safety_training: form.training.checked
      };
      document.getElementById("hours-value").textContent = facts.hours;
      const hit = decide(facts);
      body.querySelectorAll("tr").forEach(tr => {
        const on = hit && tr.dataset.rule === hit.id;
        tr.classList.toggle("hit", on);
        if (on) tr.setAttribute("aria-current", "true"); else tr.removeAttribute("aria-current");
      });
      out.className = "decision-result d-" + hit.then;
      out.innerHTML = `<span class="kicker">Decision service response</span>
        <strong>${LABEL[hit.then]}</strong> (rule ${hit.id}): ${hit.why}.
        <code class="json">${JSON.stringify({ decision: hit.then, rule: hit.id, reason: hit.why })}</code>`;
    }
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", e => e.preventDefault());
    update();
  }

  const DIAGRAM = {
    title: "An agent calling a decision service",
    width: 960, height: 360, minWidth: 640, legend: true,
    nodes: [
      { id: "user", label: "User", sub: "request in words", x: 70, y: 110, w: 120, kind: "user" },
      { id: "agent", label: "Agent (LLM)", sub: "understand and explain", x: 270, y: 110, w: 180, kind: "llm" },
      { id: "spec", label: "OpenAPI description", sub: "operations and schemas", x: 270, y: 260, w: 200, kind: "data" },
      { id: "api", label: "Decision API", sub: "POST /decisions/...", x: 520, y: 110, w: 180, kind: "tool" },
      { id: "rules", label: "Rules engine", sub: "decision tables (DMN)", x: 800, y: 50, w: 190, kind: "tool" },
      { id: "opt", label: "Optimizer", sub: "solver (e.g., OR-Tools)", x: 800, y: 150, w: 190, kind: "tool" },
      { id: "ml", label: "Predictive model", sub: "risk or demand score", x: 800, y: 250, w: 190, kind: "tool" },
      { id: "log", label: "Audit log", sub: "inputs, rule, result", x: 520, y: 260, w: 170, kind: "human" }
    ],
    edges: [
      { from: "user", to: "agent", label: "question" },
      { from: "spec", to: "agent", label: "becomes tool schema", dashed: true },
      { from: "agent", to: "api", label: "structured facts" },
      { from: "api", to: "rules" }, { from: "api", to: "opt" }, { from: "api", to: "ml" },
      { from: "api", to: "log", label: "record" },
      { from: "api", to: "agent", label: "decision + reason", curve: 30, dashed: true }
    ],
    steps: [
      { nodes: ["spec", "agent"], edges: ["spec>agent"], text: "<strong>Setup.</strong> The decision service publishes an OpenAPI description. The agent framework converts each operation into a tool the model can call." },
      { nodes: ["user", "agent"], edges: ["user>agent"], text: "<strong>Understand.</strong> \"I'm a student living 14 km away. Can I get a parking permit?\" The LLM extracts the facts." },
      { nodes: ["api"], edges: ["agent>api"], text: "<strong>Call.</strong> The agent sends structured facts that match the schema: <code>{\"role\": \"student\", \"distance_km\": 14}</code>." },
      { nodes: ["rules", "opt", "ml"], edges: ["api>rules", "api>opt", "api>ml"], text: "<strong>Decide.</strong> Behind the API, a rules engine, an optimizer, or a predictive model computes the decision. The same input always gives the same rule-based answer." },
      { nodes: ["log"], edges: ["api>log"], text: "<strong>Record.</strong> Inputs, the rule or model version, and the result are logged for audit." },
      { nodes: ["agent", "user"], edges: ["api>agent"], text: "<strong>Explain.</strong> The agent turns the decision and its reason into a clear reply for the user." }
    ]
  };

  document.addEventListener("DOMContentLoaded", () => {
    initDemo();
    const fig = document.getElementById("decision-diagram");
    if (fig && window.FlowDiagram) window.FlowDiagram.create(fig, DIAGRAM);
  });
})();
