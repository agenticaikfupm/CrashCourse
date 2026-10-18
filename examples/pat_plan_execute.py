"""Pattern 6: Plan-and-execute

A planner first writes the whole plan as structured steps. An executor then
runs each step with a tool and records the result. If a step fails, the
planner is asked to revise the remaining plan (replanning).

Illustrative: make_plan() and replan() stand in for LLM calls that return JSON.
"""
import json

def make_plan(goal: str) -> list[dict]:
    plan = [
        {"step": 1, "tool": "search_papers", "input": "agentic AI survey"},
        {"step": 2, "tool": "summarize", "input": "results of step 1"},
        {"step": 3, "tool": "email", "input": "send summary to the study group"},
    ]
    print("Planner output:\n" + json.dumps(plan, indent=2))
    return plan

def replan(failed_step: dict) -> list[dict]:
    print(f"   Replanning after failure in step {failed_step['step']}...")
    return [{"step": failed_step["step"], "tool": "post_to_forum", "input": "share summary on the course forum"}]

# ---- Tools (one fails on purpose to show replanning) ----------------------
def search_papers(q):  return ["A Survey on LLM-based Autonomous Agents", "ReAct"]
def summarize(_):      return "Two key ideas: agents combine LLM reasoning with tools; ReAct interleaves thoughts and actions."
def email(_):          raise ConnectionError("mail server unavailable")
def post_to_forum(_):  return "Posted to forum"
TOOLS = {f.__name__: f for f in (search_papers, summarize, email, post_to_forum)}

def execute(goal: str):
    queue = make_plan(goal)
    results = {}
    while queue:
        step = queue.pop(0)
        try:
            results[step["step"]] = TOOLS[step["tool"]](step["input"])
            print(f"Executed step {step['step']} [{step['tool']}] -> {results[step['step']]}")
        except Exception as err:
            print(f"Step {step['step']} [{step['tool']}] failed: {err}")
            queue = replan(step) + queue
    return results

execute("Find and share a short summary of recent work on agentic AI")
