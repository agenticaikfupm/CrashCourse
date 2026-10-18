"""A real MCP server and client with the official Python SDK

This uses the official `mcp` Python SDK (https://github.com/modelcontextprotocol/python-sdk),
version 2 or later. In version 2 the high-level server class is MCPServer
(it was called FastMCP in version 1).
Part 1 writes a small server with one tool, one resource, and one prompt.
Part 2 starts the server as a subprocess over stdio and calls it from a client.

Run it in Google Colab or locally (Python 3.10+). In a plain script, run the
server and client as two separate files; the notebook does both for you.
"""
# %%
# !pip -q install "mcp[cli]>=2"

# %%
# %%writefile course_server.py
from mcp.server.mcpserver import MCPServer

mcp = MCPServer("Course Helper")


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


@mcp.resource("course://modules/{number}")
def module_title(number: int) -> str:
    """Title of a course module."""
    titles = {1: "Evolution of AI", 2: "Components of AI Agents", 4: "Model Context Protocol"}
    return titles.get(int(number), "Unknown module")


@mcp.prompt()
def explain(topic: str) -> str:
    """A reusable prompt template."""
    return f"Explain {topic} to a beginner using one everyday analogy."


if __name__ == "__main__":
    mcp.run()          # stdio transport by default

# %%
# Part 2: a client that launches the server and talks to it.
import asyncio
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    params = StdioServerParameters(command=sys.executable, args=["course_server.py"])
    # Server log messages go to a file (notebooks do not always expose a real stderr).
    with open("server.log", "w") as log:
        async with stdio_client(params, errlog=log) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                tools = await session.list_tools()
                print("Tools:", [t.name for t in tools.tools])

                result = await session.call_tool("add", arguments={"a": 2, "b": 3})
                print("add(2, 3) ->", result.content[0].text)

                resource = await session.read_resource("course://modules/4")
                print("Resource:", resource.contents[0].text)

                prompt = await session.get_prompt("explain", arguments={"topic": "MCP"})
                print("Prompt:", prompt.messages[0].content.text)


asyncio.run(main())
