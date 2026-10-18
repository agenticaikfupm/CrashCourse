"""End-to-end agentic workflow: a campus shuttle dispatcher

This example runs the full loop from the Agentic AI Workflows module:

    Perception -> Reasoning -> Planning -> Action -> Feedback and learning
         ^                                                 |
         +------------------ updated memory ---------------+

Inputs:  simulated stop sensors (people waiting) for 5 time steps
Outputs: a dispatch decision per step, plus a learned congestion threshold
Feedback: measured wait times; when riders wait too long, the agent lowers
          its threshold so it dispatches extra shuttles earlier next time.

Illustrative: the "world" is a small deterministic simulation, and reasoning
uses simple rules so every step is easy to trace.
"""
from dataclasses import dataclass, field

# ---- Environment (simulated) ---------------------------------------------
WAITING_BY_STEP = [
    {"Dorms": 12, "Library": 5, "North gate": 3},
    {"Dorms": 18, "Library": 9, "North gate": 4},
    {"Dorms": 25, "Library": 14, "North gate": 6},
    {"Dorms": 22, "Library": 17, "North gate": 9},
    {"Dorms": 15, "Library": 19, "North gate": 11},
]

def simulate_wait(waiting: int, extra_shuttle: bool) -> float:
    """Minutes riders wait: more people means longer waits; an extra shuttle helps."""
    return round(waiting * (0.35 if extra_shuttle else 0.6), 1)

# ---- Agent memory ---------------------------------------------------------
@dataclass
class Memory:
    threshold: int = 20                 # dispatch an extra shuttle above this many riders
    max_wait_target: float = 8.0        # minutes
    history: list = field(default_factory=list)

# ---- The five stages ------------------------------------------------------
def perceive(raw: dict) -> dict:
    """Clean the sensor feed and compute a simple summary."""
    clean = {stop: max(0, int(n)) for stop, n in raw.items()}
    return {"waiting": clean, "busiest": max(clean, key=clean.get)}

def reason(obs: dict, mem: Memory) -> list[str]:
    """Decide which stops are congested given the current threshold."""
    return [s for s, n in obs["waiting"].items() if n > mem.threshold]

def plan(congested: list[str], obs: dict) -> list[dict]:
    """Build an ordered action plan: busiest congested stops first, max 2 extra shuttles."""
    ordered = sorted(congested, key=lambda s: -obs["waiting"][s])[:2]
    return [{"action": "dispatch_extra", "stop": s} for s in ordered]

def act(actions: list[dict], obs: dict) -> dict:
    """Execute the plan in the (simulated) world and measure the outcome."""
    served = {a["stop"] for a in actions}
    return {s: simulate_wait(n, s in served) for s, n in obs["waiting"].items()}

def learn(waits: dict, mem: Memory) -> str:
    """Feedback: adjust the threshold when the target is missed or easily met."""
    worst = max(waits.values())
    if worst > mem.max_wait_target and mem.threshold > 8:
        mem.threshold -= 4
        return f"worst wait {worst} min > target, lower threshold to {mem.threshold}"
    if worst < mem.max_wait_target / 2 and mem.threshold < 30:
        mem.threshold += 2
        return f"worst wait {worst} min is low, raise threshold to {mem.threshold}"
    return f"worst wait {worst} min, keep threshold at {mem.threshold}"

# ---- Run the loop ---------------------------------------------------------
mem = Memory()
for t, raw in enumerate(WAITING_BY_STEP, 1):
    obs = perceive(raw)
    threshold_used = mem.threshold
    congested = reason(obs, mem)
    actions = plan(congested, obs)
    waits = act(actions, obs)
    note = learn(waits, mem)
    mem.history.append({"t": t, "actions": actions, "waits": waits})

    print(f"t={t} | perceive {obs['waiting']}")
    print(f"      reason   congested (> {threshold_used} riders): {congested or 'none'}")
    print(f"      plan     {[a['stop'] for a in actions] or 'no extra shuttles'}")
    print(f"      act      waits {waits}")
    print(f"      learn    {note}\n")

print("Learned threshold after 5 steps:", mem.threshold)
