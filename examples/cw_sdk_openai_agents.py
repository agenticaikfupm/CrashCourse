"""OpenAI Agents SDK: one agent with one tool, through OpenRouter

The OpenAI Agents SDK (pip package "openai-agents") provides agents, tools,
handoffs between agents, guardrails, and tracing. It uses OpenAI models by
default; here we point it at OpenRouter so a free model works.
Docs: https://openai.github.io/openai-agents-python/
Requires OPENROUTER_API_KEY.
"""
# %%
# !pip -q install openai-agents

# %%
import os
from getpass import getpass

from openai import AsyncOpenAI
from agents import Agent, OpenAIChatCompletionsModel, Runner, function_tool, set_tracing_disabled

key = os.environ.get("OPENROUTER_API_KEY") or getpass("OPENROUTER_API_KEY: ")
set_tracing_disabled(True)        # tracing uploads to OpenAI need an OpenAI key, so turn them off

client = AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=key)
model = OpenAIChatCompletionsModel(model="openrouter/free", openai_client=client)

@function_tool
def get_course_module(number: int) -> str:
    """Return the title of a crash course module (1 to 10)."""
    return {4: "Always-on AI Agents", 9: "Code-based Agentic Workflows"}.get(number, "Another module")

agent = Agent(
    name="Course assistant",
    instructions="Answer questions about the crash course. Use the tool for module titles.",
    tools=[get_course_module],
    model=model,
)

result = Runner.run_sync(agent, "What is module 9 called?")
print(result.final_output)
