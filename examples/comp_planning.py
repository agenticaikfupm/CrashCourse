"""Planning: breaking a goal into ordered, executable steps

Planning turns a goal into a sequence of steps that respects dependencies
(some steps must happen before others). This example declares tasks with
their prerequisites and computes a valid order with a topological sort.

Illustrative: an LLM planner would propose the tasks and dependencies in
structured form; the ordering logic below is what makes the plan executable.
"""
from graphlib import TopologicalSorter

goal = "Organize a one-day Agentic AI workshop"

# task -> set of tasks that must finish first
tasks = {
    "pick_date": set(),
    "book_room": {"pick_date"},
    "invite_speakers": {"pick_date"},
    "open_registration": {"book_room", "invite_speakers"},
    "prepare_colab_notebooks": {"invite_speakers"},
    "send_reminders": {"open_registration"},
    "run_workshop": {"send_reminders", "prepare_colab_notebooks"},
}

sorter = TopologicalSorter(tasks)
sorter.prepare()

print(f"Goal: {goal}\n")
stage = 1
while sorter.is_active():
    ready = sorted(sorter.get_ready())          # tasks whose prerequisites are done
    print(f"Stage {stage} (can run in parallel): {', '.join(ready)}")
    for task in ready:
        sorter.done(task)
    stage += 1

# Replanning: if a step fails, only the steps that depend on it must change.
failed = "book_room"
affected = {t for t, deps in tasks.items() if failed in deps}
print(f"\nIf '{failed}' fails, re-plan these dependent steps first: {sorted(affected)}")
