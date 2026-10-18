"""Human-in-the-loop approval based on risk

Not every action needs a human. A common approach is to score each proposed
action by risk and require approval only above a threshold, while logging
everything so decisions can be audited later.

Illustrative: the reviewer is simulated so the example runs without input().
In a notebook you can replace simulated_reviewer() with input().
"""
import json

RISK = {"read": 1, "draft": 1, "send_email": 3, "spend_money": 4, "delete": 5}
APPROVAL_THRESHOLD = 3          # risk >= 3 needs a human
SPEND_LIMIT = 500               # SAR, above this always escalate

AUDIT_LOG = []


def risk_score(action: dict) -> int:
    score = RISK.get(action["type"], 5)              # unknown actions are treated as high risk
    if action["type"] == "spend_money" and action.get("amount", 0) > SPEND_LIMIT:
        score = 5
    if action.get("external_recipient"):
        score += 1
    return min(score, 5)


def simulated_reviewer(action: dict) -> str:
    """Pretend reviewer: approves emails, rejects deletes and large spending."""
    if action["type"] == "delete" or action.get("amount", 0) > SPEND_LIMIT:
        return "reject"
    return "approve"


def execute_with_oversight(action: dict) -> str:
    score = risk_score(action)
    needs_human = score >= APPROVAL_THRESHOLD
    decision = simulated_reviewer(action) if needs_human else "auto-approve"
    status = "executed" if decision in ("approve", "auto-approve") else "blocked"
    AUDIT_LOG.append({"action": action, "risk": score, "reviewed_by_human": needs_human, "decision": decision, "status": status})
    return f"{action['type']:<12} risk={score}  human={'yes' if needs_human else 'no ':<3}  -> {decision:<12} {status}"


proposed = [
    {"type": "read", "target": "course calendar"},
    {"type": "draft", "target": "reply to a student"},
    {"type": "send_email", "target": "workshop reminder", "external_recipient": True},
    {"type": "spend_money", "amount": 120, "target": "pizza for the meetup"},
    {"type": "spend_money", "amount": 2400, "target": "cloud GPUs"},
    {"type": "delete", "target": "old registration records"},
]
for a in proposed:
    print(execute_with_oversight(a))

print("\nAudit log entry example:\n" + json.dumps(AUDIT_LOG[-1], indent=2))
