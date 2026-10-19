"""Pydantic AI: a type-safe agent with structured output, through OpenRouter

Pydantic AI, from the team behind Pydantic, focuses on type safety: tools and
outputs are validated Python types. It has a built-in OpenRouter provider.
Docs: https://ai.pydantic.dev/
Requires OPENROUTER_API_KEY.
"""
# %%
# !pip -q install "pydantic-ai-slim[openrouter]"

# %%
import os
from getpass import getpass

from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openrouter import OpenRouterModel
from pydantic_ai.providers.openrouter import OpenRouterProvider

key = os.environ.get("OPENROUTER_API_KEY") or getpass("OPENROUTER_API_KEY: ")
model = OpenRouterModel("openrouter/free", provider=OpenRouterProvider(api_key=key))

class ModuleInfo(BaseModel):          # the agent must return data in this shape
    number: int
    title: str

agent = Agent(model, output_type=ModuleInfo,
              system_prompt="Answer questions about the crash course. Use the tool for module titles.")

@agent.tool_plain
def get_course_module(number: int) -> str:
    """Return the title of a crash course module (1 to 10)."""
    return {4: "Always-on AI Agents", 9: "Code-based Agentic Workflows"}.get(number, "Another module")

result = agent.run_sync("What is module 9 called?")
print(result.output)              # a validated ModuleInfo object
