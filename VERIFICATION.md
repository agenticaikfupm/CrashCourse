# Verification report

Date: 2026-10-18. Environment: Windows 11, Python 3.13, Chromium-based
browser (Claude desktop browser pane), local static server.

## 1. Pages tested

| Page | Loads without JS errors | Header, sidebar, footer | Interactive parts checked |
| --- | --- | --- | --- |
| `index.html` | Yes | Yes | Hero animation, labs list (27 entries), theme toggle |
| `evolution.html` | Yes | Yes | Timeline (click, arrow keys, deep links such as `#vla`), release lanes, quiz |
| `components.html` | Yes | Yes | Architecture diagram (Play, Next, Back, Restart), node selection by mouse and keyboard, detail panel, code tabs |
| `patterns.html` | Yes | Yes | 8 pattern tabs, lazy diagram rendering, deep links (`#routing`), quiz |
| `mcp.html` | Yes | Yes | MCP workflow diagram (7 steps) |
| `decision-apis.html` | Yes | Yes | Decision diagram, live decision table (results match the Python example), quiz |
| `workflows.html` | Yes | Yes | Loop diagram with stage selection and input/output panel |
| `no-code.html` | Yes | Yes | Three workflow diagrams, template downloads |
| `governance.html` | Yes | Yes | Control-layer diagram, approval simulator (results match the Python example), embedded YouTube video |
| `glossary.html` | Yes | Yes | Search with highlighting, category filter, A to Z jump bar, empty state, related-term links |
| `resources.html` | Yes | Yes | Search, type, topic, and level filters; reset; 108 entries including 27 notebooks |
| `404.html` | Yes | Minimal by design | Uses `/CrashCourse/` paths, so it is styled only on GitHub Pages |

## 2. Links

Checked with `python tools/check_links.py`:

- **Internal links and anchors:** 0 problems across all pages (including
  anchors created by scripts, such as pattern tabs and timeline milestones).
- **External URLs:** 92 checked; 90 responded with HTTP 200-399.
  The 2 flagged are expected:
  - `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/` is a folder URL (403). The
    actual file `pyodide.js` loads, and the Run buttons work.
  - `https://export.arxiv.org/api/query` returns 400 without a query. With a
    query it returns results (checked separately).
- **Research papers:** all 17 arXiv IDs were checked against the arXiv API,
  and every title matches the citation on the Resources page.
- **Video:** YouTube oEmbed confirms ID `tKUIOIisdZc` is "AI: Dangers are
  real and imminent - Briefing | United Nations" (United Nations channel).
  The page describes it with that title. YouTube needs the page to send a
  referrer, so the player works over http(s) but may show an error when the
  HTML file is opened directly from disk.
- **Not checked until the repository is pushed:** "Open in Colab" links and
  links into `github.com/agenticaikfupm/CrashCourse`. They follow Colab's
  documented GitHub URL format and will resolve once `notebooks/` is on the
  `main` branch.

## 3. Code examples

27 examples in `examples/`, each with a generated Colab notebook.

| Group | Examples | How tested | Result |
| --- | --- | --- | --- |
| Browser-runnable (standard library only) | 24 | Run with CPython 3.13, and with the in-page **Run** button (Pyodide 0.26.4) on every page | All pass; same output in both |
| `mcp_server.py` (official `mcp` SDK) | 1 | Notebook executed with Jupyter (nbclient) in an isolated virtual environment, `mcp` 2.3.0 | Pass (see 3.1) |
| `dec_ortools.py` (OR-Tools CP-SAT) | 1 | Notebook executed with Jupyter, `ortools` 9.15 | Pass: optimal total of 20 minutes, matching the browser example |
| `evo_hf_multimodal.py` (Transformers, CLIP) | 1 | Code reviewed; not executed (needs about 1 GB of model downloads and PyTorch) | Not executed |

