"""smolagents: a CodeAgent that writes Python to use its tools

smolagents, from Hugging Face, is a small library whose CodeAgent writes and
runs Python code to call tools, instead of emitting JSON tool calls. Its
OpenAIModel class works with any OpenAI-compatible server.
Docs: https://huggingface.co/docs/smolagents/index
Requires OPENROUTER_API_KEY.
"""
# %%
# !pip -q install "smolagents[openai]"

# %%
import os
from getpass import getpass

from smolagents import CodeAgent, OpenAIModel, tool

key = os.environ.get("OPENROUTER_API_KEY") or getpass("OPENROUTER_API_KEY: ")
model = OpenAIModel(model_id="openrouter/free", api_base="https://openrouter.ai/api/v1", api_key=key)

@tool
def get_course_module(number: int) -> str:
    """Return the title of a crash course module.

    Args:
        number: The module number, from 1 to 10.
    """
    return {4: "Always-on AI Agents", 9: "Code-based Agentic Workflows"}.get(number, "Another module")

agent = CodeAgent(tools=[get_course_module], model=model)
print(agent.run("What are modules 4 and 9 called?"))
