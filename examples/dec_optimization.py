"""Optimization as a decision API: assigning shuttles to routes

Some decisions are best made by an optimizer, not by an LLM: the model is
good at understanding the request, while a solver is good at finding the
provably best assignment under constraints.

Here an agent receives "assign 3 shuttles to 3 routes with the least total
travel time" and calls an optimization tool. With only 3! = 6 possibilities we
can check them all; real problems use solvers such as Google OR-Tools (see the
Colab notebook for the same problem solved with OR-Tools).
"""
from itertools import permutations

shuttles = ["S1", "S2", "S3"]
routes = ["North gate", "Dorms", "Library"]

# minutes for each shuttle to serve each route (rows: shuttles, cols: routes)
cost = [
    [6, 7, 9],
    [8, 11, 6],
    [7, 9, 13],
]


def optimize_assignment(cost):
    best_total, best_perm = float("inf"), None
    for perm in permutations(range(len(routes))):         # try every assignment
        total = sum(cost[s][r] for s, r in enumerate(perm))
        if total < best_total:
            best_total, best_perm = total, perm
    return best_total, best_perm


total, perm = optimize_assignment(cost)
print("Optimal assignment (minimum total minutes):")
for s, r in enumerate(perm):
    print(f"  {shuttles[s]} -> {routes[r]:<11} ({cost[s][r]} min)")
print(f"Total: {total} minutes")

# Compare with a "greedy" choice an LLM might make by intuition.
greedy, used = 0, set()
for s in range(3):
    r = min((r for r in range(3) if r not in used), key=lambda r: cost[s][r])
    used.add(r)
    greedy += cost[s][r]
verdict = "worse than optimal" if greedy > total else "happens to be optimal here"
print(f"Greedy, one shuttle at a time: {greedy} minutes ({verdict})")
