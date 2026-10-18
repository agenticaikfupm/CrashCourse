"""Link checker for the course website.

Checks:
  * internal links and assets (href/src) point to existing files
  * #anchors on internal pages exist (static ids only; ids created by
    JavaScript, such as glossary terms and timeline milestones, are listed in
    DYNAMIC_IDS)
  * external URLs in HTML, data files, and notebooks respond (HTTP < 400)

Usage (from the website folder):
    python tools/check_links.py            # internal + external
    python tools/check_links.py --offline  # internal only

Standard library only. Some sites block automated requests; those are
reported as warnings so you can check them by hand.
"""
from __future__ import annotations

import concurrent.futures as cf
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_EXTERNAL = (
    "https://fonts.googleapis.com", "https://fonts.gstatic.com",      # preconnect hosts
    "https://colab.research.google.com/github/",                         # valid after the repo is pushed
    "https://github.com/agenticaikfupm/CrashCourse",                     # valid after the repo is pushed
    "https://agenticaikfupm.github.io/CrashCourse/",
)
# ids generated at runtime by page scripts
DYNAMIC_IDS = {
    "glossary.html": "*", "resources.html": "*",
    "patterns.html": {"basic", "sequential", "routing", "parallel", "tools", "reflection", "plan", "multi"},
    "evolution.html": {"gans", "transformers", "llms", "chatgpt", "mllms", "agents", "agentic", "vla", "physical"},
}


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for key in ("href", "src"):
            if a.get(key):
                self.links.append(a[key])


def parse(page: Path) -> Collector:
    c = Collector()
    c.feed(page.read_text(encoding="utf-8"))
    return c


def check_internal() -> tuple[list[str], set[str]]:
    errors, external = [], set()
    pages = {p.name: parse(p) for p in ROOT.glob("*.html")}
    for name, c in pages.items():
        for link in c.links:
            if link.startswith(("http://", "https://")):
                external.add(link)
                continue
            if link.startswith(("mailto:", "javascript:", "data:")) or name == "404.html":
                continue
            path, _, anchor = link.partition("#")
            target = name if not path else path.split("?")[0]
            if path and not (ROOT / target).exists():
                errors.append(f"{name}: missing file {link}")
                continue
            if anchor and target.endswith(".html"):
                ids = pages[target].ids if target in pages else set()
                dyn = DYNAMIC_IDS.get(target, set())
                if anchor not in ids and dyn != "*" and anchor not in dyn:
                    errors.append(f"{name}: missing anchor {link}")
    return errors, external


def urls_in_text_files() -> set[str]:
    found = set()
    files = list((ROOT / "assets").rglob("*.js")) + list((ROOT / "notebooks").glob("*.ipynb")) \
        + list((ROOT / "examples").glob("*.py")) + list((ROOT / "assets" / "exports").glob("*.json"))
    for f in files:
        for u in re.findall(r"https?://[^\s\"'<>)\\`]+", f.read_text(encoding="utf-8")):
            found.add(u.rstrip(".,;"))
    return found


def fetch(url: str) -> tuple[str, int | str]:
    headers = {"User-Agent": "Mozilla/5.0 (course link checker)", "Accept": "*/*"}
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(url, headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=20) as r:
                return url, r.status
        except urllib.error.HTTPError as e:
            if method == "GET" or e.code not in (403, 405, 400, 404):
                return url, e.code
        except Exception as e:  # noqa: BLE001
            if method == "GET":
                return url, type(e).__name__
    return url, "unknown"


def main() -> int:
    errors, external = check_internal()
    for e in errors:
        print("ERROR  ", e)
    print(f"Internal links: {len(errors)} problem(s)")
    if "--offline" in sys.argv:
        return 1 if errors else 0

    external |= urls_in_text_files()
    external = {u for u in external if not u.startswith(SKIP_EXTERNAL) and "{" not in u and "$" not in u}
    bad = []
    with cf.ThreadPoolExecutor(max_workers=12) as pool:
        for url, status in sorted(pool.map(fetch, sorted(external))):
            ok = isinstance(status, int) and status < 400
            print(("OK     " if ok else "CHECK  ") + f"{status}  {url}")
            if not ok:
                bad.append((url, status))
    print(f"\nExternal URLs checked: {len(external)}; need attention: {len(bad)}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
