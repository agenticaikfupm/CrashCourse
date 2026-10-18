/* Resources page: filter by text, type, topic, and level; grouped by type. */
(function () {
  "use strict";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LEVELS = ["beginner", "intermediate", "advanced"];
  const cap = s => s[0].toUpperCase() + s.slice(1);

  // Notebooks that stay on their module page but are not listed here.
  const HIDDEN_NOTEBOOKS = new Set([]);

  function allResources() {
    const list = (window.RESOURCES || []).slice();
    (window.NOTEBOOKS || []).filter(n => !HIDDEN_NOTEBOOKS.has(n.file)).forEach(n => list.push({
      title: n.title, url: window.colabUrl(n.file + ".ipynb"), type: "Google Colab notebooks",
      topic: "Agents and patterns", level: n.browser ? "beginner" : "intermediate",
      desc: `${n.module}. ${n.browser ? "Also runs in your browser on the module page." : "Installs packages, so it runs in Colab."}`,
      page: n.page
    }));
    return list;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const data = allResources();
    const host = document.getElementById("resource-groups");
    const q = document.getElementById("res-search");
    const type = document.getElementById("res-type");
    const topic = document.getElementById("res-topic");
    const level = document.getElementById("res-level");
    const count = document.getElementById("res-count");
    if (!host) return;

    type.innerHTML = '<option value="">All types</option>' + window.RESOURCE_TYPES.map(t => `<option>${esc(t)}</option>`).join("");
    topic.innerHTML = '<option value="">All topics</option>' + window.RESOURCE_TOPICS.map(t => `<option>${esc(t)}</option>`).join("");
    level.innerHTML = '<option value="">All levels</option>' + LEVELS.map(l => `<option value="${l}">${cap(l)}</option>`).join("");

    function render() {
      const text = q.value.trim().toLowerCase();
      const shown = data.filter(r =>
        (!type.value || r.type === type.value) &&
        (!topic.value || r.topic === topic.value) &&
        (!level.value || r.level === level.value) &&
        (!text || (r.title + " " + r.desc + " " + r.topic).toLowerCase().includes(text)));
      count.textContent = `Showing ${shown.length} of ${data.length} resources`;
      if (!shown.length) {
        host.innerHTML = '<div class="empty-state"><p><strong>No resources match these filters.</strong></p><p>Clear a filter or try another word.</p></div>';
        return;
      }
      host.innerHTML = window.RESOURCE_TYPES.map(t => {
        const items = shown.filter(r => r.type === t)
          .sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.title.localeCompare(b.title));
        if (!items.length) return "";
        const id = "type-" + t.toLowerCase().replace(/[^a-z]+/g, "-");
        return `<section class="res-group" aria-labelledby="${id}">
          <h2 id="${id}">${esc(t)} <span class="count">${items.length}</span></h2>
          <ul class="res-list">${items.map(r => `
            <li><div class="res">
              <a class="res-title" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}${window.icon("external")}<span class="visually-hidden"> (opens in a new tab)</span></a>
              <p>${esc(r.desc)}</p>
              <div class="meta"><span class="tag lvl-${r.level}">${cap(r.level)}</span><span class="tag">${esc(r.topic)}</span>${r.page ? `<a class="tag" href="${r.page}">Module page</a>` : ""}</div>
            </div></li>`).join("")}
          </ul></section>`;
      }).join("");
    }
    [q, type, topic, level].forEach(el => el.addEventListener("input", render));
    document.getElementById("res-reset").addEventListener("click", () => { q.value = ""; type.value = ""; topic.value = ""; level.value = ""; render(); q.focus(); });
    render();
  });
})();
