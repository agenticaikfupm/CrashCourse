"""LangChain: create_agent with one tool, through OpenRouter

LangChain (version 1) builds agents with create_agent(), on top of its
LangGraph runtime. LangChain recommends its provider package
langchain-openrouter for OpenRouter models.
Docs: https://docs.langchain.com/oss/python/langchain/agents
Requires OPENROUTER_API_KEY.
"""
# %%
# !pip -q install langchain langchain-openrouter

# %%
import os
from getpass import getpass

from langchain.agents import create_agent
from langchain.tools import tool
from langchain_openrouter import ChatOpenRouter

if not os.environ.get("OPENROUTER_API_KEY"):
    os.environ["OPENROUTER_API_KEY"] = getpass("OPENROUTER_API_KEY: ")

@tool
def get_course_module(number: int) -> str:
    """Return the title of a crash course module (1 to 10)."""
    return {4: "Always-on AI Agents", 9: "Code-based Agentic Workflows"}.get(number, "Another module")

agent = create_agent(
    model=ChatOpenRouter(model="openrouter/free"),
    tools=[get_course_module],
    system_prompt="Answer questions about the crash course. Use the tool for module titles.",
)

result = agent.invoke({"messages": [{"role": "user", "content": "What is module 9 called?"}]})
print(result["messages"][-1].content)
