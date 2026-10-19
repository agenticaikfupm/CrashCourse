"""Claude Agent SDK: an agent with a custom tool

The Claude Agent SDK (pip package "claude-agent-sdk") gives you the same agent
harness that powers Claude Code: built-in tools for files, the shell, and the
web, plus your own tools exposed as an in-process MCP server. It runs Claude
models, so it needs an Anthropic API key (ANTHROPIC_API_KEY), not an OpenRouter key.
Docs: https://github.com/anthropics/claude-agent-sdk-python
"""
# %%
# !pip -q install claude-agent-sdk

# %%
import asyncio
import os
from getpass import getpass

from claude_agent_sdk import (AssistantMessage, ClaudeAgentOptions, ClaudeSDKClient, ResultMessage,
                              TextBlock, create_sdk_mcp_server, tool)

if not os.environ.get("ANTHROPIC_API_KEY"):
    os.environ["ANTHROPIC_API_KEY"] = getpass("ANTHROPIC_API_KEY: ")

@tool("get_course_module", "Return the title of a crash course module (1 to 10)", {"number": int})
async def get_course_module(args):
    title = {4: "Always-on AI Agents", 9: "Code-based Agentic Workflows"}.get(args["number"], "Another module")
    return {"content": [{"type": "text", "text": title}]}

server = create_sdk_mcp_server(name="course", version="1.0.0", tools=[get_course_module])
options = ClaudeAgentOptions(
    mcp_servers={"course": server},
    allowed_tools=["mcp__course__get_course_module"],   # MCP tools are named mcp__<server>__<tool>
)

async def main():
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What is module 9 called?")
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):          # the agent's replies
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(block.text)
            elif isinstance(message, ResultMessage):           # the end of the run
                print(f"Done in {message.num_turns} turn(s), cost ${message.total_cost_usd or 0:.4f}")

asyncio.run(main())
