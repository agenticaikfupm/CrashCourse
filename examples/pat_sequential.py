"""Pattern 1: Sequential workflow (prompt chaining)

A task is split into fixed steps. Each step's output becomes the next step's
input, and a "gate" between steps can stop the chain early if a check fails.
Because the path is fixed in code, the behavior is predictable and easy to debug.

Illustrative: each step would normally be its own LLM call with its own prompt.
"""

def llm(task: str, text: str) -> str:
    """Stand-in for an LLM; each 'task' would be a different prompt."""
    if task == "extract":
        return "smart parking; real-time occupancy sensors; mobile app; reduce search time"
    if task == "outline":
        points = [p.strip() for p in text.split(";")]
        return "\n".join(f"{i}. {p.capitalize()}" for i, p in enumerate(points, 1))
    if task == "write":
        return ("Our campus smart-parking pilot uses real-time occupancy sensors and a "
                "mobile app so drivers spend less time searching for a space.")
    raise ValueError(task)


def gate_has_enough_points(outline: str, minimum: int = 3) -> bool:
    return len(outline.splitlines()) >= minimum


def sequential_pipeline(notes: str) -> str:
    print("Step 1: extract key ideas")
    ideas = llm("extract", notes)
    print("   ->", ideas)

    print("Step 2: turn ideas into an outline")
    outline = llm("outline", ideas)
    print("   ->", outline.replace("\n", "\n      "))

    print("Gate: does the outline have at least 3 points?")
    if not gate_has_enough_points(outline):
        return "Stopped: not enough material. Ask the user for more notes."
    print("   -> yes, continue")

    print("Step 3: write the final paragraph")
    return llm("write", outline)


notes = "Meeting notes: parking is hard near Building 22; sensors could help; app idea..."
print("\nFinal output:", sequential_pipeline(notes))
