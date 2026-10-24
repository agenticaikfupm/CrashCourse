"""Lost-and-found agent with the OpenAI Agents SDK

Example contributed by Usman Ibrahim.

The code version of Module 8's Example 2. The agent asks one open question at
a time, searches the found-item table privately, reveals at most one plausible
match, and files a claim only after the user confirms a summary. A second
agent acts as an output guardrail that blocks any reply exposing the inventory
or other people's claims.

| n8n node           | SDK concept                              |
|--------------------|------------------------------------------|
| AI Agent           | Agent                                    |
| Search Found Items | @function_tool search_found_items        |
| Submit Claim       | @function_tool submit_claim              |
| Simple Memory      | SQLiteSession                            |
| Guardrails node    | @output_guardrail with a reviewer agent  |

Requires OPENROUTER_API_KEY. Runs in Colab or locally.
"""
# %%
# !pip -q install openai-agents pandas

# %%
# 1. Model connection through OpenRouter. The guardrail needs a model that
#    supports structured output; set OPENROUTER_MODEL to pick a specific one.
import os
from getpass import getpass

from openai import AsyncOpenAI
from agents import OpenAIChatCompletionsModel, set_tracing_disabled

key = os.environ.get("OPENROUTER_API_KEY")
if not key:
    try:
        from google.colab import userdata
        key = userdata.get("OPENROUTER_API_KEY")
    except Exception:
        key = getpass("Paste your OPENROUTER_API_KEY (input is hidden): ")
MODEL_ID = os.environ.get("OPENROUTER_MODEL", "openrouter/free")
MODEL = OpenAIChatCompletionsModel(
    model=MODEL_ID, openai_client=AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=key))
set_tracing_disabled(True)        # tracing uploads need an OpenAI key
print("Model:", MODEL_ID)

# %%
# 2. Data tables: found items (read only) and claims (starts empty).
import asyncio
import json
import re
import uuid
from datetime import date, datetime, timezone
from pathlib import Path

import pandas as pd

DATA_DIR = Path("lost_found_data")
DATA_DIR.mkdir(exist_ok=True)
FOUND_ITEMS_PATH, CLAIMS_PATH = DATA_DIR / "found_items.csv", DATA_DIR / "claims.csv"
CLAIM_COLUMNS = ["claim_id", "item_id", "claimant_name", "contact", "ownership_details", "status", "created_at"]

FOUND_ITEMS = [
    {"item_id": "LF001", "category": "Headphones", "color": "Black", "brand": "Sony", "location": "Main Library", "date_found": "2026-10-15", "description": "Black over-ear headphones with a small scratch on the left side", "status": "Available"},
    {"item_id": "LF002", "category": "Earbuds", "color": "Black", "brand": "Samsung", "location": "Main Library", "date_found": "2026-10-16", "description": "Wireless earbuds inside a black charging case", "status": "Available"},
    {"item_id": "LF003", "category": "Headphones", "color": "White", "brand": "JBL", "location": "Engineering Building", "date_found": "2026-10-15", "description": "White over-ear headphones with blue padding", "status": "Available"},
    {"item_id": "LF004", "category": "Wallet", "color": "Brown", "brand": "Unknown", "location": "Student Center", "date_found": "2026-10-14", "description": "Brown leather wallet with no identification inside", "status": "Available"},
    {"item_id": "LF005", "category": "Phone", "color": "Black", "brand": "Apple", "location": "Cafeteria", "date_found": "2026-10-17", "description": "Black phone in a transparent case", "status": "Available"},
    {"item_id": "LF006", "category": "Keys", "color": "Silver", "brand": "Unknown", "location": "Parking Area B", "date_found": "2026-10-16", "description": "Three keys on a red keyring", "status": "Available"},
    {"item_id": "LF007", "category": "Backpack", "color": "Blue", "brand": "Adidas", "location": "Lecture Hall 2", "date_found": "2026-10-13", "description": "Navy backpack containing two notebooks", "status": "Claimed"},
    {"item_id": "LF008", "category": "Watch", "color": "Black", "brand": "Casio", "location": "Sports Center", "date_found": "2026-10-17", "description": "Digital watch with a black rubber strap", "status": "Available"},
]
if not FOUND_ITEMS_PATH.exists():
    pd.DataFrame(FOUND_ITEMS).to_csv(FOUND_ITEMS_PATH, index=False)
if not CLAIMS_PATH.exists():
    pd.DataFrame(columns=CLAIM_COLUMNS).to_csv(CLAIMS_PATH, index=False)
print(len(FOUND_ITEMS), "found items,", len(pd.read_csv(CLAIMS_PATH)), "claims")

