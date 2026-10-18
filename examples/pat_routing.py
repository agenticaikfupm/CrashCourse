"""Pattern 2: Routing

A router (often a small, cheap model) classifies each request and sends it to
the most suitable handler: a specialized prompt, a different model, or a tool.
This keeps each handler simple and lets you use expensive models only when needed.

Illustrative: classify() uses keywords; a real router would ask an LLM to
return one label from a fixed list (structured output).
"""

ROUTES = {
    "image": "Image generation model",
    "code": "Coding model",
    "math": "Calculator tool",
    "general": "General chat model",
}


def classify(query: str) -> str:
    """Router: return exactly one label from ROUTES."""
    q = query.lower()
    if any(w in q for w in ("image", "picture", "draw", "generate a photo")):
        return "image"
    if any(w in q for w in ("python", "bug", "function", "code")):
        return "code"
    if any(ch.isdigit() for ch in q) and any(op in q for op in "+-*/"):
        return "math"
    return "general"


def handle(route: str, query: str) -> str:
    if route == "math":
        expr = "".join(ch for ch in query if ch in "0123456789+-*/(). ")
        return f"{expr.strip()} = {eval(expr, {'__builtins__': {}})}"
    if route == "image":
        return "[image request sent to an image model: 'a camel crossing a desert highway']"
    if route == "code":
        return "Here is a fixed version of your function..."
    return "Here is a friendly general answer."


queries = [
    "Generate an image of a camel crossing a desert highway",
    "Why does my Python function return None?",
    "What is 12 * (7 + 3)?",
    "What is KFUPM known for?",
]
for q in queries:
    route = classify(q)
    print(f"Query:   {q}\nRoute:   {route} -> {ROUTES[route]}\nAnswer:  {handle(route, q)}\n")
