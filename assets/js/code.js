/* ==========================================================================
   code.js: enhances static Python code panels.

   Markup (code is injected from examples/*.py by tools/build.py):
     <figure class="code-panel"
             data-example="p01_sequential.py"   source file in /examples
             data-title="Sequential workflow"   visible title
             data-run="browser"                 "browser" = Run button (Pyodide)
                                                "colab"   = needs packages, Colab only
             data-colab="p01_sequential.ipynb"  optional notebook in /notebooks
             data-note="...">                   optional footnote
       <pre><code class="language-python">...</code></pre>
     </figure>

   Without JavaScript the code is still readable; this script only adds the
   toolbar (Run, Edit, Reset, Copy, Colab), output console, and highlighting.
   ========================================================================== */
(function () {
  "use strict";

  // Pinned Pyodide release. Loaded lazily on the first Run click (~10 MB).
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  let pyodidePromise = null;
  let runQueue = Promise.resolve(); // run one example at a time

  function loadPython() {
    if (pyodidePromise) return pyodidePromise;
    pyodidePromise = new Promise((resolve, reject) => {
      const done = () => window.loadPyodide({ indexURL: PYODIDE_URL }).then(resolve, reject);
      if (window.loadPyodide) return done();
      const s = document.createElement("script");
      s.src = PYODIDE_URL + "pyodide.js";
      s.onload = done;
      s.onerror = () => reject(new Error("The in-browser Python runtime could not be downloaded. Check your connection, or open the example in Google Colab instead."));
      document.head.appendChild(s);
    });
    pyodidePromise.catch(() => { pyodidePromise = null; }); // allow retry
    return pyodidePromise;
  }

  // Code written for scripts uses asyncio.run(main()). Pyodide and Jupyter
  // already run an event loop, so we await the coroutine at top level instead.
  function adaptForBrowser(code) {
    return code.replace(/^asyncio\.run\((.+)\)\s*$/gm, "await $1");
  }

  function highlight(codeEl) {
    if (window.Prism && Prism.languages && Prism.languages.python) {
      try { Prism.highlightElement(codeEl); } catch (e) { /* plain text fallback */ }
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      // Fall back to the legacy method if the async API is refused (no focus, permissions).
      return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }

  let uid = 0;
  function enhance(fig) {
    if (fig.dataset.ready) return;
    fig.dataset.ready = "1";
    const icon = window.icon;
    const codeEl = fig.querySelector("pre code");
    const pre = codeEl.parentElement;
    const original = codeEl.textContent.replace(/\n$/, "");
    const file = fig.dataset.example || "example.py";
    const title = fig.dataset.title || file;
    const runnable = fig.dataset.run === "browser";
    const colab = fig.dataset.colab;
    const id = "cp" + (++uid);
    fig.setAttribute("aria-labelledby", id + "-t");

    const head = document.createElement("div");
    head.className = "code-head";
    head.innerHTML = `
      <div class="code-title" id="${id}-t">${icon("code")}<span>${title}</span><span class="file">${file}</span>
        <span class="badge-env ${runnable ? "" : "colab"}" title="${runnable ? "Runs in your browser with standard-library Python" : "Needs extra packages: run it in Google Colab or locally"}">${runnable ? "Runs in browser" : "Colab / local"}</span></div>
      <div class="code-actions">
        ${runnable ? `<button type="button" class="code-btn run" data-act="run">${icon("play")}<span>Run</span></button>` : ""}
        <button type="button" class="code-btn" data-act="edit" aria-pressed="false">${icon("edit")}<span>Edit</span></button>
        <button type="button" class="code-btn" data-act="reset" hidden>${icon("reset")}<span>Reset</span></button>
        <button type="button" class="code-btn" data-act="copy">${icon("copy")}<span>Copy</span></button>
        ${colab ? `<a class="code-btn" href="${window.colabUrl(colab)}" target="_blank" rel="noopener">${icon("book")}<span>Open in Colab</span><span class="visually-hidden"> (opens in a new tab)</span></a>` : ""}
      </div>`;
    fig.insertBefore(head, pre);

    const textarea = document.createElement("textarea");
    textarea.hidden = true;
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", "Editable code for " + title);
    textarea.setAttribute("autocapitalize", "off");
    textarea.setAttribute("autocomplete", "off");
    pre.after(textarea);

    const out = document.createElement("div");
    out.className = "code-output";
    out.hidden = true;
    out.innerHTML = `<div class="code-output-head"><span>Output</span><span class="code-status" role="status" aria-live="polite"></span></div><pre tabindex="0" aria-label="Program output"></pre>`;
    textarea.after(out);
    const outPre = out.querySelector("pre");
    const status = out.querySelector(".code-status");

    const note = document.createElement("div");
    note.className = "code-note";
    const src = `<a href="examples/${file}">examples/${file}</a>`;
    note.innerHTML = (fig.dataset.note ? fig.dataset.note + " " : "") +
      (runnable ? `Runs locally in your browser with Pyodide; nothing is sent to a server. Source: ${src}.`
                : `This example installs packages, so it runs in Google Colab or on your computer. Source: ${src}.`);
    fig.appendChild(note);

    const live = document.createElement("span");
    live.className = "visually-hidden"; live.setAttribute("aria-live", "polite");
    fig.appendChild(live);

    highlight(codeEl);

    const btn = act => head.querySelector(`[data-act="${act}"]`);
    const current = () => (textarea.hidden ? codeEl.textContent : textarea.value);
    const setCode = text => { codeEl.textContent = text; highlight(codeEl); };

    btn("copy").addEventListener("click", () => {
      const b = btn("copy");
      copyText(current()).then(() => {
        b.innerHTML = icon("check") + "<span>Copied</span>"; live.textContent = "Code copied to clipboard";
        setTimeout(() => { b.innerHTML = icon("copy") + "<span>Copy</span>"; }, 1800);
      }, () => { live.textContent = "Copy failed. Select the code and copy it manually."; });
    });

    btn("edit").addEventListener("click", () => {
      const b = btn("edit");
      const editing = textarea.hidden;
      if (editing) {
        textarea.value = codeEl.textContent;
        textarea.style.height = Math.min(Math.max(pre.offsetHeight, 240), 640) + "px";
        pre.hidden = true; textarea.hidden = false; textarea.focus();
        b.innerHTML = icon("check") + "<span>Done</span>";
      } else {
        setCode(textarea.value);
        textarea.hidden = true; pre.hidden = false;
        b.innerHTML = icon("edit") + "<span>Edit</span>";
      }
      b.setAttribute("aria-pressed", String(editing));
      btn("reset").hidden = false;
    });

    btn("reset").addEventListener("click", () => {
      setCode(original); textarea.value = original;
      outPre.textContent = ""; out.hidden = true;
      live.textContent = "Code reset to the original example";
    });

    if (runnable) {
      const runBtn = btn("run");
      runBtn.addEventListener("click", () => {
        runQueue = runQueue.then(() => run()).catch(() => {});
      });
      async function run() {
        out.hidden = false;
        runBtn.disabled = true;
        outPre.textContent = "";
        const firstLoad = !pyodidePromise;
        status.innerHTML = `<span class="spinner" aria-hidden="true"></span>${firstLoad ? "Loading Python (first run only, about 10 MB)..." : "Running..."}`;
        let t0 = performance.now();
        try {
          const py = await loadPython();
          t0 = performance.now();
          status.innerHTML = '<span class="spinner" aria-hidden="true"></span>Running...';
          const write = s => { outPre.append(document.createTextNode(s + "\n")); };
          py.setStdout({ batched: write });
          py.setStderr({ batched: write });
          const ns = py.globals.get("dict")();
          ns.set("__name__", "__main__");
          await py.runPythonAsync(adaptForBrowser(current()), { globals: ns });
          ns.destroy();
          if (!outPre.textContent) outPre.textContent = "(The program finished without printing anything.)";
          status.textContent = `Finished in ${((performance.now() - t0) / 1000).toFixed(2)} s`;
        } catch (err) {
          const msg = String(err && err.message ? err.message : err);
          // Keep the useful tail of a Python traceback.
          const lines = msg.trim().split("\n");
          const tail = lines.length > 8 ? ["...", ...lines.slice(-8)] : lines;
          const e = document.createElement("span");
          e.className = "err";
          e.textContent = tail.join("\n");
          outPre.appendChild(e);
          status.textContent = "Stopped with an error";
        } finally {
          runBtn.disabled = false;
        }
      }
    }
  }

  function init() {
    document.querySelectorAll("figure.code-panel").forEach(enhance);
  }
  window.enhanceCodePanels = init;
  document.addEventListener("DOMContentLoaded", init);
})();
