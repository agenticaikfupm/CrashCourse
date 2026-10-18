"""Inference with a tiny language model

Large language models generate text one token at a time: they look at the
text so far, estimate a probability for every possible next token, pick one,
and repeat. This example builds a toy "bigram" model (it only looks at the
previous word) so you can see that loop with nothing hidden.

Illustrative: real LLMs use Transformers with billions of parameters and
look at thousands of previous tokens, but the generation loop is the same.
"""
import random
from collections import Counter, defaultdict

corpus = """
an agent uses tools to act . the agent uses memory to plan .
an agent uses search to find facts . an agent plans actions .
an agent reasons about goals . the agent plans the next step .
a model predicts the next word . a model learns patterns from data .
the agent observes feedback . the agent perceives its environment .
"""

# 1) "Training": count which word follows which.
words = corpus.split()
next_counts = defaultdict(Counter)
for prev, nxt in zip(words, words[1:]):
    next_counts[prev][nxt] += 1


def next_word_probs(prev: str) -> dict:
    """Turn raw counts into probabilities for the next word."""
    counts = next_counts[prev]
    total = sum(counts.values())
    return {w: c / total for w, c in counts.most_common()}


# 2) Inference: the autoregressive generation loop.
def generate(prompt: str, max_words: int = 10, temperature: float = 1.0, seed: int = 7) -> str:
    rng = random.Random(seed)
    out = prompt.split()
    for _ in range(max_words):
        probs = next_word_probs(out[-1])
        if not probs:
            break
        if temperature == 0:                      # greedy decoding
            word = max(probs, key=probs.get)
        else:                                     # sampling with temperature
            weights = [p ** (1 / temperature) for p in probs.values()]
            word = rng.choices(list(probs), weights=weights)[0]
        out.append(word)
        if word == ".":
            break
    return " ".join(out)


print("Next-word probabilities after 'agent':")
for w, p in next_word_probs("agent").items():
    print(f"  {w:<10} {p:.2f}")

print("\nGreedy (temperature 0) always picks the most likely word:")
print("  ", generate("the agent", temperature=0))

print("\nSampling (temperature 1.5) gives different text for different random seeds:")
for seed in range(1, 5):
    print("  ", generate("the agent", temperature=1.5, seed=seed))
