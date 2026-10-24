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

## 8. Update: ten modules (Modules 4 and 9 added)

Date: 2026-10-19.

- **New Module 4, Always-on AI Agents** (`always-on.html`). Product facts for
  OpenAI dots, Grok Bot, Instinct, and Meta Muse were taken from each official
  page, read in a browser on this date. The Instinct page does not describe
  background work or approvals, and the module says so instead of guessing.
- **New Module 9, Code-based Agentic Workflows** (`code-workflows.html`).
  SDK code follows each SDK's current official docs.
- **Renumbering:** module lists, page headers, cross-references, the build
  script, notebook headers, the home page, and the README now use 10 modules.
- **Examples:** 38 in total, 26 of them run in the browser. All 26 pass with
  CPython. The two new no-key notebooks also pass under Jupyter.
- **Key-based examples:** the eight OpenRouter and SDK examples were run with
  a deliberately invalid key, using these versions: openai-agents 0.24.0,
  langchain 1.4.6 with langchain-openrouter 0.2.9, crewai 1.15.28,
  smolagents 1.26.0, pydantic-ai-slim 2.57.0, autogen-agentchat 0.7.5, and
  claude-agent-sdk 0.2.168. Every one built its agent and tool and reached the
  provider, then stopped at the expected authentication error (HTTP 401). With
  a valid key they get past authentication, but they have **not** been run
  against a live model.
- **Package conflict found:** CrewAI requires `openai` 2.x, while the OpenAI
  Agents SDK requires 3.x. The page tells learners to use a separate Colab
  runtime for each notebook.
- **Model IDs:** the free examples use OpenRouter's `openrouter/free` router,
  which supports tool calling (checked against the live catalog). The
  commercial examples check each model ID against the live catalog and skip
  any that are missing, because model lists change often.
- **Links:** 0 internal problems. The OpenRouter and Commonstack base URLs
  return 404 when opened directly, which is expected: they only answer on
  endpoints such as `/chat/completions`.
- **Layout:** no horizontal overflow on any page at 360 px or 768 px. The header
  was tightened for phones 360 px wide.

## 9. Update: overview videos, three questions per module, progress tracking

Date: 2026-10-22.

- **Overview videos:** 20 MP4 files in `assets/video/`, one in English and one
  in Arabic (free Google Translate voice) for each module. Each has 4 slides at 1280x720 with the
  footer "Dr. Alaa Khamis | Agentic AI Crash Course", plus matching WebVTT
  captions and a poster image. English versions run 44 to 56 seconds and
  Arabic versions 59 to 77 seconds. The 50 files total about 25 MB. Frames
  from several modules were checked for text wrapping and layout.
- **Language switch:** English is selected by default. Switching to Arabic
  loads the Arabic video and captions, and the choice is remembered across
  pages. Tested in the browser.
- **Questions:** every module page now ends with three multiple-choice
  questions. Wrong answers ask the learner to try again; correct answers show
  an explanation and are saved. Tested on Module 4, including the score line
  ("3 of 3").
- **Progress:** the progress bar beside each module's level (a bar without a percentage, with the exact value for screen readers and as a tooltip) and `progress.html` update live. A module counts
  as complete after watching at least 90 percent of the overview video and
  answering all three questions correctly; this was tested end to end on
  Module 4. Progress is stored only in the browser's `localStorage`.
- **Pages:** all 14 pages load without script errors and without horizontal
  overflow at 360 px and 1280 px.
- **Arabic narration:** uses the free Google Translate voice (`gTTS`), chosen by
  the course author after comparing ten free voices, because the Microsoft Saudi
  voice mispronounced key words even with vowel marks. English terms are spoken
  through Arabic spellings; captions keep the English terms. `gTTS` relies on
  an unofficial Google service. A native speaker should still review the
  narration before publishing.
- **Local testing note:** Python's built-in test server does not support the
  range requests that video seeking needs, so seeking only works on GitHub
  Pages or another full web server.
- **Urdu narration (added later):** a third narration language, read by the
  free Microsoft male voice `ur-PK-AsadNeural`, with Urdu captions. English
  product names are spoken through Urdu-script spellings, and captions keep the
  English names. A native Urdu speaker should review the narration before
  publishing.

## 10. Update: course activity stats

- **Landing page:** a "Course activity" section after the hero shows Unique
  visitors, Pageviews, and Bounce rate, each with a trend and seven weekly
  bars. (Visit duration was shown at first and later removed; see section 11.)
- **Live data, local copy:** shows 100 visitors, 100 pageviews, and "n/a" for
  bounce rate and duration (no visits counted yet). No hits were sent from the
  local copy, only reads.
- **Sample data:** with sample counters, the cards showed "3k", "8.5k", "44%",
  and "1m 35s". The trends were "up 25%", "up 21.2%", "down 2.1 pts" (green,
  because a lower bounce rate is better), and "down 9.7%" (red). All were
  checked by hand.
