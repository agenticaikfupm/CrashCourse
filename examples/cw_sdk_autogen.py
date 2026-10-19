"""AutoGen and Magentic-One: agents that talk to each other

AutoGen, from Microsoft, builds multi-agent applications. Its AgentChat layer
provides AssistantAgent and teams of agents. Magentic-One is a generalist
multi-agent team built on AutoGen: an Orchestrator plans and assigns work to a
web surfer, a file surfer, a coder, and a code executor.
Docs: https://microsoft.github.io/autogen/stable/
Requires OPENROUTER_API_KEY. Non-OpenAI models need a model_info description.
"""
# %%
# !pip -q install -U "autogen-agentchat" "autogen-ext[openai]"

# %%
import asyncio
import os
from getpass import getpass

from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

key = os.environ.get("OPENROUTER_API_KEY") or getpass("OPENROUTER_API_KEY: ")
model_client = OpenAIChatCompletionClient(
    model="openrouter/free",
    base_url="https://openrouter.ai/api/v1",
    api_key=key,
    model_info={"vision": False, "function_calling": True, "json_output": False,
                "family": "unknown", "structured_output": False},
)

async def get_course_module(number: int) -> str:
    """Return the title of a crash course module (1 to 10)."""
    return {4: "Always-on AI Agents", 9: "Code-based Agentic Workflows"}.get(number, "Another module")

agent = AssistantAgent(name="course_assistant", model_client=model_client, tools=[get_course_module],
                       system_message="Answer questions about the crash course. Use tools for module titles.")

async def main():
    result = await agent.run(task="What is module 9 called?")
    print(result.messages[-1].content)
    await model_client.close()

asyncio.run(main())

# %%
# Magentic-One (optional, more advanced). It browses the web and runs code, so
# run it in a container and keep a human in the loop. Setup:
#   pip install "autogen-ext[magentic-one,openai]" && playwright install --with-deps chromium
#
# from autogen_agentchat.teams import MagenticOneGroupChat
# from autogen_agentchat.ui import Console
# team = MagenticOneGroupChat([agent], model_client=model_client)
# await Console(team.run_stream(task="Find the official MCP documentation and summarize it."))
