"""Build the narrated module overview videos.

For every module in tools/deck_content.py this script:
  1. draws four 1280x720 slides (title, objectives, what's inside, takeaway)
     with the footer "Dr. Alaa Khamis | Agentic AI Crash Course"
  2. narrates each slide in American English (free Microsoft neural voice,
     edge-tts package) and Arabic (free Google Translate voice, gTTS package);
     neither needs an account or API key
  3. assembles one MP4 per language, timing each slide to its narration
  4. writes matching WebVTT captions and a poster image

Outputs (in assets/video/):
  module-01-en.mp4, module-01-ar.mp4, module-01-en.vtt, module-01-ar.vtt,
  module-01-poster.jpg, ... for all ten modules

Requirements: pip install edge-tts gtts pillow imageio-ffmpeg
Fonts: Windows Bahnschrift and Segoe UI (change FONT_DIR on other systems).
Narration uses online text-to-speech services, so an internet connection is needed.

Arabic pronunciation: English terms are spoken through AR_SPOKEN (Arabic
spellings), and narration may contain vowel marks; captions keep the original
English terms and drop the vowel marks.

Usage:  python tools/make_decks.py               # all modules, both languages
        python tools/make_decks.py 4 9           # only modules 4 and 9
        python tools/make_decks.py --lang ar     # only the Arabic versions
        python tools/make_decks.py --lang ur     # only the Urdu versions
"""
from __future__ import annotations

import asyncio
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import edge_tts
from gtts import gTTS
import imageio_ffmpeg
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from deck_content import DECKS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "video"
LOGO = ROOT / "assets" / "img" / "logo-mark.png"
FONT_DIR = Path("C:/Windows/Fonts")
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

FOOTER = "Dr. Alaa Khamis | Agentic AI Crash Course"
# Narration voices. English: free Microsoft neural voice (edge-tts).
# Arabic: free Google Translate voice (gTTS), chosen because the Microsoft
# Saudi voice mispronounced key words. To go back, set "engine": "edge" and
# "voice": "ar-SA-ZariyahNeural".
VOICES = {
    "en": {"engine": "edge", "voice": "en-US-AndrewNeural", "rate": "+0%"},
    "ar": {"engine": "gtts", "lang": "ar"},
    "ur": {"engine": "edge", "voice": "ur-PK-AsadNeural", "rate": "+0%"},   # Urdu: male voice
}

# How English terms are spoken in the Urdu narration (captions keep the English spelling).
UR_SPOKEN = {
    "OpenAI Agents SDK": "اوپن اے آئی ایجنٹس ایس ڈی کے",
    "Claude Agent SDK": "کلاڈ ایجنٹ ایس ڈی کے",
    "Magentic-One": "میگنیٹک ون",
    "Pydantic AI": "پائیڈینٹک اے آئی",
    "smolagents": "سمول ایجنٹس",
    "LangChain": "لینگ چین",
    "OpenRouter": "اوپن راؤٹر",
    "Commonstack": "کامن اسٹیک",
    "JSON-RPC": "جے سن آر پی سی",
    "OpenAPI": "اوپن اے پی آئی",
    "OR-Tools": "او آر ٹولز",
    "Langflow": "لینگ فلو",
    "Flowise": "فلو وائز",
    "AutoGen": "آٹو جین",
    "CrewAI": "کرو اے آئی",
    "Dify": "ڈیفائی",
    "n8n": "این ایٹ این",
    "Google Calendar": "گوگل کیلنڈر",
    "Gmail": "جی میل",
    "Telegram": "ٹیلی گرام",
}

# How English terms are spoken in the Arabic narration (captions keep the English spelling).
AR_SPOKEN = {
    "OpenAI Agents SDK": "حزمة أوبن إيه آي للوكلاء",
    "Claude Agent SDK": "حزمة كلود للوكلاء",
    "Magentic-One": "ماجنتك ون",
    "Pydantic AI": "بايدانتك إيه آي",
    "smolagents": "سمول إيجنتس",
    "LangChain": "لانغ تشين",
    "OpenRouter": "أوبن راوتر",
    "Commonstack": "كومون ستاك",
    "JSON-RPC": "جيسون آر بي سي",
    "OpenAPI": "أوبن إيه بي آي",
    "OR-Tools": "أو آر تولز",
    "Langflow": "لانغ فلو",
    "Flowise": "فلو وايز",
    "AutoGen": "أوتو جِن",
    "CrewAI": "كرو إيه آي",
    "Dify": "ديفاي",
    "n8n": "إن إيت إن",
    "Google Calendar": "تقويم جوجل",
    "Gmail": "جي ميل",
    "Telegram": "تيليجرام",
}


