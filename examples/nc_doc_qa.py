"""Python equivalent of a visual "document Q&A" (RAG) flow

Visual builders such as Langflow, Flowise, and Dify ship templates for
retrieval-augmented generation (RAG). The flow is the same in each tool:

  Load documents -> Split into chunks -> Embed -> Store in a vector index
  Question -> Embed -> Retrieve top chunks -> Prompt + LLM -> Answer with sources

Illustrative: we "embed" text as word-count vectors and use cosine similarity
so this runs without downloads. Real flows use an embedding model and a
vector database.
"""
import math
import re
from collections import Counter

DOCS = {
    "syllabus.txt": "The crash course has ten modules. Module 5 covers the Model Context Protocol (MCP). "
                    "Module 10 covers governance, guardrails and human oversight.",
    "faq.txt": "Notebooks open in Google Colab. You need basic Python. No paid API key is required "
               "because examples use a stand-in model.",
}

def split(text):                                    # "Text splitter" node (one chunk per sentence)
    return [s for s in re.split(r"(?<=[.!?])\s+", text) if s]

def embed(text):                                    # "Embeddings" node
    return Counter(re.findall(r"[a-z0-9]+", text.lower()))

def cosine(a, b):
    dot = sum(a[k] * b[k] for k in a)
    return dot / ((math.sqrt(sum(v * v for v in a.values())) * math.sqrt(sum(v * v for v in b.values()))) or 1)

INDEX = [(name, chunk, embed(chunk)) for name, text in DOCS.items() for chunk in split(text)]  # "Vector store" node

def retrieve(question, k=2):                        # "Retriever" node
    q = embed(question)
    return sorted(INDEX, key=lambda item: cosine(q, item[2]), reverse=True)[:k]

def answer(question):                               # "Prompt" + "LLM" nodes (stand-in)
    hits = retrieve(question)
    context = "\n".join(f"[{name}] {chunk}" for name, chunk, _ in hits)
    prompt = f"Answer using only this context:\n{context}\n\nQuestion: {question}"
    best_name, best_chunk, _ = hits[0]
    return prompt, f"{best_chunk} (source: {best_name})"

for q in ["Which module covers MCP?", "Do I need an API key?"]:
    prompt, reply = answer(q)
    print("PROMPT SENT TO THE LLM:\n" + prompt)
    print("ANSWER:", reply, "\n" + "-" * 60)