All 24 standard-library notebooks were also executed with Jupyter (nbclient)
to confirm the notebook conversions, such as `await main()`, work: 24 of 24 pass.

Also verified: Edit, Run edited code, Reset, and syntax highlighting.
Copy uses the Clipboard API and falls back to the legacy method when the
browser refuses access.

The optional "try a real open model" notebook cell (Qwen2.5-0.5B-Instruct
through Transformers) was not executed for the same download-size reason.

### 3.1 Notebooks with packages

- **`mcp_server.ipynb`**: the notebook writes `course_server.py`, launches it
  over stdio, and prints `Tools: ['add']`, `add(2, 3) -> 5`, the resource text,
  and the rendered prompt.
  Testing found that **`mcp` 2.x renamed `FastMCP` to `MCPServer`** and
  removed the old import path. The example now uses `MCPServer`, the install
  cell pins `mcp[cli]>=2`, and the page notes the old name.
  The client now writes server logs to a file (`errlog=`), because Jupyter
  kernels on Windows do not provide a real stderr handle to subprocesses.
- **`dec_ortools.ipynb`**: prints the optimal assignment (total 20 minutes).
- **Build fix found while testing:** the cell splitter in `tools/build.py`
  treated `# %%writefile` as a cell break. It now keeps it as the first line
  of the cell.

## 4. Responsiveness and themes

- Horizontal overflow measured on every page at 375 px (phone), 768 px
  (tablet), and 1366 px (desktop): no page-level horizontal scrolling.
  Wide diagrams and tables scroll inside their own frame on phones, with a
  "swipe" hint.
- The sidebar becomes a collapsible "Course map" below 1080 px, and the main
  menu becomes a toggle below 960 px.
- Light and dark themes checked on the home and module pages. The theme
  follows the system setting by default and is remembered after toggling.

## 5. Accessibility checks

- Skip link, landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page.
- Diagram boxes are focusable buttons with labels. Enter and Space select
  them, and each diagram includes a hidden text list of its steps.
- Tabs support arrow keys, Home, and End. Live regions announce quiz feedback,
  run status, search counts, and diagram steps.
- Animations stop when "reduce motion" is enabled.
- Not done: a full screen-reader walkthrough (NVDA, VoiceOver) and an
  automated contrast audit. Colors reuse the community site's tokens.

## 6. Content and style checks

- `tools/build.py` scans every content file for em dashes: none found.
- A scan for common British spellings found none in content. The only
  matches are the HTML attribute `aria-labelledby` and words such as
  "realistic" and "Non-programmers".
- Illustrative examples, invented rules, and simulations are labeled on the page.

## 7. Known limitations

1. **Decision APIs: JEV and OpenAPI Decisions.** The page includes a clearly
   marked "Content in preparation" placeholder. Verified descriptions and
   links are needed from the course team.
2. **Evolution slide label "VLA, SLA & MHS."** Now fully covered: SLA and MHS
   definitions come from the sources the course team provided (the OpenSLA
   project page and arXiv paper 2610.08244, verified, and Anthropic's Model
   Hardware Standard announcement of August 27, 2026).
3. **Frontier model release lanes** (OpenAI and Anthropic, 2022 to 2026) are
   reproduced from the course slide and attributed to it. Items were placed
   in time periods based on their position on the slide.
4. **n8n templates** have a valid structure, but they were not imported into a
   live n8n instance. Placeholder nodes marked "(configure)" must be replaced,
   and credentials added. Node versions may need updating in future n8n releases.
5. **Agency-level bars** on the patterns page are an illustrative rating by
   the course team. The slides leave agency level as an open question.
6. The **Run** button downloads Pyodide (about 10 MB) on first use, so it
   needs an internet connection. Code that needs packages runs in Colab only.
7. The glossary and resources lists need JavaScript. Without it, a message
   points to the data files. All other pages keep their full text and code
   without JavaScript.
8. `404.html` assumes the site is served at `/CrashCourse/`.
