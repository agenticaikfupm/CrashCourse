/* Home page: labs list built from the generated notebooks manifest. */
(function () {
  "use strict";
  // Where each example lives on its module page (default: #code).
  const ANCHOR = {
    pat_basic: "basic", pat_sequential: "sequential", pat_routing: "routing", pat_parallel: "parallel",
    pat_tool_calling: "tools", pat_reflection: "reflection", pat_plan_execute: "plan", pat_multi_agent: "multi",
    dec_rules_engine: "rules-demo", dec_openapi_tool: "openapi", dec_optimization: "optimization", dec_ortools: "optimization",
    nc_email_triage: "triage", nc_doc_qa: "rag",
    gov_guardrails: "guardrails", gov_human_approval: "approval", gov_eval_monitoring: "evaluation",
    cw_mini_framework: "under-the-hood", cw_openrouter_models: "openrouter", cw_openrouter_agent: "openrouter",
    cw_sdk_openai_agents: "same-agent", cw_sdk_claude: "same-agent", cw_sdk_langchain: "same-agent", cw_sdk_crewai: "same-agent",
    cw_sdk_smolagents: "same-agent", cw_sdk_pydanticai: "same-agent", cw_sdk_autogen: "same-agent"
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
