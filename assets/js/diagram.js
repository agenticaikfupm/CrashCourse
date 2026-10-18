/* ==========================================================================
   diagram.js: data-driven, accessible SVG flow diagrams.

   FlowDiagram.create(figureElement, {
     title:  "Router pattern",
     width:  760, height: 320,            // SVG viewBox size
     nodes: [{ id, label, sub, x, y, w, h, kind }],
             // x,y = node center. kind: llm | tool | user | human | data | group
     edges: [{ from, to, label, dashed, via: [[x,y]...], curve, labelAt: [x,y] }],
     steps: [{ nodes: ["id"...], edges: ["from>to"...], text: "What happens" }],
     selectable: false,                   // nodes become buttons
     onSelect: id => {},                  // called when a node is chosen
     legend: true                         // show solid/dashed legend
   })

   Returns { goTo(i), select(id), stop() }.
   The figure gets a toolbar (Play, Back, Next, Restart), a live caption, and a
   visually hidden ordered list of steps for screen-reader users.
   ========================================================================== */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let gid = 0;

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // Point where a ray from the node center toward (tx,ty) leaves the rectangle.
  function border(n, tx, ty, pad) {
    const dx = tx - n.x, dy = ty - n.y;
    if (!dx && !dy) return [n.x, n.y];
    const hw = n.w / 2 + (pad || 0), hh = n.h / 2 + (pad || 0);
    const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
    return [n.x + dx * t, n.y + dy * t];
  }

  function create(fig, cfg) {
    if (fig._flow) fig._flow.stop();
    const id = "fd" + (++gid);
    const nodes = cfg.nodes.map(n => Object.assign({ w: Math.max(118, (n.label || "").length * 8.2 + 30), h: n.sub ? 58 : 46, kind: "" }, n));
    const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
    const steps = cfg.steps || [];
    let cur = -1, timer = null, selected = null;

    fig.classList.add("figure");
    fig.innerHTML = `
      <div class="figure-toolbar">
        <span class="title">${cfg.title || "Interactive diagram"}</span>
        ${steps.length ? `<div class="figure-controls">
          <button type="button" class="ctrl" data-c="play" aria-pressed="false">${window.icon("play")}<span>Play</span></button>
          <button type="button" class="ctrl" data-c="prev" aria-label="Previous step">${window.icon("left")}<span>Back</span></button>
          <button type="button" class="ctrl" data-c="next" aria-label="Next step"><span>Next</span>${window.icon("right")}</button>
          <button type="button" class="ctrl" data-c="reset" aria-label="Restart">${window.icon("reset")}</button>
        </div>` : ""}
      </div>
      <div class="figure-canvas"></div>
      <div class="figure-caption" aria-live="polite"><span class="step-count"></span><span class="step-text"></span></div>
      ${cfg.legend ? `<div class="figure-legend"><span><i></i>Main flow</span><span><i class="dash"></i>Feedback, loop, or optional path</span><span class="swipe-hint">Swipe sideways to see the whole diagram</span>${cfg.selectable ? "<span>Select a box to see details</span>" : ""}</div>` : ""}
      <ol class="visually-hidden" aria-label="Text description of the diagram"></ol>`;

    const canvas = fig.querySelector(".figure-canvas");
    const svg = el("svg", { viewBox: `0 0 ${cfg.width} ${cfg.height}`, class: "flow", role: "group", "aria-label": (cfg.title || "Diagram") + ". Use the controls or the list below to follow the steps." }, canvas);
    if (cfg.minWidth) svg.style.minWidth = cfg.minWidth + "px";
    const defs = el("defs", {}, svg);
    [["m", ""], ["ma", "m-active"], ["md", "m-dashed"]].forEach(([k, cls]) => {
      const m = el("marker", { id: `${id}-${k}`, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse", class: cls }, defs);
      el("path", { d: "M0,0 L10,5 L0,10 z" }, m);
    });

    // Groups first (drawn behind), then edges, then other nodes.
    const gGroups = el("g", {}, svg), gEdges = el("g", {}, svg), gNodes = el("g", {}, svg);

    const edgeEls = {};
    (cfg.edges || []).forEach((e, i) => {
      const a = byId[e.from], b = byId[e.to];
      if (!a || !b) { console.warn("Diagram edge references a missing node:", e); return; }
      const via = e.via || [];
      let d, mid;
      if (via.length) {
        const p0 = border(a, via[0][0], via[0][1], 2);
        const last = via[via.length - 1];
        const p1 = border(b, last[0], last[1], 4);
        d = `M${p0[0]},${p0[1]} ` + via.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${p1[0]},${p1[1]}`;
        mid = via[Math.floor((via.length - 1) / 2)];
        if (via.length % 2 === 0) { const q = via[via.length / 2]; mid = [(mid[0] + q[0]) / 2, (mid[1] + q[1]) / 2]; }
      } else if (e.curve) {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const cx = mx - (b.y - a.y) / len * e.curve, cy = my + (b.x - a.x) / len * e.curve;
        const p0 = border(a, cx, cy, 2), p1 = border(b, cx, cy, 4);
        d = `M${p0[0]},${p0[1]} Q${cx},${cy} ${p1[0]},${p1[1]}`;
        mid = [(p0[0] + 2 * cx + p1[0]) / 4, (p0[1] + 2 * cy + p1[1]) / 4];
      } else {
        const p0 = border(a, b.x, b.y, 2), p1 = border(b, a.x, a.y, 4);
        d = `M${p0[0]},${p0[1]} L${p1[0]},${p1[1]}`;
        mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      }
      const key = e.from + ">" + e.to;
      const g = el("g", { class: "edge" + (e.dashed ? " dashed" : "") }, gEdges);
      const path = el("path", { d, id: `${id}-e${i}`, "marker-end": `url(#${id}-${e.dashed ? "md" : "m"})` }, g);
      if (e.label) {
        const at = e.labelAt || mid;
        const t = el("text", { x: at[0], y: at[1] - 6, "text-anchor": "middle" }, g);
        t.textContent = e.label;
      }
      edgeEls[key] = { g, path, dashed: !!e.dashed };
    });

    const nodeEls = {};
    nodes.forEach(n => {
      const parent = n.kind === "group" ? gGroups : gNodes;
      const g = el("g", { class: `node k-${n.kind}`, transform: `translate(${n.x - n.w / 2},${n.y - n.h / 2})` }, parent);
      el("rect", { width: n.w, height: n.h, rx: n.kind === "group" ? 16 : 11 }, g);
      if (n.kind === "group") {
        const t = el("text", { x: 14, y: 20 }, g); t.textContent = n.label;
      } else {
        const t = el("text", { x: n.w / 2, y: n.sub ? n.h / 2 - 4 : n.h / 2 + 5, "text-anchor": "middle" }, g);
        t.textContent = n.label;
        if (n.sub) { const s = el("text", { x: n.w / 2, y: n.h / 2 + 15, "text-anchor": "middle", class: "sub" }, g); s.textContent = n.sub; }
      }
      if (cfg.selectable && n.kind !== "group") {
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", n.label + (n.sub ? ", " + n.sub : "") + ". Show details");
        g.setAttribute("aria-pressed", "false");
        g.addEventListener("click", () => select(n.id, true));
        g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(n.id, true); } });
      }
      nodeEls[n.id] = g;
    });

    // Text alternative
    const list = fig.querySelector("ol.visually-hidden");
    list.innerHTML = steps.length
      ? steps.map(s => `<li>${s.text}</li>`).join("")
      : (cfg.edges || []).map(e => `<li>${(byId[e.from] || {}).label} to ${(byId[e.to] || {}).label}${e.label ? " (" + e.label + ")" : ""}</li>`).join("");

    const countEl = fig.querySelector(".step-count");
    const textEl = fig.querySelector(".step-text");
    const ctrl = c => fig.querySelector(`[data-c="${c}"]`);
    let tokens = [];

    function clearTokens() { tokens.forEach(t => t.remove()); tokens = []; }

    function paint() {
      const s = steps[cur];
      clearTokens();
      Object.entries(nodeEls).forEach(([nid, g]) => {
        const n = byId[nid];
        g.classList.toggle("active", !!(s && s.nodes && s.nodes.includes(nid)));
        g.classList.toggle("dim", !!(s && n.kind !== "group" && !(s.nodes || []).includes(nid) && !(s.edges || []).some(k => k.split(">").includes(nid))));
        g.classList.toggle("selected", nid === selected);
        if (g.hasAttribute("aria-pressed")) g.setAttribute("aria-pressed", String(nid === selected));
      });
      Object.entries(edgeEls).forEach(([k, e]) => {
        const on = !!(s && s.edges && s.edges.includes(k));
        e.g.classList.toggle("active", on);
        e.g.classList.toggle("dim", !!s && !on);
        e.path.setAttribute("marker-end", `url(#${id}-${on ? "ma" : e.dashed ? "md" : "m"})`);
        if (on && !reduceMotion) {
          const c = el("circle", { r: 5, class: "token-dot" }, gEdges);
          const am = el("animateMotion", { dur: "1.4s", repeatCount: "indefinite" }, c);
          const mp = el("mpath", {}, am);
          mp.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + e.path.id);
          mp.setAttribute("href", "#" + e.path.id);
          tokens.push(c);
        }
      });
      if (steps.length) {
        countEl.textContent = cur < 0 ? "Start" : `Step ${cur + 1}/${steps.length}`;
        textEl.innerHTML = cur < 0 ? (cfg.intro || "Press Play or Next to walk through the flow one step at a time.") : s.text;
      } else {
        countEl.textContent = "";
        textEl.innerHTML = cfg.intro || "";
      }
      if (ctrl("prev")) { ctrl("prev").disabled = cur <= 0; ctrl("next").disabled = cur >= steps.length - 1; }
    }

    function goTo(i) { cur = Math.max(-1, Math.min(steps.length - 1, i)); paint(); }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      const p = ctrl("play");
      if (p) { p.setAttribute("aria-pressed", "false"); p.innerHTML = window.icon("play") + "<span>Play</span>"; }
    }
    function play() {
      const p = ctrl("play");
      if (timer) return stop();
      if (cur >= steps.length - 1) cur = -1;
      goTo(cur + 1);
      p.setAttribute("aria-pressed", "true");
      p.innerHTML = window.icon("pause") + "<span>Pause</span>";
      timer = setInterval(() => { if (cur >= steps.length - 1) stop(); else goTo(cur + 1); }, cfg.interval || 2600);
    }
    function select(nid, fromUser) {
      selected = nid;
      paint();
      if (cfg.onSelect) cfg.onSelect(nid, fromUser);
    }

    if (steps.length) {
      ctrl("play").addEventListener("click", play);
      ctrl("next").addEventListener("click", () => { stop(); goTo(cur + 1); });
      ctrl("prev").addEventListener("click", () => { stop(); goTo(cur - 1); });
      ctrl("reset").addEventListener("click", () => { stop(); goTo(-1); });
    }
    goTo(-1);

    const api = { goTo, select, stop };
    fig._flow = api;
    return api;
  }

  window.FlowDiagram = { create };
})();
