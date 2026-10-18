"""Pattern 0: Basic responder (one model call)

The simplest design: the user's query goes to the model once and the answer
comes straight back. There is no tool use, no loop, and no memory, so the
agency level is the lowest. It is fast and cheap, but the answer is only as
good as the model's built-in knowledge, which may be outdated or wrong.

Illustrative: llm() is a stand-in. In the Colab notebook you can swap it for
a real open model.
"""

def llm(prompt: str) -> str:
    """Stand-in for a language model call (swap in a real model here)."""
    canned = {
        "books": "Here are some books on smart mobility: (1) ... (2) ... (3) ...",
    }
    for key, answer in canned.items():
        if key in prompt.lower():
            return answer
    return "I'm not sure, but here is my best guess based on my training data."


def basic_responder(query: str) -> str:
    prompt = f"You are a helpful assistant.\nUser: {query}\nAssistant:"
    return llm(prompt)


query = "Please suggest recent books on smart mobility"
print("User: ", query)
print("Model:", basic_responder(query))
print("\nNote: nothing checks whether these books exist. Later patterns add tools and verification.")
