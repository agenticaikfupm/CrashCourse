"""Pattern 5: Reflection / evaluator-optimizer loop

One model call generates a draft; another call (or a set of checks) evaluates
it and gives feedback; the generator revises. The loop stops when the
evaluator is satisfied or after a maximum number of rounds.

Illustrative: generate() and evaluate() are stand-ins. In practice the
evaluator is often an LLM with a rubric, unit tests, or both.
"""

def generate(task: str, feedback: list[str], round_no: int) -> str:
    """Stand-in generator that improves when it receives feedback."""
    drafts = [
        "def average(xs): return sum(xs) / len(xs)",
        "def average(xs):\n    if not xs:\n        return 0.0\n    return sum(xs) / len(xs)",
        'def average(xs: list[float]) -> float:\n    """Return the mean of xs, or 0.0 for an empty list."""\n'
        "    if not xs:\n        return 0.0\n    return sum(xs) / len(xs)",
    ]
    return drafts[min(round_no, len(drafts) - 1)]


def evaluate(code: str) -> list[str]:
    """Evaluator: run tests and style checks, return a list of problems."""
    problems = []
    scope = {}
    exec(code, scope)                       # fine for this demo; sandbox untrusted code in real systems
    try:
        scope["average"]([])
    except ZeroDivisionError:
        problems.append("Crashes on an empty list.")
    if scope["average"]([2, 4]) != 3:
        problems.append("Wrong result for [2, 4].")
    if '"""' not in code:
        problems.append("Missing docstring.")
    return problems


task = "Write a Python function average(xs)."
feedback: list[str] = []
for round_no in range(5):
    draft = generate(task, feedback, round_no)
    feedback = evaluate(draft)
    print(f"--- Round {round_no + 1} ---\n{draft}")
    print("Evaluator:", "PASS" if not feedback else "; ".join(feedback), "\n")
    if not feedback:
        break
