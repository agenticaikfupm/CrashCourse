"""An always-on agent: triggers, memory, and permission rules

Always-on agents do not wait for a prompt. They wake up on triggers
(a schedule, an event in a connected app, a new message, or their own
background "proactive" check), decide what to do using their memory of
your goals, and then act within permission rules: some actions run
automatically, some need your approval, and some are blocked.

This example simulates one working day in a few milliseconds.
Inputs:  a list of timed events (emails, calendar changes, schedule ticks)
Outputs: what the agent did, what it asked you to approve, and an activity log

Illustrative: decide() uses simple rules where a real agent would use an LLM.
"""
from dataclasses import dataclass, field

# ---- Memory: what the agent knows about you ---------------------------------
@dataclass
class Memory:
    goals: list = field(default_factory=lambda: ["submit the workshop proposal by Thursday",
                                                  "keep mornings free for research"])
    preferences: dict = field(default_factory=lambda: {"quiet_hours": (22, 7), "digest_time": 8})
    notes: list = field(default_factory=list)

# ---- Permission rules (like "allow / require approval / block") ------------
RULES = {
    "read_email": "allow",
    "draft_reply": "allow",
    "send_email": "approve",          # anything that leaves on your behalf needs approval
    "move_meeting": "approve",
    "pay_invoice": "approve",
    "change_password": "block",       # sensitive tasks always stay with the human
}

# ---- Triggers: what wakes the agent up --------------------------------------
EVENTS = [
    (7,  "schedule", "daily digest"),
    (9,  "email",    "Reviewer asks for the proposal draft by Wednesday"),
    (11, "calendar", "Research block moved to 10:00 by a colleague"),
    (13, "proactive", "scan connected apps (read-only)"),
    (14, "email",    "IT: your password expires today"),
    (16, "email",    "Vendor: invoice #482 is due tomorrow"),
    (23, "email",    "Newsletter: weekly AI roundup"),
]

ACTIVITY_LOG, APPROVAL_QUEUE = [], []

def in_quiet_hours(hour, mem):
    start, end = mem.preferences["quiet_hours"]
    return hour >= start or hour < end

def request(action, detail, hour):
    """Every action passes through the permission rules before it runs."""
    rule = RULES.get(action, "approve")                    # unknown actions need approval
    if rule == "allow":
        status = "done"
    elif rule == "approve":
        status = "waiting for your approval"
        APPROVAL_QUEUE.append((hour, action, detail))
    else:
        status = "blocked (you must do this yourself)"
    ACTIVITY_LOG.append({"hour": hour, "action": action, "detail": detail, "status": status})
    return status

def decide(hour, kind, text, mem):
    """Stand-in for the model: map a trigger to actions using memory."""
    if in_quiet_hours(hour, mem) and kind != "schedule":
        mem.notes.append(f"Saved for the morning: {text}")
        return [("read_email", f"queued for tomorrow: {text}")]
    if kind == "schedule":
        return [("read_email", "prepare a digest of overnight messages and today's goals")]
    if kind == "email" and "proposal" in text:
        mem.notes.append("Deadline moved earlier: proposal due Wednesday")
        return [("draft_reply", "confirm the Wednesday deadline"), ("send_email", "reply to reviewer")]
    if kind == "calendar" and "Research block" in text:
        return [("move_meeting", "restore the research block (goal: keep mornings free)")]
    if kind == "proactive":
        return [("read_email", "found 2 unanswered student questions; drafted answers for review")]
    if kind == "email" and "password" in text:
        return [("change_password", "reset the expiring password")]
    if kind == "email" and "invoice" in text:
        return [("pay_invoice", "pay invoice #482 before it is due")]
    return []

mem = Memory()
for hour, kind, text in EVENTS:
    print(f"{hour:02d}:00  trigger={kind:<9} {text}")
    for action, detail in decide(hour, kind, text, mem):
        print(f"        -> {action:<15} {request(action, detail, hour)}")

print("\nApprovals waiting for you:")
for hour, action, detail in APPROVAL_QUEUE:
    print(f"  [{hour:02d}:00] {action}: {detail}")
print("\nUpdated memory:", mem.notes)
print(f"Activity log entries: {len(ACTIVITY_LOG)} (you can inspect every step)")
