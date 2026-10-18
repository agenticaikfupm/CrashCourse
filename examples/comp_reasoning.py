"""Reasoning: weighing evidence to reach a decision

Reasoning connects observations and goals to a conclusion. LLM-based agents
often reason in natural language ("chain of thought"). Here we make each
reasoning step explicit so you can read the trace and check it.

Illustrative: the rules below stand in for what an LLM would infer.
"""
observation = {
    "intent": "book_room",
    "group_size": 6,
    "hour": 15,
    "rooms": [
        {"name": "B22-101", "capacity": 4, "free_at": [9, 10, 15]},
        {"name": "B22-204", "capacity": 8, "free_at": [13, 15, 16]},
        {"name": "B22-310", "capacity": 20, "free_at": [15]},
    ],
}


def reason(obs: dict) -> tuple[str, list[str]]:
    trace = []
    size, hour = obs["group_size"], obs["hour"]
    trace.append(f"Goal: find a room for {size} people at {hour}:00.")

    fits = [r for r in obs["rooms"] if r["capacity"] >= size]
    trace.append(f"Rooms large enough: {[r['name'] for r in fits]}.")

    free = [r for r in fits if hour in r["free_at"]]
    trace.append(f"Of those, free at {hour}:00: {[r['name'] for r in free]}.")

    if not free:
        trace.append("No room satisfies both constraints, so I should ask the user.")
        return "ask_user", trace

    # Prefer the smallest room that fits, to keep big rooms for big groups.
    best = min(free, key=lambda r: r["capacity"])
    trace.append(f"Choose the smallest suitable room: {best['name']} (capacity {best['capacity']}).")
    return best["name"], trace


decision, trace = reason(observation)
for i, step in enumerate(trace, 1):
    print(f"Thought {i}: {step}")
print("\nDecision:", decision)
