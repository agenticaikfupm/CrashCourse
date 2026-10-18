"""Pattern 7: Multi-agent collaboration (manager and sub-agents)

A manager agent splits the task, assigns parts to specialized sub-agents, and
combines their work. The course slides name three cooperation styles:
  * Augmentative: each agent adds a different piece (division of labor).
  * Integrative: agents' outputs are merged into one consistent result.
  * Debative: agents critique each other until they converge.

Illustrative: every agent here is a small Python class with canned behavior.
"""

class Agent:
    def __init__(self, name: str, role: str):
        self.name, self.role = name, role

    def work(self, task: str) -> str:
        raise NotImplementedError


class Researcher(Agent):
    def work(self, task):
        return "Facts: Riyadh Metro opened in 2024; ride-hailing demand is growing."

class Analyst(Agent):
    def work(self, task):
        return "Insight: first/last-mile links to metro stations are the main gap."

class Critic(Agent):
    def work(self, draft):
        return "Missing: cite data sources and consider summer heat on walking distance." if "heat" not in draft else "OK"


class Manager(Agent):
    def __init__(self, team):
        super().__init__("Manager", "coordinates the team")
        self.team = team

    def work(self, task):
        print(f"[Manager] Task: {task}")
        # Augmentative: split the work between specialists.
        parts = {a.name: a.work(task) for a in self.team if not isinstance(a, Critic)}
        for name, out in parts.items():
            print(f"[{name}] {out}")
        # Integrative: merge the pieces into one draft.
        draft = " ".join(parts.values())
        # Debative: a critic challenges the draft, and the manager revises.
        critic = next(a for a in self.team if isinstance(a, Critic))
        for round_no in range(1, 3):
            verdict = critic.work(draft)
            print(f"[{critic.name}] round {round_no}: {verdict}")
            if verdict == "OK":
                break
            draft += " Recommendation: shaded walkways and e-scooter docks within 500 m, given summer heat; sources to be cited."
        return draft


team = [Researcher("Researcher", "finds facts"), Analyst("Analyst", "draws insights"), Critic("Critic", "reviews")]
print("\nFinal answer:\n" + Manager(team).work("Brief on improving access to metro stations"))
