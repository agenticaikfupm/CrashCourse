# Agentic AI Crash Course

An interactive, responsive crash course on Agentic AI from the
[Agentic AI @ KFUPM](https://agenticaikfupm.github.io/) community.

The site is plain HTML, CSS, and JavaScript with no build framework, so it
deploys directly to GitHub Pages. Python examples run in the browser with
[Pyodide](https://pyodide.org/) or open in Google Colab.

**Live site (after deployment):** https://agenticaikfupm.github.io/CrashCourse/

## Contents

| Page | File | Highlights |
| --- | --- | --- |
| Home | `index.html` | Objectives, audience, prerequisites, module map, labs index, outcomes |
| 1. Evolution of AI | `evolution.html` | Interactive timeline (GANs to Physical AI), model-release lanes, inference code |
| 2. Components of AI Agents | `components.html` | Selectable architecture diagram, five component examples |
| 3. Agent Design Patterns | `patterns.html` | Eight patterns, each with a playable workflow diagram and code |
| 4. Always-on AI Agents | `always-on.html` | Proactive agents (OpenAI dots, Grok Bot, Instinct, Meta Muse), architecture diagram, trigger and permission simulation |
| 5. Model Context Protocol | `mcp.html` | Host/client/server workflow, JSON-RPC simulation, official SDK example |
| 6. Decision APIs | `decision-apis.html` | Live decision table, OpenAPI-to-tool example, optimization with OR-Tools |
| 7. Agentic AI Workflows | `workflows.html` | Perception-to-feedback loop and an end-to-end Python example |
| 8. No-Code Agentic Workflows | `no-code.html` | n8n and Langflow flows, importable n8n templates, Python equivalents |
| 9. Code-based Agentic Workflows | `code-workflows.html` | Agent SDK comparison, a no-key mini framework, OpenRouter and Commonstack, the same agent in seven SDKs |
| 10. Agentic AI Governance | `governance.html` | Control layers, approval simulator, guardrail/evaluation code, embedded video |
| Glossary | `glossary.html` | 50 searchable terms with examples and related concepts |
| My progress | `progress.html` | Overall and per-module progress: videos watched and questions answered |
| Resources | `resources.html` | Curated links filtered by type, topic, and level, plus all notebooks |

## Folder structure

```
website/
  index.html, evolution.html, ...   one HTML file per page
  404.html                          GitHub Pages "not found" page
  .nojekyll                         serve files as-is (no Jekyll processing)
  assets/
    css/style.css                   all styles; design tokens at the top
    js/site.js                      header, sidebar, footer, theme, tabs, quizzes, video
    js/code.js                      code panels: highlight, copy, edit, run (Pyodide)
    js/diagram.js                   reusable, accessible SVG flow diagrams
    js/pages/*.js                   page-specific diagrams and widgets
    data/glossary.js                glossary terms (edit here)
    data/resources.js               curated resources (edit here)
    data/notebooks.js               generated list of notebooks
    exports/*.json                  importable n8n workflow templates
    guides/*.html                   step-by-step n8n guides by Usman Ibrahim (Module 8)
    img/                            logo and icons from the community site
  examples/*.py                     Python examples (single source of truth)
  notebooks/*.ipynb                 generated Google Colab notebooks
  tools/build.py                    injects code into pages, generates notebooks
  tools/check_links.py              checks internal and external links
  VERIFICATION.md                   test report and known limitations
```

## Run locally

You need Python 3.10 or newer (only the standard library is used).

```bash
cd website
python -m http.server 8000
```

Then open http://localhost:8000/. Opening the HTML files directly also works,
but running a local server is closer to how GitHub Pages serves the site.

## Module overview videos

Each module starts with a short narrated video (four slides: title, learning
objectives, what's inside, and key takeaway). Every slide carries the footer
"Dr. Alaa Khamis | Agentic AI Crash Course". Each video comes in three narration
languages, American English (the default), Arabic, and Urdu, with matching
captions. Learners switch languages above the player, and the choice is
remembered.

Files are in `assets/video/` (`module-NN-en.mp4`, `module-NN-ar.mp4`,
`module-NN-ur.mp4`, `.vtt`
captions, and `module-NN-poster.jpg`). To change the slides or narration, edit
`tools/deck_content.py` and rebuild:

```bash
pip install edge-tts gtts pillow imageio-ffmpeg
python tools/make_decks.py          # all modules (about 2 minutes each)
python tools/make_decks.py 4 9      # only modules 4 and 9
```

Narration uses free voices that need no account or API key: the Microsoft
neural voice `en-US-AndrewNeural` (through the `edge-tts` package) for English,
the Google Translate voice (through the `gTTS` package) for Arabic, and the
Microsoft male voice `ur-PK-AsadNeural` for Urdu. The
Google voice was chosen because the Microsoft Saudi voice mispronounced key
words. `gTTS` uses an unofficial Google service that can change or limit
requests at any time; to switch back, edit `VOICES` in `tools/make_decks.py`.
An internet connection is needed while rendering.

To improve Arabic pronunciation:

- English terms are spoken through the `AR_SPOKEN` list in `tools/make_decks.py`
  (for example, "OpenRouter" is spoken as "أوبن راوتر"). Captions keep the
  English spelling. Add a term there if it is mispronounced.
- Vowel marks (tashkeel) in `tools/deck_content.py` are removed before the text
  is sent to the Google voice, which reads unvoweled Arabic well. They are also
  removed from captions.

Then rebuild only one language with `python tools/make_decks.py --lang ar` (or
`--lang ur`). Urdu narration is in `tools/deck_content_ur.py`, and English terms
in it are spoken through `UR_SPOKEN`.
Slides use the Windows fonts Bahnschrift and Segoe UI.

## Quizzes and progress

Every module ends with three multiple-choice questions. The **My progress**
page (`progress.html`) and a progress bar beside each module's level show how far a learner has come.
Each module has four steps: watching at least 90 percent of the overview video,
and answering each of the three questions correctly. Progress is stored only
in the learner's browser (`localStorage`). It is not sent anywhere and does
not carry over to other devices.

## Course activity stats

The landing page shows three cards: **Unique visitors**, **Pageviews**, and
**Bounce rate**. Each card shows an all-time value, the
change from the week before last to last week, and small bars for the last
seven weeks (the highlighted bar is the current week so far).

The numbers come from [Abacus](https://abacus.jasoncameron.dev), a free counter
service that needs no account or API key (namespace
`agenticaikfupm-crashcourse`). Abacus can only add 1 to a counter, so
`assets/js/site.js` keeps these counters, each with a weekly copy:

| Counter | Adds 1 when |
|---|---|
| `unique-visits` / `visitors-WEEK` | a browser visits for the first time / for the first time that week |
| `pageviews` | any course page loads |
| `sessions` | a visit starts (after 30 minutes without activity) |
| `engaged` | a visit reaches its second page; the rest count as bounces |

Bounce rate is `1 - engaged / sessions`. Unique visitors and pageviews start at 100, the
estimated number of earlier visits (`STATS.base` in `assets/js/site.js`).

Counting happens only on `agenticaikfupm.github.io`, so a local copy only reads
the numbers. No personal data is sent; the browser remembers only whether it
was already counted. The numbers are estimates: clearing site data or changing
browsers counts a visitor again, ad blockers may skip counting, and anyone who
knows the counter names could add hits. If Abacus cannot be reached, the
section stays hidden. Abacus allows 30 requests per 10 seconds per visitor, so
the page spaces out its requests and caches weeks that no longer change.

## Edit content

- **Text and layout:** edit the HTML page. Each module page uses the same
  structure: a page header, `<section id="...">` blocks (the sidebar's
  "On this page" list is built from their `<h2>` headings), and `<nav id="pager">`.
- **Module list, repository, or Colab location:** edit the `SITE` object at the
  top of `assets/js/site.js`.
- **Glossary or resources:** edit `assets/data/glossary.js` or
  `assets/data/resources.js`. The pages update automatically.
- **Diagrams:** each diagram is data (nodes, edges, steps) in
  `assets/js/pages/*.js`, rendered by `assets/js/diagram.js`.
- **Colors and fonts:** edit the tokens at the top of `assets/css/style.css`.
  They match the Agentic AI @ KFUPM community site.

### Python examples and notebooks

The files in `examples/` are the single source of truth. After editing or
adding an example, run:

```bash
python tools/build.py
```

This copies each example into its code panel (`<figure class="code-panel"
data-example="file.py">`), regenerates `notebooks/*.ipynb` and
`assets/data/notebooks.js`, and warns about missing examples and em dashes.

Conventions:

- The module docstring's first line is the title; the rest becomes the
  notebook introduction.
- `# %%` splits notebook cells. `# !pip install ...` becomes a real install
  cell in the notebook. `# %%writefile name.py` as the first line of a cell
  becomes a Jupyter cell magic.
- `asyncio.run(main())` is automatically turned into `await main()` in
  notebooks and in the browser, where an event loop is already running.
- Examples that only use the standard library get a **Run** button
  (`data-run="browser"`). Examples that install packages use
  `data-run="colab"`.
- Examples with a stand-in `llm()` or `fake_llm()` function get an extra
  notebook cell that loads a small open model (no API key) so learners can
  compare.

## Deploy to GitHub Pages

1. Create the repository `agenticaikfupm/CrashCourse` (or use the existing one).
2. Copy the **contents** of this `website/` folder to the repository root and push:
   ```bash
   git init
   git add .
   git commit -m "Agentic AI crash course website"
   git branch -M main
   git remote add origin https://github.com/agenticaikfupm/CrashCourse.git
   git push -u origin main
   ```
3. On GitHub, open **Settings > Pages**. Under **Build and deployment**, choose
   **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at https://agenticaikfupm.github.io/CrashCourse/.

The "Open in Colab" buttons point to
`https://colab.research.google.com/github/agenticaikfupm/CrashCourse/blob/main/notebooks/...`,
so they work once the notebooks are pushed to the `main` branch. If you use a
different repository or branch, update `colabBase` and `githubBlobBase` in
`assets/js/site.js` and `SITE_URL` in `tools/build.py`, then run the build.
`404.html` uses the `/CrashCourse/` path prefix; change it if the repository
name changes.

## Check links

```bash
python tools/check_links.py            # internal and external links
python tools/check_links.py --offline  # internal links and anchors only
```

## Accessibility and browser support

- Semantic landmarks, a skip link, visible focus styles, and labeled controls.
- Diagrams are keyboard operable (Tab to a box, Enter or Space to select) and
  include a text description of every step for screen readers.
- Tabs follow the ARIA tabs pattern (arrow keys, Home, End).
- Light and dark themes follow the system setting and can be switched in the header.
- Animations respect "reduce motion".
- Tested in current Chromium-based browsers at phone, tablet, and desktop widths.

## API keys for Module 9

Most examples need no key. The Module 9 OpenRouter examples need a free
OpenRouter key stored as `OPENROUTER_API_KEY` (Colab Secrets or an environment
variable); the Claude Agent SDK example needs `ANTHROPIC_API_KEY`. Never commit
keys to the repository.

## Third-party services

Loaded only from public CDNs, with fallbacks:

- Google Fonts (Inter, Space Grotesk): falls back to system fonts.
- Prism 1.29.0 from cdnjs for syntax highlighting: falls back to plain code.
- Pyodide 0.26.4 from jsDelivr, loaded only when a learner presses **Run**:
  an error message points to Colab if it cannot load.
- YouTube, for the embedded video on the governance page. YouTube requires the
  page to send a referrer, so test the page through a local server (not by
  opening the file directly), or the player may show an error.
- Abacus (`abacus.jasoncameron.dev`), a free keyless counter for the landing
  page's activity stats: the section stays hidden if it cannot load.

## How to cite

To cite: Dr. Alaa Khamis. *Agentic AI Crash Course*. Agentic AI @ KFUPM
Community, KFUPM, 2026. https://agenticaikfupm.github.io/CrashCourse/

## License and credits

Course content by the Agentic AI @ KFUPM community. Module 8's Google Manager
and lost-and-found examples (n8n workflows, step-by-step guides in
`assets/guides/`, and the original notebooks) were contributed by Usman
Ibrahim and adapted for the course. Add a license file (for
example, CC BY 4.0 for content and MIT for code) before publishing if you want
others to reuse the material.
