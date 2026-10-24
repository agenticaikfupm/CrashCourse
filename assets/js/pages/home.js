/* Home page: labs list built from the generated notebooks manifest. */
(function () {
  "use strict";
  // Where each example lives on its module page (default: #code).
  const ANCHOR = {
    pat_basic: "basic", pat_sequential: "sequential", pat_routing: "routing", pat_parallel: "parallel",
    pat_tool_calling: "tools", pat_reflection: "reflection", pat_plan_execute: "plan", pat_multi_agent: "multi",
    dec_rules_engine: "rules-demo", dec_openapi_tool: "openapi", dec_optimization: "optimization", dec_ortools: "optimization",
    nc_google_manager: "google-manager", nc_lost_found: "lost-found", nc_email_triage: "triage", nc_doc_qa: "rag",
    gov_guardrails: "guardrails", gov_human_approval: "approval", gov_eval_monitoring: "evaluation",
    cw_mini_framework: "under-the-hood", cw_openrouter_models: "openrouter", cw_openrouter_agent: "openrouter",
    cw_sdk_openai_agents: "same-agent", cw_sdk_claude: "same-agent", cw_sdk_langchain: "same-agent", cw_sdk_crewai: "same-agent",
    cw_sdk_smolagents: "same-agent", cw_sdk_pydanticai: "same-agent", cw_sdk_autogen: "same-agent",
    cw_google_manager: "google-manager-sdk", cw_lost_found: "lost-found-sdk"
  };

  /* Course activity cards (the counters are described in site.js). */
  const WEEKS = 7;                               // bars per card, oldest first, this week last
  const NAMES = ["visitors", "pageviews", "sessions", "engaged"];
  const TOTALS = { visitors: "unique-visits", pageviews: "pageviews", sessions: "sessions", engaged: "engaged" };

  function readCache() { try { return JSON.parse(localStorage.getItem("cc-stats-weeks")) || {}; } catch (e) { return {}; } }
  function saveCache(c) { try { localStorage.setItem("cc-stats-weeks", JSON.stringify(c)); } catch (e) { /* storage blocked */ } }

  // Weekly counters. Weeks before last week no longer change, so they are cached.
  async function loadWeeks(S) {
    const cache = readCache();
    const weeks = [];
    for (let i = WEEKS - 1; i >= 0; i--) weeks.push(S.weekId(-i));
    const rows = await Promise.all(weeks.map((wk, idx) => {
      const old = idx < WEEKS - 2;
      return Promise.all(NAMES.map(n => {
        const key = n + "-" + wk;
        if (old && key in cache) return cache[key];
        return S.get(key).then(v => { if (old && v !== null) cache[key] = v; return v; });
      }));
    }));
    const keep = new Set(weeks.flatMap(wk => NAMES.map(n => n + "-" + wk)));
    Object.keys(cache).forEach(k => { if (!keep.has(k)) delete cache[k]; });
    saveCache(cache);
    return rows.map(r => Object.fromEntries(NAMES.map((n, i) => [n, r[i]])));
  }

  const ratio = (a, b) => (a === null || !b ? null : a / b);
  function derive(d, base) {
    return {
      visitors: d.visitors === null ? null : d.visitors + base,
      pageviews: d.pageviews === null ? null : d.pageviews + base,
      bounce: d.engaged === null ? null : ratio(d.sessions - d.engaged, d.sessions)
    };
  }

  const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
  const fmtCount = v => (v < 1000 ? String(v) : compact.format(v).toLowerCase());
  const trim = x => x.toFixed(1).replace(/\.0$/, "");
  const CARDS = [
    { id: "visitors", label: "Unique visitors", fmt: fmtCount, up: true },
    { id: "pageviews", label: "Pageviews", fmt: fmtCount, up: true },
    { id: "bounce", label: "Bounce rate", fmt: v => Math.round(v * 100) + "%", up: false, points: true }
  ];

  // Change from the week before last to last week: percent, or percentage points for bounce rate.
  function trend(card, prev, cur) {
    if (cur === null || prev === null) return null;
    let change;
    if (card.points) change = (cur - prev) * 100;
    else if (prev === 0) return cur > 0 ? { text: "New", good: true, sr: "new since the week before" } : null;
    else change = ((cur - prev) / prev) * 100;
    if (Math.abs(change) < 0.05) return { text: "0%", flat: true, sr: "no change from the week before" };
    const up = change > 0;
    return {
      text: (up ? "↑ " : "↓ ") + trim(Math.abs(change)) + (card.points ? " pts" : "%"),
      good: up === card.up,
      sr: (up ? "up " : "down ") + trim(Math.abs(change)) + (card.points ? " percentage points" : " percent") + " from the week before"
    };
  }

  function renderCards(row, totals, weeks) {
    row.innerHTML = CARDS.map(c => {
      const v = totals[c.id];
      const series = weeks ? weeks.map(w => w[c.id]) : [];
      const max = Math.max(0, ...series.filter(x => x !== null));
      const bars = weeks ? series.map((x, i) => {
        const h = x ? Math.max(18, Math.round((x / max) * 100)) : 8;
        return `<i style="height:${h}%"${i === series.length - 1 ? ' class="now"' : ""}></i>`;
      }).join("") : "<i></i>".repeat(WEEKS);
      const t = weeks ? trend(c, series[WEEKS - 3], series[WEEKS - 2]) : null;
      const tr = t ? `<p class="metric-trend${t.flat ? "" : t.good ? " good" : " bad"}"><span aria-hidden="true">${t.text}</span><span class="visually-hidden">${t.sr}</span></p>`
                   : `<p class="metric-trend" aria-hidden="true">&nbsp;</p>`;
      return `<div class="metric">
          <div class="metric-top"><h3>${c.label}</h3><span class="metric-bars${weeks ? "" : " loading"}" aria-hidden="true">${bars}</span></div>
          <p class="metric-value">${v === null ? "n/a" : c.fmt(v)}</p>${tr}
        </div>`;
    }).join("");
  }

  async function showActivity() {
    const S = window.CourseStats, section = document.getElementById("activity"), row = document.getElementById("metric-row");
    if (!S || !section || !row) return;
    const { base } = S.config;
    const raw = await Promise.all(NAMES.map(n => S.get(TOTALS[n])));
    if (raw.every(v => v === null)) return;      // service unavailable: keep the section hidden
    const totals = derive(Object.fromEntries(NAMES.map((n, i) => [n, raw[i]])), base);
    renderCards(row, totals, null);
    section.hidden = false;
    const weeks = (await loadWeeks(S)).map(w => derive(w, 0));
    renderCards(row, totals, weeks);
  }

  document.addEventListener("DOMContentLoaded", () => {
    showActivity();
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
