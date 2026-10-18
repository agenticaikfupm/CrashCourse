/* Searchable glossary rendered from assets/data/glossary.js. */
(function () {
  "use strict";

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function highlight(text, q) {
    const safe = esc(text);
    if (!q) return safe;
    return safe.replace(new RegExp("(" + escRe(esc(q)) + ")", "gi"), "<mark>$1</mark>");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const data = (window.GLOSSARY || []).slice().sort((a, b) => a.term.localeCompare(b.term));
    const byId = Object.fromEntries(data.map(t => [t.id, t]));
    const list = document.getElementById("glossary-list");
    const input = document.getElementById("glossary-search");
    const cat = document.getElementById("glossary-cat");
    const count = document.getElementById("glossary-count");
    const az = document.getElementById("glossary-az");
    if (!list || !input) return;

    cat.innerHTML = '<option value="">All categories</option>' +
      (window.GLOSSARY_CATEGORIES || []).map(c => `<option>${esc(c)}</option>`).join("");

    const params = new URLSearchParams(location.search);
    input.value = params.get("q") || "";

    function render() {
      const q = input.value.trim();
      const ql = q.toLowerCase();
      const c = cat.value;
      const shown = data.filter(t =>
        (!c || t.cat === c) &&
        (!ql || [t.term, t.abbr || "", t.def, t.example].some(f => f.toLowerCase().includes(ql))));

      count.textContent = `${shown.length} of ${data.length} terms` + (q ? ` matching "${q}"` : "") + (c ? ` in ${c}` : "");

      const letters = new Set(shown.map(t => t.term[0].toUpperCase()));
      az.innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(L =>
        letters.has(L) ? `<a href="#letter-${L}" aria-label="Terms starting with ${L}">${L}</a>` : `<span aria-hidden="true">${L}</span>`).join("");

      if (!shown.length) {
        list.innerHTML = `<div class="empty-state"><p><strong>No terms found.</strong></p><p>Try a shorter word, check the spelling, or clear the category filter.</p></div>`;
        return;
      }
      let lastLetter = "";
      list.innerHTML = shown.map(t => {
        const L = t.term[0].toUpperCase();
        const anchor = L !== lastLetter ? ` data-letter="${L}"` : "";
        lastLetter = L;
        const rel = (t.related || []).filter(id => byId[id]).map(id => `<a href="#${id}">${esc(byId[id].term)}</a>`).join("");
        return `<article class="term" id="${t.id}"${anchor}>
          <h3>${highlight(t.term, q)}${t.abbr ? ` <span class="abbr">${highlight(t.abbr, q)}</span>` : ""} <span class="tag">${esc(t.cat)}</span></h3>
          <p>${highlight(t.def, q)}</p>
          <p class="example"><b>Example</b>${highlight(t.example, q)}</p>
          ${rel ? `<div class="related"><span>Related:</span>${rel}</div>` : ""}
          ${t.module ? `<p class="see"><a href="${t.module}">Learn more in the course &rarr;</a></p>` : ""}
        </article>`;
      }).join("");
      // Letter anchors for the A to Z bar
      list.querySelectorAll("[data-letter]").forEach(el => {
        const a = document.createElement("span");
        a.id = "letter-" + el.dataset.letter;
        el.before(a);
      });
    }

    let timer;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        render();
        const url = new URL(location.href);
        if (input.value.trim()) url.searchParams.set("q", input.value.trim()); else url.searchParams.delete("q");
        try { history.replaceState(null, "", url.pathname + url.search); } catch (e) { /* file:// */ }
      }, 120);
    });
    cat.addEventListener("change", render);
    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
    });
    // Following a "related" link to a term hidden by the current filter clears the filter.
    list.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (a && !document.getElementById(a.getAttribute("href").slice(1))) { input.value = ""; cat.value = ""; render(); }
    });
    render();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  });
})();