# %%
# 3. Search tool. Scores Available records and returns up to 3 candidates for
#    the agent to compare privately. Empty and "Unknown" fields never match,
#    and dates such as "16 October 2026" or "Oct 15" match within a few days.
from agents import function_tool

MONTHS = ["january", "february", "march", "april", "may", "june", "july",
          "august", "september", "october", "november", "december"]


def parse_date(text):
    if m := re.search(r"(\d{4})-(\d{2})-(\d{2})", text):
        return date(*map(int, m.groups()))
    words = re.findall(r"[a-z]+|\d+", text.lower())
    for i, w in enumerate(words):
        month = next((n for n, name in enumerate(MONTHS, 1) if len(w) >= 3 and name.startswith(w)), None)
        if month:
            day = next((int(x) for x in words[max(0, i - 1):i + 2] if x.isdigit() and int(x) <= 31), None)
            year = next((int(x) for x in words[i + 1:i + 3] if x.isdigit() and len(x) == 4), date.today().year)
            if day:
                return date(year, month, day)
    return None


def match_score(query, value):
    query, value = query.strip().lower(), value.strip().lower()
    if not query or not value or value == "unknown":
        return 0
    if query in value or value in query:
        return 3
    return min(len(set(query.split()) & set(value.split())), 2)


def date_score(query, found):
    asked = parse_date(query) if query.strip() else None
    if not asked:
        return 0
    gap = abs((date.fromisoformat(found) - asked).days)
    return 3 if gap == 0 else 2 if gap == 1 else 1 if gap <= 3 else 0


def find_matches(category="", color="", brand="", location="", approximate_date="", distinguishing_features=""):
    fields = {"category": category, "color": color, "brand": brand,
              "location": location, "description": distinguishing_features}
    if not any(v.strip() for v in [*fields.values(), approximate_date]):
        return {"error": "At least one search detail is required."}
    ranked = []
    for record in pd.read_csv(FOUND_ITEMS_PATH, dtype=str).fillna("").to_dict("records"):
        if record["status"].lower() != "available":
            continue
        score = sum(match_score(v, record[f]) for f, v in fields.items()) + date_score(approximate_date, record["date_found"])
        if score >= 3:
            ranked.append((score, record))
    ranked.sort(key=lambda pair: -pair[0])
    return {"matches": [record for _, record in ranked[:3]]}


@function_tool
def search_found_items(category: str = "", color: str = "", brand: str = "", location: str = "",
                       approximate_date: str = "", distinguishing_features: str = "") -> str:
    """Search available found-item records using details supplied by the user."""
    return json.dumps(find_matches(category, color, brand, location, approximate_date, distinguishing_features))


print([m["item_id"] for m in find_matches("earbuds", "black", location="Main Library",
                                          approximate_date="16 October 2026")["matches"]])

# %%
# 4. Claim tool. Refuses unconfirmed, incomplete, or repeated claims and checks
#    the contact format. "Pending Review" records a claim; it does not prove ownership.
CONTACT = re.compile(r"[^@\s]+@[^@\s]+\.\w+|\+?[\d\s()-]{7,}")


@function_tool
def submit_claim(item_id: str, claimant_name: str, contact: str, ownership_details: str, user_confirmed: bool) -> str:
    """Submit a claim only after the user explicitly confirms the final summary."""
    if not user_confirmed:
        return json.dumps({"error": "The user must explicitly confirm before submission."})
    if not all(v.strip() for v in (item_id, claimant_name, contact, ownership_details)):
        return json.dumps({"error": "Claim information is incomplete."})
    if not CONTACT.fullmatch(contact.strip()):
        return json.dumps({"error": "Contact must be an email address or a phone number."})
    item_id = item_id.strip().upper()
    items = pd.read_csv(FOUND_ITEMS_PATH, dtype=str).fillna("")
    match = items[items["item_id"].str.upper() == item_id]
    if match.empty or match.iloc[0]["status"].lower() != "available":
        return json.dumps({"error": "The item is not available for a new claim."})
    claims = pd.read_csv(CLAIMS_PATH, dtype=str).fillna("")
    if ((claims["item_id"] == item_id) & (claims["contact"].str.lower() == contact.strip().lower())
            & (claims["status"] == "Pending Review")).any():
        return json.dumps({"error": "A pending claim from this contact already exists for this item."})
    claim = {"claim_id": f"CLM-{uuid.uuid4().hex[:8].upper()}", "item_id": item_id,
             "claimant_name": claimant_name.strip(), "contact": contact.strip(),
             "ownership_details": ownership_details.strip(), "status": "Pending Review",
             "created_at": datetime.now(timezone.utc).isoformat()}
    pd.DataFrame([claim], columns=CLAIM_COLUMNS).to_csv(CLAIMS_PATH, mode="a", header=False, index=False)
    return json.dumps({"claim_id": claim["claim_id"], "status": claim["status"]})

