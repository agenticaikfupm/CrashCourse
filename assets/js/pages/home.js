/* Home page: labs list built from the generated notebooks manifest. */
(function () {
  "use strict";
  // Where each example lives on its module page (default: #code).
  const ANCHOR = {
    pat_basic: "basic", pat_sequential: "sequential", pat_routing: "routing", pat_parallel: "parallel",
    pat_tool_calling: "tools", pat_reflection: "reflection", pat_plan_execute: "plan", pat_multi_agent: "multi",
    dec_rules_engine: "rules-demo", dec_openapi_tool: "openapi", dec_optimization: "optimization", dec_ortools: "optimization",
    nc_email_triage: "triage", nc_doc_qa: "rag",
    gov_guardrails: "guardrails", gov_human_approval: "approval", gov_eval_monitoring: "evaluation"
  };

  document.addEventListener("DOMContentLoaded", () => {
    const host = document.getElementById("labs-list");
    const items = window.NOTEBOOKS || [];
    if (!host || !items.length) return;
    const modules = [...new Set(items.map(n => n.module))];
    host.innerHTML = `<div class="grid grid-2">` + modules.map(m => {
      const labs = items.filter(n => n.module === m);
      return `<div class="card lab-card"><h3>${m}</h3><ul class="lab-list">${labs.map(n => `
        <li>
          <a href="${n.page}#${ANCHOR[n.file] || "code"}">${n.title}</a>
          <span class="lab-meta">
            ${n.browser ? '<span class="tag brand">Runs in browser</span>' : '<span class="tag gold">Colab</span>'}
            <a class="tag" href="${window.colabUrl(n.file + ".ipynb")}" target="_blank" rel="noopener">Open in Colab<span class="visually-hidden"> (opens in a new tab)</span></a>
          </span>
        </li>`).join("")}</ul></div>`;
    }).join("") + `</div>`;
  });
})();
