"""Pattern 3: Parallel execution (fan-out, then aggregate)

Independent subtasks run at the same time and their results are combined.
Two common forms:
  * Sectioning: different workers handle different parts of a task.
  * Voting: several workers do the same task and the answers are compared.

We use asyncio so the three "reviewers" wait concurrently. Each one pretends
to take one second, but the whole run takes about one second, not three.
"""
import asyncio
import time


async def reviewer(aspect: str, text: str, delay: float = 1.0) -> dict:
    """Stand-in for an LLM call that reviews one aspect of the text."""
    await asyncio.sleep(delay)                       # simulated network latency
    findings = {
        "clarity": "Clear overall; define 'agentic' in the first sentence.",
        "accuracy": "No factual problems found in this short draft.",
        "safety": "Mentions sensor data: add a note about privacy.",
    }
    return {"aspect": aspect, "finding": findings[aspect]}


async def main():
    draft = "Agentic systems can monitor campus parking sensors and guide drivers."
    start = time.perf_counter()

    # Fan-out: start all reviewers at once.
    results = await asyncio.gather(
        reviewer("clarity", draft),
        reviewer("accuracy", draft),
        reviewer("safety", draft),
    )

    # Aggregate: combine the independent results into one report.
    print("Combined review:")
    for r in results:
        print(f"  - {r['aspect']:<9} {r['finding']}")
    print(f"\nElapsed: {time.perf_counter() - start:.1f} s for 3 reviews (run in parallel)")


asyncio.run(main())
