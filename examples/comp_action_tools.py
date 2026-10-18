"""Action and tools: calling functions from structured model output

Modern LLMs can "call" tools: you describe each tool with a name, a short
description, and a JSON schema for its arguments. The model replies with a
structured request (tool name + arguments), your code runs the function,
and the result goes back to the model. This is often called function calling.

Illustrative: fake_llm() returns the kind of JSON a real model would return.
"""
import json
import math

# 1) Tools are ordinary Python functions...
def get_weather(city: str) -> dict:
    data = {"Dhahran": {"temp_c": 38, "sky": "clear"}, "Riyadh": {"temp_c": 41, "sky": "dusty"}}
    return data.get(city, {"error": f"no data for {city}"})

def calculator(expression: str) -> float:
    allowed = {"sqrt": math.sqrt, "pi": math.pi}
    return eval(expression, {"__builtins__": {}}, allowed)  # restricted; see the governance module

# 2) ...plus a description the model can read (a JSON schema per tool).
TOOLS = {
    "get_weather": {
        "function": get_weather,
        "description": "Current weather for a city",
        "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]},
    },
    "calculator": {
        "function": calculator,
        "description": "Evaluate a math expression",
        "parameters": {"type": "object", "properties": {"expression": {"type": "string"}}, "required": ["expression"]},
    },
}

def fake_llm(user_message: str) -> str:
    """Stands in for a model that decides which tool to call."""
    if "weather" in user_message.lower():
        return json.dumps({"tool": "get_weather", "arguments": {"city": "Dhahran"}})
    return json.dumps({"tool": "calculator", "arguments": {"expression": "sqrt(2) * 10"}})

# 3) The action step: validate the request, then execute it.
def act(model_output: str):
    call = json.loads(model_output)
    name, args = call["tool"], call["arguments"]
    if name not in TOOLS:
        return {"error": f"unknown tool {name}"}
    missing = [p for p in TOOLS[name]["parameters"]["required"] if p not in args]
    if missing:
        return {"error": f"missing arguments: {missing}"}
    return TOOLS[name]["function"](**args)

for question in ["What's the weather in Dhahran?", "What is ten times the square root of two?"]:
    request = fake_llm(question)
    print("User:      ", question)
    print("Model asks:", request)
    print("Tool result:", act(request), "\n")