def spoken_form(text, lang):
    """Replace English terms with how they should be spoken in Arabic or Urdu."""
    table = {"ar": AR_SPOKEN, "ur": UR_SPOKEN}.get(lang)
    if table:
        for term in sorted(table, key=len, reverse=True):
            text = text.replace(term, table[term])
    return text


DIACRITICS = re.compile("[ً-ْٰ]")      # Arabic vowel marks, removed from captions

W, H, SS = 1280, 720, 2
BG_TOP, BG_BOTTOM = (6, 16, 12), (10, 30, 22)
GREEN, GREEN_LIGHT, TEAL, GOLD = (4, 106, 56), (76, 201, 140), (63, 199, 189), (217, 173, 60)
TEXT, TEXT2, MUTED, CARD, LINE = (233, 242, 236), (194, 212, 201), (147, 169, 156), (16, 32, 26), (43, 74, 60)
LEAD_IN, TAIL = 0.5, 0.9          # seconds of silence before and after each slide's narration


def font(kind, size):
    name = {"display": "bahnschrift.ttf", "bold": "segoeuib.ttf", "regular": "segoeui.ttf", "semi": "seguisb.ttf"}[kind]
    path = FONT_DIR / name
    if not path.exists():
        path = FONT_DIR / "segoeuib.ttf"
    f = ImageFont.truetype(str(path), size * SS)
    if kind == "display":
        try:
            f.set_variation_by_name("Bold")
        except Exception:
            pass
    return f


F = {
    "eyebrow": font("bold", 20), "title": font("display", 64), "h2": font("display", 46),
    "sub": font("regular", 28), "body": font("regular", 28), "num": font("bold", 22),
    "quote": font("display", 40), "footer": font("regular", 17), "footer_b": font("bold", 17),
    "org": font("bold", 20),
}


def S(v):
    return int(round(v * SS))