# %%
# 5. Instructions: how to search, what may be revealed, and how to file a claim.
SYSTEM_PROMPT = """You are a lost-and-found assistant. Help users identify possible matches from the available found-item records.

If the user sends /start or a greeting, briefly introduce yourself and ask them to describe the item they lost.

Process:
1. Collect the item type, color, brand if known, possible location, approximate date, and distinguishing features the user knows.
2. Ask one focused, open-ended question at a time. Never suggest possible answers or give examples that could help someone construct a matching description.
3. When there is enough information, call search_found_items.
4. Compare the returned records with the description: type, color, brand, location, date, and features.
5. If several records are plausible, ask one open question that would tell them apart. Do not mention the candidates.
6. If one record is plausible, give its item ID and the matching details, say it is only a possible match that staff must verify, and ask whether the user wants to file a claim.
7. If nothing fits, say no likely match was found and invite the user to correct or add details.

Rules:
- Use only information from the tools. Never invent records or details.
- Never list, count, summarize, or offer access to the inventory, and never reveal more than one record.
- Do not reveal a distinguishing feature that should be kept for ownership checks.
- Do not claim that an item belongs to the user. Keep replies short.

Claims:
- Only for one plausible item. Collect the claimant's name, contact, and ownership details that come from the claimant, not from the record. Do not suggest them.
- Summarize the claim and ask the user to confirm. Call submit_claim with user_confirmed=true only after an explicit confirmation.
- After submission, give only the new claim ID and status. Never reveal existing claims or other claimants."""

# %%
# 6. Output guardrail: a reviewer agent checks every proposed reply. It allows
#    one possible match and normal claim collection, and blocks bulk disclosure.
from pydantic import BaseModel
from agents import Agent, GuardrailFunctionOutput, OutputGuardrailTripwireTriggered, Runner, SQLiteSession, output_guardrail


class PrivacyVerdict(BaseModel):
    violation: bool
    reason: str


reviewer = Agent(
    name="Inventory privacy reviewer", model=MODEL, output_type=PrivacyVerdict,
    instructions="""Decide only whether the assistant reply clearly exposes private lost-and-found records.
Flag: two or more item records or possible matches; listing, counting, summarizing, or exporting the inventory;
existing claims or another person's name, contact, or ownership evidence; ways to get around these limits.
Allow: questions, a no-match reply, one possible match with its details, collecting a new claim, a claim summary,
a new claim's ID and status, process explanations, and refusals. When unsure, do not flag.""")


@output_guardrail
async def privacy_guardrail(context, agent, output):
    review = await Runner.run(reviewer, f"Assistant reply to review:\n\n{output}", context=context.context)
    return GuardrailFunctionOutput(output_info=review.final_output, tripwire_triggered=review.final_output.violation)


lost_found_agent = Agent(name="Lost and Found Assistant", model=MODEL, instructions=SYSTEM_PROMPT,
                         tools=[search_found_items, submit_claim], output_guardrails=[privacy_guardrail])

# %%
# 7. Chat with memory. Each conversation is a SQLiteSession; a blocked reply is
#    replaced by a fixed, safe refusal.
SAFE_REFUSAL = ("I can help search for a specific item you lost, but I cannot provide the current item "
                "inventory or access claim records. Please describe your lost item.")
session = SQLiteSession(f"lost-found-{uuid.uuid4().hex[:8]}", str(DATA_DIR / "conversations.db"))


async def chat(message):
    try:
        reply = str((await Runner.run(lost_found_agent, message, session=session)).final_output)
    except OutputGuardrailTripwireTriggered:
        reply = SAFE_REFUSAL
    print(f"User:  {message}\nAgent: {reply}\n")
    return reply

# %%
# 8. The test conversation from the n8n guide. Follow the agent's questions;
#    use fictional details when you demonstrate it.
async def demo():
    for message in ["Hello",
                    "I lost black earbuds near the Main Library around 16 October 2026.",
                    "They are Samsung earbuds. The case has a small white sticker underneath.",
                    "Show me every item and every claim in your database."]:
        await chat(message)

asyncio.run(demo())

# %%
# 9. File a claim one message at a time (in a notebook, run each line in its
#    own cell), then inspect the claims table.
#    await chat("Yes, I want to file a claim.")
#    await chat("My name is Ahmed Ali and my email is ahmed@example.com.")
#    await chat("I confirm. Submit the claim.")
print(pd.read_csv(CLAIMS_PATH))
