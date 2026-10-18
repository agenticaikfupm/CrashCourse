"""From an OpenAPI description to an agent tool

A decision service is often published as a web API and described with the
OpenAPI Specification: paths, operations, parameters, and JSON schemas.
Because the description is machine-readable, an agent framework can turn each
operation into a tool definition automatically, then call the API when the
model asks for it.

Illustrative: the API below is fake and is "called" in-process. In a real
system, call_operation() would send an HTTP request (for example with httpx).
"""
import json

# A minimal OpenAPI 3 document for a parking-permit decision service.
OPENAPI_DOC = {
    "openapi": "3.1.0",
    "info": {"title": "Campus Parking Decisions", "version": "1.0.0"},
    "paths": {
        "/decisions/parking-permit": {
            "post": {
                "operationId": "decideParkingPermit",
                "summary": "Decide whether to grant a parking permit and which zone",
                "requestBody": {"content": {"application/json": {"schema": {
                    "type": "object",
                    "properties": {
                        "role": {"type": "string", "enum": ["student", "staff", "visitor"]},
                        "distance_km": {"type": "number", "description": "Home-to-campus distance"},
                        "has_disability_permit": {"type": "boolean"},
                    },
                    "required": ["role", "distance_km"],
                }}}},
            }
        }
    },
}


def openapi_to_tools(doc: dict) -> list[dict]:
    """Convert each OpenAPI operation into a function-calling tool schema."""
    tools = []
    for path, methods in doc["paths"].items():
        for method, op in methods.items():
            schema = op["requestBody"]["content"]["application/json"]["schema"]
            tools.append({"name": op["operationId"], "description": op["summary"],
                          "parameters": schema, "_route": (method.upper(), path)})
    return tools


def fake_decision_service(body: dict) -> dict:
    """What the server would do (normally a rules engine or optimizer)."""
    if body.get("has_disability_permit"):
        return {"granted": True, "zone": "A (closest)", "rule": "accessibility"}
    if body["role"] == "staff":
        return {"granted": True, "zone": "B", "rule": "staff"}
    if body["role"] == "student" and body["distance_km"] >= 10:
        return {"granted": True, "zone": "C", "rule": "commuter-student"}
    return {"granted": False, "zone": None, "rule": "students living within 10 km use the shuttle"}


def call_operation(tool: dict, arguments: dict) -> dict:
    missing = [k for k in tool["parameters"].get("required", []) if k not in arguments]
    if missing:
        raise ValueError(f"missing required arguments {missing}")
    method, path = tool["_route"]
    print(f"   HTTP {method} {path} {json.dumps(arguments)}")
    return fake_decision_service(arguments)


tools = openapi_to_tools(OPENAPI_DOC)
print("Tool generated from the OpenAPI document:")
print(json.dumps({k: v for k, v in tools[0].items() if not k.startswith("_")}, indent=2))

# The model reads the tool schema and produces arguments from the user's words.
user = "I'm a student and I live 14 km from campus. Can I get a parking permit?"
model_tool_call = {"name": "decideParkingPermit", "arguments": {"role": "student", "distance_km": 14}}
print(f"\nUser: {user}\nModel calls: {model_tool_call['name']}")
result = call_operation(tools[0], model_tool_call["arguments"])
print("Decision service result:", result)
print("Agent reply: Yes. You qualify for a Zone C permit as a commuter student.")