def wrap(draw, text, f, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=f) <= S(width):
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def background():
    """Vertical gradient with soft green and teal glows (rendered once)."""
    bg = Image.new("RGB", (S(W), S(H)))
    d = ImageDraw.Draw(bg)
    for y in range(S(H)):
        t = y / S(H)
        d.line([(0, y), (S(W), y)], fill=tuple(int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3)))
    glow = Image.new("RGB", bg.size, (0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse((S(-250), S(330), S(600), S(1000)), fill=(4, 64, 38))
    g.ellipse((S(820), S(-280), S(1500), S(330)), fill=(8, 62, 58))
    glow = glow.filter(ImageFilter.GaussianBlur(S(120)))
    return ImageChops.add(bg, glow.point(lambda v: v // 2))


BASE = None


def frame(deck, idx, total):
    """Common frame: logo, module tag, footer with slide counter."""
    global BASE
    if BASE is None:
        BASE = background()
    im = BASE.copy()
    d = ImageDraw.Draw(im)
    # header
    d.rounded_rectangle((S(56), S(40), S(104), S(88)), radius=S(12), fill=(236, 244, 239))
    logo = Image.open(LOGO).convert("RGBA").resize((S(40), S(40)), Image.LANCZOS)
    im.paste(logo, (S(60), S(44)), logo)
    d.text((S(118), S(50)), "Agentic AI @ KFUPM", font=F["org"], fill=TEXT)
    tag = f"MODULE {deck['num']:02d}"
    tw = d.textlength(tag, font=F["eyebrow"]) / SS
    d.rounded_rectangle((S(W - 56 - tw - 32), S(44), S(W - 56), S(84)), radius=S(20), outline=GREEN_LIGHT, width=S(2))
    d.text((S(W - 56 - tw - 16), S(52)), tag, font=F["eyebrow"], fill=GREEN_LIGHT)
    # footer
    d.line((S(56), S(H - 56), S(W - 56), S(H - 56)), fill=LINE, width=S(1.5))
    d.text((S(56), S(H - 44)), FOOTER, font=F["footer"], fill=MUTED)
    counter = f"{idx} / {total}"
    cw = d.textlength(counter, font=F["footer_b"]) / SS
    d.text((S(W - 56 - cw), S(H - 44)), counter, font=F["footer_b"], fill=TEXT2)
    # progress dots
    for k in range(total):
        x = W / 2 - (total - 1) * 11 + k * 22
        r = 5 if k == idx - 1 else 3.5
        d.ellipse((S(x - r), S(H - 34 - r), S(x + r), S(H - 34 + r)), fill=GREEN_LIGHT if k == idx - 1 else LINE)
    return im, d


def slide_title(deck):
    im, d = frame(deck, 1, 4)
    d.line((S(96), S(260), S(136), S(260)), fill=GREEN_LIGHT, width=S(3))
    d.text((S(150), S(246)), "AGENTIC AI CRASH COURSE", font=F["eyebrow"], fill=GREEN_LIGHT)
    y = 290
    for line in wrap(d, deck["title"], F["title"], 1080):
        d.text((S(94), S(y)), line, font=F["title"], fill=TEXT)
        y += 78
    for line in wrap(d, deck["subtitle"], F["sub"], 1060):
        d.text((S(96), S(y + 14)), line, font=F["sub"], fill=TEXT2)
        y += 40
    return im


def slide_list(deck, idx, heading, items, numbered):
    im, d = frame(deck, idx, 4)
    d.text((S(94), S(132)), heading, font=F["h2"], fill=TEXT)
    d.line((S(96), S(198), S(160), S(198)), fill=GREEN_LIGHT, width=S(3))
    y = 236
    for k, item in enumerate(items, 1):
        lines = wrap(d, item, F["body"], 960)
        h = 40 * len(lines) + 30
        d.rounded_rectangle((S(94), S(y), S(W - 94), S(y + h)), radius=S(16), fill=CARD, outline=LINE, width=S(1.5))
        if numbered:
            d.ellipse((S(116), S(y + h / 2 - 20), S(156), S(y + h / 2 + 20)), fill=GREEN)
            label = str(k)
            lw = d.textlength(label, font=F["num"]) / SS
            d.text((S(136 - lw / 2), S(y + h / 2 - 15)), label, font=F["num"], fill=(255, 255, 255))
        else:
            d.ellipse((S(128), S(y + h / 2 - 7), S(142), S(y + h / 2 + 7)), fill=TEAL)
        ty = y + 14
        for line in lines:
            d.text((S(178), S(ty)), line, font=F["body"], fill=TEXT)
            ty += 40
        y += h + 16
    return im


def slide_takeaway(deck):
    im, d = frame(deck, 4, 4)
    d.text((S(94), S(132)), "Key takeaway", font=F["h2"], fill=TEXT)
    d.line((S(96), S(198), S(160), S(198)), fill=GOLD, width=S(3))
    lines = wrap(d, deck["takeaway"], F["quote"], 1000)
    box_h = 56 * len(lines) + 80
    top = 250
    d.rounded_rectangle((S(94), S(top), S(W - 94), S(top + box_h)), radius=S(22), fill=(14, 40, 30), outline=GREEN_LIGHT, width=S(2))
    d.rectangle((S(94), S(top + 18), S(102), S(top + box_h - 18)), fill=GREEN_LIGHT)
    y = top + 40
    for line in lines:
        d.text((S(134), S(y)), line, font=F["quote"], fill=TEXT)
        y += 56
    return im


def render_slides(deck, workdir):
    slides = [
        slide_title(deck),
        slide_list(deck, 2, "Learning objectives", deck["objectives"], True),
        slide_list(deck, 3, "What's inside", deck["contents"], False),
        slide_takeaway(deck),
    ]
    paths = []
    for i, im in enumerate(slides, 1):
        p = workdir / f"slide{i}.png"
        im.resize((W, H), Image.LANCZOS).save(p)
        paths.append(p)
    return paths


async def edge_speak(text, voice, rate, path):
    await edge_tts.Communicate(text, voice, rate=rate).save(str(path))


def speak(text, lang, path):
    v = VOICES[lang]
    spoken = spoken_form(text, lang)
    if v["engine"] == "gtts":
        # Google reads unvoweled Arabic well, so the vowel marks are removed here.
        gTTS(DIACRITICS.sub("", spoken), lang=v["lang"]).save(str(path))
    else:
        asyncio.run(edge_speak(spoken, v["voice"], v["rate"], path))


def duration(path):
    out = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True).stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def ts(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def vtt_cues(text, start, end):
    """Split a slide's narration into sentence cues spread over its time."""
    sentences = [s.strip() for s in re.split(r"(?<=[.!?؟۔])\s+", text) if s.strip()]   # ۔ ends Urdu sentences
    total = sum(len(s) for s in sentences) or 1
    cues, t = [], start
    for s in sentences:
        dt = (end - start) * len(s) / total
        cues.append((t, t + dt, s))
        t += dt
    return cues


def build(deck, lang, slides, workdir):
    segs, cues, clock = [], [], 0.0
    for i, (slide, text) in enumerate(zip(slides, deck["narration"][lang]), 1):
        mp3 = workdir / f"{lang}{i}.mp3"
        speak(text, lang, mp3)
        speech = duration(mp3)
        d = LEAD_IN + speech + TAIL
        seg = workdir / f"{lang}{i}.mp4"
        fade_out = d - 0.35
        subprocess.run([
            FFMPEG, "-y", "-loglevel", "error",
            "-loop", "1", "-framerate", "25", "-t", f"{d:.3f}", "-i", str(slide),
            "-i", str(mp3),
            "-filter_complex",
            f"[0:v]fade=t=in:st=0:d=0.35,fade=t=out:st={fade_out:.3f}:d=0.35,format=yuv420p[v];"
            f"[1:a]adelay={int(LEAD_IN * 1000)}:all=1,apad[a]",
            "-map", "[v]", "-map", "[a]", "-t", f"{d:.3f}",
            "-c:v", "libx264", "-preset", "medium", "-tune", "stillimage", "-crf", "24", "-r", "25",
            "-c:a", "aac", "-b:a", "96k", "-ar", "48000", "-ac", "1",
            str(seg)], check=True)
        segs.append(seg)
        cues += vtt_cues(DIACRITICS.sub("", text), clock + LEAD_IN, clock + LEAD_IN + speech)
        clock += d

    listing = workdir / f"{lang}.txt"
    listing.write_text("".join(f"file '{s.as_posix()}'\n" for s in segs), encoding="utf-8")
    base = OUT / f"module-{deck['num']:02d}-{lang}"
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(listing),
                    "-c", "copy", "-movflags", "+faststart", str(base.with_suffix(".mp4"))], check=True)
    vtt = ["WEBVTT", ""]
    for k, (a, b, s) in enumerate(cues, 1):
        vtt += [str(k), f"{ts(a)} --> {ts(b)}", s, ""]
    base.with_suffix(".vtt").write_text("\n".join(vtt), encoding="utf-8")
    return clock


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    args = sys.argv[1:]
    langs = ("en", "ar", "ur")
    if "--lang" in args:
        i = args.index("--lang")
        langs = (args[i + 1],)
        del args[i:i + 2]
    wanted = {int(a) for a in args} or None
    for deck in DECKS:
        if wanted and deck["num"] not in wanted:
            continue
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp)
            slides = render_slides(deck, work)
            Image.open(slides[0]).convert("RGB").save(OUT / f"module-{deck['num']:02d}-poster.jpg", quality=88)
            lengths = {lang: build(deck, lang, slides, work) for lang in langs}
        sizes = {lang: (OUT / f"module-{deck['num']:02d}-{lang}.mp4").stat().st_size // 1024 for lang in lengths}
        print(f"Module {deck['num']:2d}: " + ", ".join(f"{k} {v:.0f} s ({sizes[k]} KB)" for k, v in lengths.items()))


if __name__ == "__main__":
    main()
