"""A real tool-calling agent loop with a free OpenRouter model

This is the loop from the mini framework example, now driven by a real model
through OpenRouter's OpenAI-compatible API. The model decides when to call
the tools; our code runs them and sends the results back until the model
gives a final answer. Requires OPENROUTER_API_KEY (see the previous example).

Free models change often. "openrouter/free" routes to an available free model
that supports the features the request needs, such as tool calling.
"""
# %%
# !pip -q install openai

# %%
import json
import os
from getpass import getpass

from openai import OpenAI

key = os.environ.get("OPENROUTER_API_KEY")
if not key:
    try:
        from google.colab import userdata
        key = userdata.get("OPENROUTER_API_KEY")
    except Exception:
        key = getpass("Paste your OPENROUTER_API_KEY (input is hidden): ")

client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
MODEL = os.environ.get("OPENROUTER_MODEL", "openrouter/free")

# %%
# Tools: plain Python functions plus JSON schemas the model can read
def get_course_module(number: int) -> str:
    titles = {1: "Evolution of AI", 2: "Components of AI Agents", 3: "Agent Design Patterns",
              4: "Always-on AI Agents", 5: "Model Context Protocol", 6: "Decision APIs",
              7: "Agentic AI Workflows", 8: "No-Code Agentic Workflows",
              9: "Code-based Agentic Workflows", 10: "Agentic AI Governance"}
    return titles.get(number, "There is no module with that number.")

def study_time(modules: int, minutes_each: int = 35) -> str:
    return f"About {modules * minutes_each / 60:.1f} hours"

TOOLS = {"get_course_module": get_course_module, "study_time": study_time}
TOOL_SCHEMAS = [
    {"type": "function", "function": {
        "name": "get_course_module", "description": "Get the title of a crash course module by number (1 to 10).",
        "parameters": {"type": "object", "properties": {"number": {"type": "integer"}}, "required": ["number"]}}},
    {"type": "function", "function": {
        "name": "study_time", "description": "Estimate study time for a number of modules.",
        "parameters": {"type": "object", "properties": {"modules": {"type": "integer"},
                                                        "minutes_each": {"type": "integer"}},
                       "required": ["modules"]}}},
]

# %%
# The agent loop
def run_agent(question, max_turns=5):
    messages = [{"role": "system", "content": "You are a course assistant. Use the tools for facts about the course."},
                {"role": "user", "content": question}]
    for turn in range(max_turns):
        reply = client.chat.completions.create(model=MODEL, messages=messages, tools=TOOL_SCHEMAS)
        msg = reply.choices[0].message
        if not msg.tool_calls:
            print(f"[final answer from {reply.model}]")
            return msg.content
        messages.append(msg.model_dump(exclude_none=True))
        for call in msg.tool_calls:
            args = json.loads(call.function.arguments or "{}")
            result = TOOLS[call.function.name](**args)
            print(f"[turn {turn + 1}] tool {call.function.name}({args}) -> {result}")
            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})
    return "Stopped after too many turns."

print(run_agent("What are modules 4 and 9 about, and how long would all 10 modules take?"))
