/* ==========================================================================
   site.js: shared shell for every page.
   - SITE config (single place to edit module list, repo, and Colab paths)
   - Header, course sidebar, page TOC, pager, and footer rendering
   - Theme toggle, mobile menu, tabs, quizzes, click-to-load video
   Pages opt in through data attributes on <body>:
     data-page="evolution"     id of the current page (see SITE.modules)
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------- */
  /* Configuration                                                           */
  /* ---------------------------------------------------------------------- */
  const SITE = {
    title: "Agentic AI Crash Course",
    org: "Agentic AI @ KFUPM",
    community: "https://agenticaikfupm.github.io/",
    repo: "https://github.com/agenticaikfupm/CrashCourse",
    // Notebooks open in Colab straight from the GitHub repository.
    // If the repo or branch name changes, update these two lines only.
    colabBase: "https://colab.research.google.com/github/agenticaikfupm/CrashCourse/blob/main/notebooks/",
    githubBlobBase: "https://github.com/agenticaikfupm/CrashCourse/blob/main/",
    modules: [
      { id: "evolution",  num: 1, title: "Evolution of AI",          href: "evolution.html",  time: "30 min", blurb: "From GANs and Transformers to multimodal models, agents, and Physical AI." },
      { id: "components", num: 2, title: "Components of AI Agents",  href: "components.html", time: "40 min", blurb: "Perception, reasoning, planning, action, tools, memory, and oversight." },
      { id: "patterns",   num: 3, title: "Agent Design Patterns",    href: "patterns.html",   time: "50 min", blurb: "Sequential, routing, parallel, reflection, planning, and multi-agent designs." },
      { id: "alwayson",   num: 4, title: "Always-on AI Agents",      href: "always-on.html",  time: "30 min", blurb: "Proactive agents that work in the background: dots, Grok Bot, Instinct, and Muse." },
      { id: "mcp",        num: 5, title: "Model Context Protocol",   href: "mcp.html",        time: "35 min", blurb: "A standard way to connect agents to tools, data, and prompts." },
      { id: "decisions",  num: 6, title: "Decision APIs",            href: "decision-apis.html", time: "35 min", blurb: "Rules engines, optimization solvers, and OpenAPI decision services as agent tools." },
      { id: "workflows",  num: 7, title: "Agentic AI Workflows",     href: "workflows.html",  time: "40 min", blurb: "Perception to feedback: an end-to-end agent loop you can run." },
      { id: "nocode",     num: 8, title: "No-Code Agentic Workflows", href: "no-code.html",   time: "35 min", blurb: "Build agent workflows visually with n8n and similar platforms." },
      { id: "codeflows",  num: 9, title: "Code-based Agentic Workflows", href: "code-workflows.html", time: "50 min", blurb: "Agent SDKs in Python and many models through OpenRouter and Commonstack." },
      { id: "governance", num: 10, title: "Agentic AI Governance",   href: "governance.html", time: "40 min", blurb: "Guardrails, evaluation, monitoring, and human oversight." }
    ],
    reference: [
      { id: "glossary",  title: "Glossary",  href: "glossary.html" },
      { id: "resources", title: "Resources", href: "resources.html" },
      { id: "progress",  title: "My progress", href: "progress.html" }
    ]
  };
  window.SITE = SITE;

  /* ---------------------------------------------------------------------- */
  /* Icons (inline SVG, stroke-based, 24x24 grid)                            */
  /* ---------------------------------------------------------------------- */
  const P = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    up: '<path d="M18 15l-6-6-6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
    github: '<path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C5.7 1.1 4.6 1.4 4.6 1.4a4.7 4.7 0 0 0-.1 3.6A5 5 0 0 0 3 8.6c0 5 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.5-1.5a4 4 0 0 1-5-5L13 2z" transform="translate(-2 0)"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    loop: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14a5 5 0 0 1 5 5"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/>',
    flow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h4a2 2 0 0 1 2 2v7"/>',
    scale: '<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>',
    gavel: '<path d="M14 13l-7.5 7.5a2.1 2.1 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13v1M15 13v1M9 17h6"/><circle cx="12" cy="3" r="1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    message: '<path d="M4 5h16v11H9l-5 4z"/>',
    grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>'
  };
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || P.info) + "</svg>";
  }
  window.icon = icon;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const page = document.body.dataset.page || "";

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* Theme                                                                   */
  /* ---------------------------------------------------------------------- */
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    store("cc-theme", t);
    $$(".theme-toggle").forEach(b => {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
      b.setAttribute("aria-pressed", String(t === "dark"));
    });
    document.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }

  /* ---------------------------------------------------------------------- */
  /* Header                                                                  */
  /* ---------------------------------------------------------------------- */
  function renderHeader() {
    const host = $("#site-header");
    if (!host) return;
    const modLinks = SITE.modules.map(m =>
      `<a href="${m.href}"${m.id === page ? ' aria-current="page"' : ""}><span class="num">${String(m.num).padStart(2, "0")}</span><span>${m.title}</span></a>`
    ).join("");
    const cur = id => (id === page ? ' aria-current="page"' : "");
    host.outerHTML = `
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="${SITE.title} home">
      <img src="assets/img/logo-mark.png" alt="" width="34" height="34">
      <span>Agentic AI Crash Course<small>${SITE.org}</small></span>
    </a>
    <nav class="main-nav" id="main-nav" aria-label="Main">
      <a href="index.html"${cur("home")}>Home</a>
      <div class="nav-dropdown">
        <button class="nav-btn" type="button" aria-expanded="false" aria-controls="modules-menu">Modules ${icon("chevron")}</button>
        <div class="nav-dropdown-panel" id="modules-menu">${modLinks}</div>
      </div>
      <a href="index.html#labs"${cur("labs")}>Labs</a>
      <a href="glossary.html"${cur("glossary")}>Glossary</a>
      <a href="resources.html"${cur("resources")}>Resources</a>
      <a href="progress.html"${cur("progress")}>Progress</a>
    </nav>
    <button class="icon-btn theme-toggle" type="button" aria-label="Switch theme">${icon("sun", "sun")}${icon("moon", "moon")}</button>
    <button class="icon-btn menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu">${icon("menu")}</button>
  </div>
</header>`;

    const nav = $("#main-nav");
    const menuBtn = $(".menu-toggle");
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuBtn.innerHTML = icon(open ? "close" : "menu");
    });

    const dd = $(".nav-dropdown");
    const ddBtn = $(".nav-btn", dd);
    const closeDd = () => { dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded", "false"); };
    ddBtn.addEventListener("click", e => {
      e.stopPropagation();
      const open = dd.classList.toggle("open");
      ddBtn.setAttribute("aria-expanded", String(open));
      if (open) { const first = $("a", dd); if (first) first.focus(); }
    });
    document.addEventListener("click", e => { if (!dd.contains(e.target)) closeDd(); });
    dd.addEventListener("keydown", e => {
      const links = $$(".nav-dropdown-panel a", dd);
      const i = links.indexOf(document.activeElement);
      if (e.key === "Escape") { closeDd(); ddBtn.focus(); }
      else if (e.key === "ArrowDown" && dd.classList.contains("open")) { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === "ArrowUp" && dd.classList.contains("open")) { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && nav.classList.contains("open")) { menuBtn.click(); menuBtn.focus(); }
    });

    $(".theme-toggle").addEventListener("click", () =>
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
    setTheme(document.documentElement.dataset.theme || "light");
  }

  /* ---------------------------------------------------------------------- */
  /* Course sidebar (module list + on-this-page TOC) and progress            */
  /* ---------------------------------------------------------------------- */
  function visited() {
    try { return JSON.parse(store("cc-visited") || "[]"); } catch (e) { return []; }
  }
  function markVisited(id) {
    const v = visited();
    if (id && !v.includes(id)) { v.push(id); store("cc-visited", JSON.stringify(v)); }
  }

  /* Progress (saved in this browser only) ---------------------------------
     For each module: opened, overview video watched, and which of the three
     check-your-understanding questions were answered correctly.
     A module has four steps: the video plus three questions. */
  const Progress = {
    KEY: "cc-progress",
    load() {
      let d;
      try { d = JSON.parse(store(this.KEY) || "{}") || {}; } catch (e) { d = {}; }
      visited().forEach(id => { this.mod(d, id).opened = true; });      // older "visited" list
      return d;
    },
    save(d) { store(this.KEY, JSON.stringify(d)); document.dispatchEvent(new CustomEvent("progresschange")); },
    mod(d, id) { d[id] = d[id] || { opened: false, video: false, quiz: {} }; d[id].quiz = d[id].quiz || {}; return d[id]; },
    open(id) { const d = this.load(); const m = this.mod(d, id); m.opened = true; m.last = Date.now(); this.save(d); },
    video(id) { const d = this.load(); const m = this.mod(d, id); if (!m.video) { m.video = true; this.save(d); } },
    quiz(id, q, ok) { const d = this.load(); const m = this.mod(d, id); if (ok && !m.quiz[q]) { m.quiz[q] = true; this.save(d); } },
    module(id) {
      const m = this.load()[id] || {};
      const correct = Object.values(m.quiz || {}).filter(Boolean).length;
      const steps = (m.video ? 1 : 0) + correct;
      return { opened: !!m.opened, video: !!m.video, quiz: m.quiz || {}, correct, steps, total: 4,
               pct: steps / 4, complete: steps === 4, last: m.last || 0 };
    },
    overall() {
      const list = SITE.modules.map(x => this.module(x.id));
      const steps = list.reduce((a, b) => a + b.steps, 0);
      return { steps, total: list.length * 4, pct: steps / (list.length * 4),
               complete: list.filter(x => x.complete).length, opened: list.filter(x => x.opened).length,
               videos: list.filter(x => x.video).length, correct: list.reduce((a, b) => a + b.correct, 0) };
    },
    reset() { store(this.KEY, "{}"); store("cc-visited", "[]"); document.dispatchEvent(new CustomEvent("progresschange")); }
  };
  window.CourseProgress = Progress;

  function renderSidebar() {
    const host = $("#course-nav");
    if (!host) return;
    const items = SITE.modules.map(m => {
      const pr = Progress.module(m.id);
      const cls = pr.complete ? ' class="done"' : (pr.opened && m.id !== page ? ' class="visited"' : "");
      const cur = m.id === page ? ' aria-current="page"' : "";
      const note = pr.complete ? " (completed)" : (pr.opened && m.id !== page ? " (started)" : "");
      return `<li><a href="${m.href}"${cls}${cur} data-mod="${m.id}"><span class="step" aria-hidden="true">${pr.complete ? icon("check") : m.num}</span><span>${m.title}<span class="visually-hidden">${note}</span></span></a></li>`;
    }).join("");
    const ref = SITE.reference.map(r =>
      `<li><a href="${r.href}"${r.id === page ? ' aria-current="page"' : ""}><span class="step" aria-hidden="true">${icon({ glossary: "book", resources: "layers", progress: "target" }[r.id] || "layers")}</span><span>${r.title}</span></a></li>`
    ).join("");
    const sections = $$(".content > section[id]").map(s => {
      const h = $("h2", s);
      return h ? `<li><a href="#${s.id}">${h.textContent.trim()}</a></li>` : "";
    }).join("");

    host.setAttribute("aria-label", "Course");
    host.innerHTML = `
<button class="course-nav-toggle" type="button" aria-expanded="false" aria-controls="course-nav-body">
  <span>${SITE.modules.some(m => m.id === page) ? `Course map: module ${SITE.modules.find(m => m.id === page).num} of ${SITE.modules.length}` : "Course map"}</span>${icon("chevron")}
</button>
<div class="course-nav-body" id="course-nav-body">
  <h2>Modules</h2>
  <ol>${items}</ol>
  <h2 class="mt-1">Reference</h2>
  <ol>${ref}</ol>
</div>
${sections ? `<div class="toc-block"><h2>On this page</h2><ol class="toc">${sections}</ol></div>` : ""}`;

    const t = $(".course-nav-toggle", host);
    const body = $("#course-nav-body");
    t.addEventListener("click", () => {
      const open = body.classList.toggle("open");
      t.setAttribute("aria-expanded", String(open));
    });

    // Scrollspy for the TOC
    const tocLinks = $$(".toc a", host);
    if (tocLinks.length && "IntersectionObserver" in window) {
      const map = new Map(tocLinks.map(a => [a.getAttribute("href").slice(1), a]));
      const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            tocLinks.forEach(a => a.classList.remove("active"));
            const a = map.get(en.target.id);
            if (a) a.classList.add("active");
          }
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      $$(".content > section[id]").forEach(s => obs.observe(s));
    }
  }

  function renderPager() {
    const host = $("#pager");
    if (!host) return;
    const i = SITE.modules.findIndex(m => m.id === page);
    if (i < 0) return;
    const prev = SITE.modules[i - 1];
    const next = SITE.modules[i + 1];
    host.className = "pager";
    host.setAttribute("aria-label", "Module navigation");
    host.innerHTML =
      (prev ? `<a class="prev" href="${prev.href}"><small>Previous module</small>${prev.num}. ${prev.title}</a>`
            : `<a class="prev" href="index.html"><small>Back to</small>Course home</a>`) +
      (next ? `<a class="next" href="${next.href}"><small>Next module</small>${next.num}. ${next.title}</a>`
            : `<a class="next" href="glossary.html"><small>Keep going</small>Glossary and resources</a>`);
  }

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */
  function renderFooter() {
    const host = $("#site-footer");
    if (!host) return;
    const half = Math.ceil(SITE.modules.length / 2);
    const list = arr => arr.map(m => `<li><a href="${m.href}">${m.num}. ${m.title}</a></li>`).join("");
    host.outerHTML = `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html"><img src="assets/img/logo-mark.png" alt="" width="34" height="34"><span>Agentic AI Crash Course<small>${SITE.org}</small></span></a>
        <p class="small mt-1">A free, open crash course on Agentic AI for students, researchers, and practitioners.</p>
        <p class="small"><strong>To cite:</strong> Dr. Alaa Khamis. <em>Agentic AI Crash Course</em>. Agentic AI @ KFUPM Community, 2026.</p>
      </div>
      <div><h2>Modules</h2><ul>${list(SITE.modules.slice(0, half))}</ul></div>
      <div><h2>&nbsp;</h2><ul>${list(SITE.modules.slice(half))}</ul></div>
      <div><h2>Community</h2><ul>
        <li><a href="${SITE.community}">Agentic AI @ KFUPM</a></li>
        <li><a href="glossary.html">Glossary</a></li>
        <li><a href="resources.html">Resources</a></li>
        <li><a href="progress.html">My progress</a></li>
        <li><a href="${SITE.repo}">Course source on GitHub</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${SITE.org}. Course content for educational use.</span>
      <span>Hosted with GitHub Pages.</span>
    </div>
  </div>
</footer>
<button class="icon-btn back-to-top" type="button" aria-label="Back to top">${icon("up")}</button>`;
    const btt = $(".back-to-top");
    btt.addEventListener("click", () => { window.scrollTo({ top: 0 }); const m = $("#main"); if (m) m.focus({ preventScroll: true }); });
    window.addEventListener("scroll", () => btt.classList.toggle("show", window.scrollY > 900), { passive: true });
  }

  /* ---------------------------------------------------------------------- */
  /* Reusable widgets                                                        */
  /* ---------------------------------------------------------------------- */

  // Accessible tabs: <div class="tabs"><div role="tablist"> <button role="tab" aria-controls="x"> ... <div role="tabpanel" id="x">
  function initTabs(root) {
    $$('[role="tablist"]', root).forEach(list => {
      if (list.dataset.ready) return;
      list.dataset.ready = "1";
      const tabs = $$('[role="tab"]', list);
      const select = (tab, focus) => {
        tabs.forEach(t => {
          const on = t === tab;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
        list.dispatchEvent(new CustomEvent("tabchange", { detail: tab }));
      };
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => select(t));
        t.addEventListener("keydown", e => {
          let j = null;
          if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
          if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") j = 0;
          if (e.key === "End") j = tabs.length - 1;
          if (j !== null) { e.preventDefault(); select(tabs[j], true); }
        });
      });
      select(tabs.find(t => t.getAttribute("aria-selected") === "true") || tabs[0]);
      const box = list.closest(".tabs");
      if (box) box.classList.add("tabs-ready");
    });
  }
  window.initTabs = initTabs;

  // Single-answer quiz: <form class="quiz" data-answer="b" data-explain="...">
  // Check-your-understanding questions: <form class="quiz" data-q="1" data-answer="b" data-explain="...">
  // Correct answers are saved to course progress for module pages.
  function initQuizzes() {
    const isModule = SITE.modules.some(m => m.id === page);
    const forms = $$("form.quiz");
    const scoreEl = $(".quiz-score");
    const updateScore = () => {
      if (!scoreEl || !isModule) return;
      const pr = Progress.module(page);
      scoreEl.textContent = `You have answered ${pr.correct} of ${forms.length} questions correctly.` +
        (pr.correct === forms.length ? " Well done!" : "");
      scoreEl.className = "quiz-score" + (pr.correct === forms.length ? " ok" : "");
    };
    forms.forEach(f => {
      const fb = $(".feedback", f);
      const q = f.dataset.q;
      if (isModule && q && Progress.module(page).quiz[q]) {
        f.classList.add("answered");
        fb.className = "feedback ok";
        fb.textContent = "You answered this correctly earlier. Try it again any time.";
      }
      f.addEventListener("submit", e => {
        e.preventDefault();
        const chosen = $("input:checked", f);
        if (!chosen) { fb.className = "feedback no"; fb.textContent = "Choose an answer first."; return; }
        const ok = chosen.value === f.dataset.answer;
        fb.className = "feedback " + (ok ? "ok" : "no");
        fb.textContent = ok ? ("Correct. " + (f.dataset.explain || "")).trim() : "Not quite. Try again.";
        if (ok) f.classList.add("answered");
        if (isModule && q) { Progress.quiz(page, q, ok); updateScore(); }
      });
    });
    updateScore();
  }

  // Module overview video with an English (default), Arabic, or Urdu narration switch.
  // Markup: <div class="overview-player" data-module="04"> with .lang-switch buttons and a <video>.
  function initOverviewPlayers() {
    $$(".overview-player").forEach(box => {
      const n = box.dataset.module;
      const video = $("video", box);
      const buttons = $$(".lang-switch [data-lang]", box);
      const LANGS = { en: ["English", "English"], ar: ["العربية", "Arabic"], ur: ["اردو", "Urdu"] };
      let saved = store("cc-narration");
      if (!LANGS[saved]) saved = "en";                        // English is the default
      const setLang = (lang, keepPlaying) => {
        const playing = keepPlaying && !video.paused;
        buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
        const src = `assets/video/module-${n}-${lang}.mp4`;
        const source = $("source", video);
        if (source.getAttribute("src") !== src) {
          source.setAttribute("src", src);
          const old = $("track", video);
          const track = document.createElement("track");
          track.kind = "captions";
          track.src = `assets/video/module-${n}-${lang}.vtt`;
          track.srclang = lang;
          track.label = LANGS[lang][0];
          if (old) old.replaceWith(track); else video.appendChild(track);
          video.load();
          if (playing) video.play().catch(() => {});
        }
        video.setAttribute("aria-label", `Module ${Number(n)} overview video, ${LANGS[lang][1]} narration`);
      };
      buttons.forEach(b => b.addEventListener("click", () => {
        store("cc-narration", b.dataset.lang);
        setLang(b.dataset.lang, true);
      }));
      setLang(saved, false);
      // Count the video as watched once 90 percent has been played.
      const markWatched = () => { if (SITE.modules.some(m => m.id === page)) Progress.video(page); };
      video.addEventListener("timeupdate", () => {
        if (video.duration && video.currentTime / video.duration >= 0.9) markWatched();
      });
      video.addEventListener("ended", markWatched);
    });
  }

  // Course progress bar in the page details row, beside the level (module pages).
  function renderMetaProgress() {
    const meta = $(".page-head .page-meta");
    if (!meta || !SITE.modules.some(m => m.id === page)) return;
    meta.insertAdjacentHTML("beforeend", `<a class="meta-progress" href="progress.html">
      <span>Course progress</span>
      <span class="bar" role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="100"><i></i></span>
    </a>`);
    refreshProgressUI();
  }

  // Keep the progress bar and the sidebar module checkmarks current.
  function refreshProgressUI() {
    const ov = Progress.overall();
    const pct = Math.round(ov.pct * 100);
    $$(".meta-progress").forEach(a => {
      const bar = $(".bar", a);
      $("i", bar).style.width = ov.pct * 100 + "%";
      bar.setAttribute("aria-valuenow", String(pct));
      bar.setAttribute("aria-valuetext", `${pct} percent, ${ov.complete} of ${SITE.modules.length} modules completed`);
      a.title = `Course progress: ${pct}% (${ov.complete} of ${SITE.modules.length} modules completed). Select to see details.`;
    });
    $$(".course-nav a[data-mod]").forEach(a => {
      const pr = Progress.module(a.dataset.mod);
      const m = SITE.modules.find(x => x.id === a.dataset.mod);
      a.classList.toggle("done", pr.complete);
      $(".step", a).innerHTML = pr.complete ? icon("check") : String(m.num);
    });
  }

  // Privacy-friendly YouTube embed: loads the iframe only after a click.
  function initVideos() {
    $$(".video-embed[data-youtube]").forEach(box => {
      const id = box.dataset.youtube;
      const label = box.dataset.title || "Play video";
      box.innerHTML = `<button type="button" aria-label="Play video: ${label}" style="background-image:url('https://i.ytimg.com/vi/${id}/hqdefault.jpg')">
        <span class="play">${icon("play")}</span><span class="video-label">${label}</span></button>`;
      $("button", box).addEventListener("click", () => {
        box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${label}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
        const f = $("iframe", box); if (f) f.focus();
      });
    });
  }

  // Replace <i data-icon="name"></i> placeholders with inline SVG icons.
  function hydrateIcons(root) {
    $$("[data-icon]", root).forEach(el => { el.outerHTML = icon(el.dataset.icon, el.className); });
  }
  window.hydrateIcons = hydrateIcons;

  // Colab / GitHub link helpers used by page scripts and code panels.
  window.colabUrl = nb => SITE.colabBase + nb;
  window.githubUrl = path => SITE.githubBlobBase + path;

  // Open-in-Colab links written as <a data-colab="file.ipynb">
  function hydrateColab() {
    $$("a[data-colab]").forEach(a => {
      a.href = window.colabUrl(a.dataset.colab);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  // External links open in a new tab and announce it to screen readers.
  function markExternal() {
    $$('a[href^="http"]').forEach(a => {
      if (a.closest(".site-header")) return;
      if (!a.target) a.target = "_blank";
      a.rel = "noopener";
      if (!/opens in a new tab/.test(a.textContent)) a.insertAdjacentHTML("beforeend", '<span class="visually-hidden ext"> (opens in a new tab)</span>');
    });
  }
  window.markExternal = markExternal;

  /* ---------------------------------------------------------------------- */
  /* Boot                                                                    */
  /* ---------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    hydrateIcons();
    markVisited(page);
    if (SITE.modules.some(m => m.id === page)) Progress.open(page);
    renderHeader();
    renderSidebar();
    renderPager();
    renderFooter();
    initTabs();
    initQuizzes();
    initVideos();
    initOverviewPlayers();
    renderMetaProgress();
    document.addEventListener("progresschange", refreshProgressUI);
    hydrateColab();
    // Page scripts may add content after this point; they call markExternal() again.
    setTimeout(() => {
      markExternal();
      // Content rendered by scripts changes the layout, so re-apply the #anchor.
      const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }, 60);
  });
})();
