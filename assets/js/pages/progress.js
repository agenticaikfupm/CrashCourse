/* Progress page: shows progress saved in this browser by site.js (CourseProgress). */
(function () {
  "use strict";

  function render() {
    const P = window.CourseProgress;
    const host = document.getElementById("progress-app");
    if (!P || !host) return;
    const ov = P.overall();
    const pct = Math.round(ov.pct * 100);
    const R = 62, C = 2 * Math.PI * R;
    const mods = window.SITE.modules.map(m => Object.assign({ m }, P.module(m.id)));
    const next = mods.find(x => !x.complete);
    const status = x => x.complete ? "Completed" : x.opened ? "In progress" : "Not started";

    host.innerHTML = `
      <div class="progress-hero">
        <div class="progress-ring" role="img" aria-label="Overall course progress: ${pct} percent">
          <svg viewBox="0 0 150 150" aria-hidden="true"><circle class="track" cx="75" cy="75" r="${R}"/>
            <circle class="value" cx="75" cy="75" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - ov.pct)).toFixed(1)}"/></svg>
          <span class="pct" aria-hidden="true">${pct}%</span>
        </div>
        <div>
          <h2 class="mb-0">${ov.complete === mods.length ? "Course complete. Congratulations!" : ov.steps ? "Keep going!" : "Ready to start?"}</h2>
          <p class="mt-1">${next ? `Next up: <a href="${next.m.href}">Module ${next.m.num}, ${next.m.title}</a>.` : "You have watched every overview and answered every question correctly."}</p>
          <div class="progress-stats">
            <div><b>${ov.complete} / ${mods.length}</b><span>modules completed</span></div>
            <div><b>${ov.opened} / ${mods.length}</b><span>modules opened</span></div>
            <div><b>${ov.videos} / ${mods.length}</b><span>overview videos watched</span></div>
            <div><b>${ov.correct} / ${mods.length * 3}</b><span>questions answered correctly</span></div>
          </div>
        </div>
      </div>

      <ol class="module-progress" aria-label="Progress by module">
        ${mods.map(x => `
          <li class="${x.complete ? "complete" : x.opened ? "started" : ""}">
            <span class="num" aria-hidden="true">${x.complete ? window.icon("check") : x.m.num}</span>
            <div>
              <h3><a href="${x.m.href}">Module ${x.m.num}. ${x.m.title}</a></h3>
              <div class="checks">
                <span class="${x.opened ? "yes" : ""}">${x.opened ? "Opened" : "Not opened"}</span>
                <span class="${x.video ? "yes" : ""}">${x.video ? "Overview watched" : "Overview not watched"}</span>
                <span class="${x.correct === 3 ? "yes" : ""}">${x.correct} of 3 questions correct</span>
              </div>
            </div>
            <div class="side">
              <span class="progress-bar" aria-hidden="true"><i style="width:${x.pct * 100}%"></i></span>
              <span>${status(x)}, ${Math.round(x.pct * 100)}%</span>
            </div>
          </li>`).join("")}
      </ol>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.addEventListener("progresschange", render);
    // Other tabs can change progress too.
    window.addEventListener("storage", e => { if (e.key === "cc-progress") render(); });
    const reset = document.getElementById("progress-reset");
    if (reset) reset.addEventListener("click", () => {
      if (window.confirm("Reset your course progress on this device? This cannot be undone.")) window.CourseProgress.reset();
    });
  });
})();
