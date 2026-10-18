"""Memory: short-term context and long-term recall

Agents use two kinds of memory:
  * Short-term memory: the recent conversation that fits in the model's context.
  * Long-term memory: facts stored outside the model and retrieved when relevant
    (semantic facts, episodic past events, procedural "how-to" knowledge).

Long-term memory is usually retrieved by similarity search over embeddings.
To keep this runnable anywhere, we use simple word-overlap similarity instead.
"""
from collections import deque


class ShortTermMemory:
    """Keeps only the last N turns, like a limited context window."""
    def __init__(self, max_turns: int = 3):
        self.turns = deque(maxlen=max_turns)

    def add(self, role: str, text: str):
        self.turns.append(f"{role}: {text}")

    def as_context(self) -> str:
        return "\n".join(self.turns)


class LongTermMemory:
    """Stores facts with a type and retrieves the most similar ones."""
    def __init__(self):
        self.items = []

    def store(self, text: str, kind: str):
        self.items.append({"text": text, "kind": kind})

    @staticmethod
    def _similarity(a: str, b: str) -> float:
        wa, wb = set(a.lower().split()), set(b.lower().split())
        return len(wa & wb) / (len(wa | wb) or 1)       # Jaccard similarity

    def retrieve(self, query: str, k: int = 2):
        ranked = sorted(self.items, key=lambda m: self._similarity(query, m["text"]), reverse=True)
        return [m for m in ranked[:k] if self._similarity(query, m["text"]) > 0]


stm = ShortTermMemory(max_turns=3)
ltm = LongTermMemory()
ltm.store("the user prefers meetings in the morning", "semantic")
ltm.store("last week the user booked room B22-204 for the ai club", "episodic")
ltm.store("to book a room, check capacity first then availability", "procedural")
ltm.store("the cafeteria closes at 8 pm", "semantic")

for role, text in [("user", "hi"), ("agent", "hello! how can I help?"),
                   ("user", "book a room for the ai club"), ("agent", "sure, for when?")]:
    stm.add(role, text)

print("Short-term memory (only the last 3 turns survive):")
print(stm.as_context())

query = "book a room for the ai club in the morning"
print(f"\nLong-term memories relevant to: '{query}'")
for m in ltm.retrieve(query, k=3):
    print(f"  [{m['kind']}] {m['text']}")
