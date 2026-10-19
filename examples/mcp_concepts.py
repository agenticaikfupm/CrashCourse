"""MCP concepts: a client and server exchanging JSON-RPC messages

The Model Context Protocol (MCP) uses JSON-RPC 2.0 messages between a client
(inside the AI application) and a server (which exposes capabilities).
A server can offer three kinds of capabilities:
  * Tools: functions the model can call (tools/list, tools/call)
  * Resources: data the application can read (resources/list, resources/read)
  * Prompts: reusable prompt templates (prompts/list, prompts/get)

Illustrative simulation: this runs both sides in one process and skips the
transport (stdio or HTTP) and parts of the initialization handshake. Message
shapes are simplified. See the next example for the official Python SDK.
"""
import json


class TinyMCPServer:
    """A toy server exposing one tool, one resource, and one prompt."""

    def __init__(self):
        self.tools = {
            "get_course_schedule": {
                "description": "Return the schedule for a course module",
                "inputSchema": {"type": "object", "properties": {"module": {"type": "integer"}}, "required": ["module"]},
            }
        }
        self.resources = {"course://syllabus": "Module 1: Evolution of AI ... Module 10: Governance"}
        self.prompts = {"summarize_module": "Summarize module {module} for a beginner in 3 bullet points."}

    def handle(self, request: dict) -> dict:
        method, params = request["method"], request.get("params", {})
        if method == "initialize":
            result = {"serverInfo": {"name": "course-server"}, "capabilities": {"tools": {}, "resources": {}, "prompts": {}}}
        elif method == "tools/list":
            result = {"tools": [{"name": n, **spec} for n, spec in self.tools.items()]}
        elif method == "tools/call":
            module = params["arguments"]["module"]
            result = {"content": [{"type": "text", "text": f"Module {module} runs on Sunday at 4 pm"}]}
        elif method == "resources/list":
            result = {"resources": [{"uri": u} for u in self.resources]}
        elif method == "resources/read":
            uri = params["uri"]
            result = {"contents": [{"uri": uri, "text": self.resources[uri]}]}
        elif method == "prompts/get":
            text = self.prompts[params["name"]].format(**params["arguments"])
            result = {"messages": [{"role": "user", "content": {"type": "text", "text": text}}]}
        else:
            return {"jsonrpc": "2.0", "id": request["id"], "error": {"code": -32601, "message": "Method not found"}}
        return {"jsonrpc": "2.0", "id": request["id"], "result": result}


class TinyMCPClient:
    def __init__(self, server):
        self.server, self.next_id = server, 1

    def request(self, method: str, params: dict | None = None) -> dict:
        msg = {"jsonrpc": "2.0", "id": self.next_id, "method": method}
        if params:
            msg["params"] = params
        self.next_id += 1
        print("client ->", json.dumps(msg))
        reply = self.server.handle(msg)
        print("server <-", json.dumps(reply), "\n")
        return reply


client = TinyMCPClient(TinyMCPServer())
client.request("initialize")
client.request("tools/list")
client.request("tools/call", {"name": "get_course_schedule", "arguments": {"module": 5}})
client.request("resources/read", {"uri": "course://syllabus"})
client.request("prompts/get", {"name": "summarize_module", "arguments": {"module": 5}})
