"""Pattern 4: Tool calling with human confirmation

The model decides which tools to call and with what arguments, observes the
results, and continues until it can answer. Actions that change the world
(like sending email) pause for human confirmation first.

Scenario from the course slides: "Filter my emails by importance and send an
out-of-office (OOO) notification to the top 5 most important emails."

Illustrative: plan_tool_calls() stands in for the model's tool-call decisions.
"""

INBOX = [
    {"id": 1, "sender": "dean@university.edu", "subject": "Budget approval needed", "urgent": True},
    {"id": 2, "sender": "newsletter@shop.com", "subject": "Weekend sale", "urgent": False},
    {"id": 3, "sender": "student@university.edu", "subject": "Thesis draft feedback", "urgent": True},
    {"id": 4, "sender": "colleague@university.edu", "subject": "Paper review deadline", "urgent": True},
    {"id": 5, "sender": "it@university.edu", "subject": "Password expires soon", "urgent": False},
    {"id": 6, "sender": "partner@industry.com", "subject": "Project kickoff", "urgent": True},
    {"id": 7, "sender": "events@university.edu", "subject": "Seminar tomorrow", "urgent": False},
]

# ---- Tools ----------------------------------------------------------------
def read_emails() -> list:
    return INBOX

def rank_by_importance(emails: list, top_k: int) -> list:
    def score(e):
        return (2 if e["urgent"] else 0) + (1 if e["sender"].endswith("university.edu") else 0)
    return sorted(emails, key=score, reverse=True)[:top_k]

def send_ooo(email_ids: list) -> str:
    return f"Sent OOO replies to emails {email_ids}"

TOOLS = {"read_emails": read_emails, "rank_by_importance": rank_by_importance, "send_ooo": send_ooo}
NEEDS_APPROVAL = {"send_ooo"}                     # tools with side effects

# ---- Agent loop -----------------------------------------------------------
def human_approves(tool: str, args: dict) -> bool:
    print(f"   [approval needed] {tool}({args}) -> auto-approved for this demo")
    return True                                   # in an app, show a confirm button

def agent(task: str):
    print("Task:", task)
    emails = call("read_emails", {})
    top = call("rank_by_importance", {"emails": emails, "top_k": 5})
    for e in top:
        print(f"   #{e['id']} {e['subject']} ({e['sender']})")
    return call("send_ooo", {"email_ids": [e["id"] for e in top]})

def call(tool: str, args: dict):
    shown = {k: (f"<{len(v)} items>" if isinstance(v, list) and v and isinstance(v[0], dict) else v) for k, v in args.items()}
    print(f"-> tool call: {tool}({shown})")
    if tool in NEEDS_APPROVAL and not human_approves(tool, args):
        return "Canceled by the user"
    return TOOLS[tool](**args)

print("\nResult:", agent("Filter my emails by importance and send OOO to the top 5"))
