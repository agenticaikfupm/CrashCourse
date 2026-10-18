"""Evaluation, logging, and monitoring for an agent

Before deployment, evaluate the agent on a fixed test set with clear pass
criteria. After deployment, log every run as structured data (a trace) and
monitor metrics so problems trigger an alert and an incident process.

Illustrative: agent() is a stand-in with a deliberate bug so you can see
evaluation catch it and monitoring raise an alert.
"""
import json
import statistics
import time

def agent(question: str) -> dict:
    """Stand-in agent that returns an answer and the tools it used."""
    kb = {"capital of saudi arabia": "Riyadh", "2 + 2": "4", "mcp stands for": "Model Context Protocol"}
    for key, ans in kb.items():
        if key in question.lower():
            return {"answer": ans, "tools": ["lookup"]}
    return {"answer": "Jeddah", "tools": []}          # deliberate hallucination


# 1) Offline evaluation ------------------------------------------------------
TEST_SET = [
    {"q": "What is the capital of Saudi Arabia?", "expected": "Riyadh"},
    {"q": "What is 2 + 2?", "expected": "4"},
    {"q": "MCP stands for what?", "expected": "Model Context Protocol"},
    {"q": "Where is KFUPM located?", "expected": "Dhahran"},
]

def evaluate():
    rows = []
    for case in TEST_SET:
        out = agent(case["q"])
        rows.append({"q": case["q"], "pass": out["answer"].lower() == case["expected"].lower(), "used_tool": bool(out["tools"])})
    acc = sum(r["pass"] for r in rows) / len(rows)
    print(f"Evaluation: accuracy {acc:.0%} on {len(rows)} cases")
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['q']}")
    return acc

accuracy = evaluate()
print("Release gate (accuracy >= 90%):", "PASSED" if accuracy >= 0.9 else "FAILED, do not deploy yet")

# 2) Structured logging (traces) --------------------------------------------
TRACES = []
def run_and_log(question: str, user: str):
    start = time.perf_counter()
    out = agent(question)
    TRACES.append({
        "user": user, "question": question, "answer": out["answer"],
        "tools": out["tools"], "grounded": bool(out["tools"]),
        "latency_ms": round((time.perf_counter() - start) * 1000, 3),
    })

for i, q in enumerate(["What is 2 + 2?", "Where is the library?", "Who teaches module 3?", "MCP stands for what?"]):
    run_and_log(q, user=f"u{i}")
print("\nExample trace:", json.dumps(TRACES[1]))

# 3) Monitoring and alerting -------------------------------------------------
ungrounded_rate = sum(not t["grounded"] for t in TRACES) / len(TRACES)
print(f"\nMonitoring: ungrounded answers {ungrounded_rate:.0%}, median latency {statistics.median(t['latency_ms'] for t in TRACES)} ms")
if ungrounded_rate > 0.25:
    print("ALERT: too many answers without a source. Open an incident: pause the feature, review traces, fix, re-evaluate.")
