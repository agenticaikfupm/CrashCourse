"""Python equivalent of the n8n "email triage with approval" workflow

Each function below matches one node in the visual workflow:
  Trigger -> Classify (AI) -> Route (Switch) -> Draft reply (AI)
          -> Human approval -> Send / Log

Seeing the same logic as code helps you understand what the visual nodes do,
and shows when moving from no-code to code makes sense.

Illustrative: classify() and draft_reply() stand in for LLM nodes.
"""
from datetime import datetime

NEW_EMAILS = [
    {"from": "student@university.edu", "subject": "Can I join the crash course late?", "body": "I missed week 1."},
    {"from": "promo@shop.com", "subject": "50% off laptops", "body": "Today only!"},
    {"from": "dean@university.edu", "subject": "Urgent: room change", "body": "Workshop moves to Building 22."},
]

def trigger():                        # n8n: Gmail / IMAP trigger node
    return NEW_EMAILS

def classify(email):                  # n8n: AI Agent or Text Classifier node
    text = (email["subject"] + " " + email["body"]).lower()
    if "urgent" in text:
        return "urgent"
    if any(w in text for w in ("sale", "% off", "promo")):
        return "spam"
    return "question"

def draft_reply(email):               # n8n: AI Agent node with a reply prompt
    return f"Hello, thanks for your message about '{email['subject']}'. We will get back to you shortly."

def human_approval(draft):            # n8n: "Send and wait for response" approval step
    return "approve"                  # simulated: a person clicked Approve

def send(email, text):                # n8n: Gmail "send" node
    return f"sent to {email['from']}"

LOG = []
def log(email, category, outcome):    # n8n: Google Sheets / database node
    LOG.append({"time": datetime(2026, 1, 1, 9, 0).isoformat(), "from": email["from"], "category": category, "outcome": outcome})

for email in trigger():
    category = classify(email)
    if category == "spam":                                   # n8n: Switch node, branch 1
        log(email, category, "archived")
    elif category == "urgent":                               # branch 2
        log(email, category, "forwarded to on-call staff")
    else:                                                    # branch 3
        draft = draft_reply(email)
        decision = human_approval(draft)
        log(email, category, send(email, draft) if decision == "approve" else "rejected by reviewer")

for row in LOG:
    print(row)