- **Tracking:** with the network stubbed, a first page sent pageview, visitor
  (all time and weekly), session, and 30-second ticks. A second page in the
  same visit sent only the pageview and the "engaged" mark.
- **Requests:** a first visit to the landing page makes about 40 reads; the
  page keeps under the limit of 30 per 10 seconds (25 sent, the rest after a
  short wait). Later visits read about 15, because older weeks are cached.
  Weekly counters that do not exist yet return 404, which shows as console
  errors until those weeks have data; the page treats them as 0.
- **Layout:** four columns on desktop, a 2 by 2 grid below 900 px, no
  horizontal overflow at 360 px, and readable colors in both themes.
- **Note:** during testing, 14 stray hits reached an earlier counter named
  `time30`. It cannot be reset without an admin key, so the time counter was
  renamed to `active30`, which is clean.

## 11. Update: Module 8 examples by Usman Ibrahim, stats without visit duration

- **New Examples 1 and 2 on `no-code.html`:** Google Manager (Gmail and
  Calendar with approval in chat) and a lost-and-found assistant on Telegram,
  both by Usman Ibrahim. The credit "Example contributed by Usman Ibrahim"
  appears in each code panel, after the title, and in the generated notebooks;
  it is not repeated in the page text or the video. Email triage is now Example 3, the research
  digest Example 4, and document Q&A Example 5. Each new example has the
  page's usual parts: objective, inputs, and outputs; an animated n8n diagram;
  step-by-step text; a link to Usman's guide (`assets/guides/`); an
  interactive simulator; and a Python version that runs in the browser.
- **Python examples:** `nc_google_manager.py` and `nc_lost_found.py` run with
  CPython and in the browser (Pyodide) with the same output. The course now
  has 40 examples.
- **Simulators:** checked case by case. Google Manager: send with Approve or
  Decline, delete from an email run (blocked), duplicate and conflicting
  events. Lost-and-found: a full description (one match, LF002), a missing
  date (one question), the claimed backpack (no match, LF007 never returned),
  and an inventory request (refusal).
- **SDK versions:** the improved OpenAI Agents SDK code now lives in Module 9
  (see section 12); Module 8 links to it.
- **Stats:** the live counters gave 151 visitors, 251 pageviews, and a 51%
  bounce rate, matching the figures the course author reported, so the base
  values were not changed. The Visit duration card and its 30-second tracking
  requests were removed; the remaining three cards use three columns, or one
  column below 640 px.
- **Fixes found while testing:** long dropdown text made the page wider than
  a phone screen, and a header rule enlarged green tags on phones (also in
  the home page labs list). Both are fixed.
- **Checks:** `python tools/build.py` reports no warnings, internal links have
  0 problems, and no page overflows horizontally at phone width.
- **Module 8 videos:** the slides and narration now describe the five
  examples. All three were regenerated: English 61 s, Arabic 113 s,
  Urdu 72 s. Arabic and Urdu say Gmail, Google Calendar, and
  Telegram in local script, and the captions keep the English names. A native
  speaker should review the new Arabic and Urdu sentences.
- **Urdu captions, all modules:** the caption splitter did not recognize the
  Urdu full stop, so each slide showed one paragraph-long caption (up to 725
  characters). The splitter is fixed, and all ten Urdu caption files were
  rebuilt with one cue per sentence, keeping the recorded slide timings. No
  audio or video changed except Module 8.

## 12. Update: Google Manager and lost-and-found in Module 9 (code)

- **New Examples 3 and 4 on `code-workflows.html`:** improved OpenAI Agents
  SDK versions of Usman Ibrahim's notebooks, in the module's usual format
  (`examples/cw_google_manager.py` and `examples/cw_lost_found.py`, with
  generated notebooks). Each starts with "Example contributed by Usman
  Ibrahim." after the title. Module 8's Examples 1 and 2 now link to them,
  and the two separate notebooks added earlier were removed so there is one
  version of each. The course now has 42 examples; Module 9 has 12 and
  takes about 65 minutes.
- **Improvements over the originals:** a free OpenRouter model by default,
  like the rest of Module 9; email runs use a clone of the agent without
  send, reply, or delete tools; faster email listing; HTML bodies converted
  to text and shortened; a clear message when a deleted event is recreated;
  search ignores empty and "Unknown" fields and matches dates such as
  "16 October 2026" within a few days; claims check the contact format and
  refuse duplicates.
- **Checks with openai-agents 0.24.0:** the lost-and-found example ran with
  a deliberately invalid key. It created the tables, ranked LF002 first,
  built the agent and its guardrail, and stopped at the expected
  authentication error (HTTP 401). The Google Manager's tool and agent cells
  ran with a stand-in for Gmail and Calendar: event creation, duplicate
  detection, conflict detection, and the deleted-event case all behaved as
  expected; the four sensitive tools require approval; and email runs get
  only the four safe tools. Every notebook cell compiles. Neither example
  was run against a live model or a real Google account.
