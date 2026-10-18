"""The same assignment problem with Google OR-Tools

Google OR-Tools is an open-source optimization suite. Its CP-SAT solver handles
assignment, scheduling, and routing problems. Wrapping a solver like this in a
function (or an MCP tool, or an OpenAPI service) lets an agent call it.

Run it in Google Colab or locally after installing ortools.
"""
# %%
# !pip -q install ortools

# %%
from ortools.sat.python import cp_model

shuttles = ["S1", "S2", "S3"]
routes = ["North gate", "Dorms", "Library"]
cost = [[6, 7, 9], [8, 11, 6], [7, 9, 13]]


def solve_assignment(cost):
    model = cp_model.CpModel()
    n = len(cost)
    x = {(s, r): model.NewBoolVar(f"x_{s}_{r}") for s in range(n) for r in range(n)}
    for s in range(n):
        model.AddExactlyOne(x[s, r] for r in range(n))      # each shuttle gets one route
    for r in range(n):
        model.AddExactlyOne(x[s, r] for s in range(n))      # each route gets one shuttle
    model.Minimize(sum(cost[s][r] * x[s, r] for s in range(n) for r in range(n)))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)
    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return None
    plan = [(shuttles[s], routes[r]) for s in range(n) for r in range(n) if solver.Value(x[s, r])]
    return solver.ObjectiveValue(), plan


total, plan = solve_assignment(cost)
for s, r in plan:
    print(f"{s} -> {r}")
print("Total minutes:", total)
