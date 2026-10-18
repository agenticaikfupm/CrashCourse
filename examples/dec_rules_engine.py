"""Decision table: a tiny rules engine an agent can call

Many organizations encode business decisions as decision tables: each row is
a rule with conditions and an outcome. The OMG Decision Model and Notation
(DMN) standard formalizes this idea. A "first hit" policy returns the outcome
of the first rule whose conditions all match.

Why agents care: the LLM gathers and structures the inputs, but the decision
itself comes from an auditable, deterministic table that experts maintain.

Illustrative: a simplified decision table, not a full DMN implementation.
"""

# Decision: should a lab equipment request be approved automatically?
# Each condition is (field, operator, value). "-" in the output means "no rule".
RULES = [
    {"id": "R1", "when": [("safety_training", "==", False)],                        "then": "reject",         "why": "Safety training is required"},
    {"id": "R2", "when": [("hazard_level", "==", "high")],                          "then": "manual_review",  "why": "High-hazard equipment needs a supervisor"},
    {"id": "R3", "when": [("hours", ">", 8)],                                       "then": "manual_review",  "why": "Long bookings need approval"},
    {"id": "R4", "when": [("role", "in", ["faculty", "researcher"])],               "then": "approve",        "why": "Staff with training may book"},
    {"id": "R5", "when": [("role", "==", "student"), ("hours", "<=", 4)],           "then": "approve",        "why": "Short student bookings are fine"},
    {"id": "R6", "when": [],                                                        "then": "manual_review",  "why": "Default rule"},
]

OPS = {
    "==": lambda a, b: a == b, ">": lambda a, b: a > b, "<=": lambda a, b: a <= b,
    "in": lambda a, b: a in b,
}


def decide(facts: dict) -> dict:
    """First-hit policy: return the first matching rule."""
    for rule in RULES:
        if all(OPS[op](facts[field], value) for field, op, value in rule["when"]):
            return {"decision": rule["then"], "rule": rule["id"], "reason": rule["why"]}
    return {"decision": "-", "rule": None, "reason": "no rule matched"}


requests = [
    {"role": "student", "hours": 3, "hazard_level": "low", "safety_training": True},
    {"role": "student", "hours": 6, "hazard_level": "low", "safety_training": True},
    {"role": "faculty", "hours": 2, "hazard_level": "high", "safety_training": True},
    {"role": "researcher", "hours": 2, "hazard_level": "low", "safety_training": False},
]
for facts in requests:
    print(facts, "\n  ->", decide(facts), "\n")
