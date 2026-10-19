/* Code-based Agentic Workflows: how your code reaches many models. */
(function () {
  "use strict";

  const CONFIG = {
    title: "From your code to many models",
    width: 980, height: 380, minWidth: 660, legend: true,
    nodes: [
      { id: "code", label: "Your Python code", sub: "the workflow you design", x: 100, y: 190, w: 180, kind: "user" },
      { id: "sdk", label: "Agent SDK", sub: "agents, tools, runner", x: 330, y: 190, w: 180, h: 70, kind: "llm" },
      { id: "extras", label: "Guardrails and tracing", sub: "built into most SDKs", x: 330, y: 320, w: 220, kind: "human" },
      { id: "tools", label: "Your tools", sub: "functions, MCP servers, APIs", x: 330, y: 60, w: 220, kind: "tool" },
      { id: "gateway", label: "Model gateway", sub: "OpenRouter or Commonstack", x: 590, y: 190, w: 210, h: 70, kind: "data" },
      { id: "p1", label: "Commercial models", sub: "OpenAI, Anthropic, Google, ...", x: 860, y: 90, w: 210, kind: "llm" },
      { id: "p2", label: "Open-weight models", sub: "Llama, Qwen, DeepSeek, ...", x: 860, y: 190, w: 210, kind: "llm" },
      { id: "p3", label: "Free-tier models", sub: "IDs ending in :free", x: 860, y: 290, w: 210, kind: "llm" }
    ],
    edges: [
      { from: "code", to: "sdk" },
      { from: "sdk", to: "tools", label: "tool calls", dashed: true },
      { from: "sdk", to: "extras", dashed: true },
      { from: "sdk", to: "gateway", label: "one OpenAI-compatible API" },
      { from: "gateway", to: "p1" }, { from: "gateway", to: "p2" }, { from: "gateway", to: "p3" }
    ],
    steps: [
      { nodes: ["code", "sdk"], edges: ["code>sdk"], text: "<strong>You design the workflow in code.</strong> The SDK gives you agents, tools, and a runner, so you write the logic, not the plumbing." },
      { nodes: ["tools"], edges: ["sdk>tools"], text: "<strong>Tools.</strong> Python functions become tools automatically. Many SDKs can also use MCP servers." },
      { nodes: ["extras"], edges: ["sdk>extras"], text: "<strong>Safety and visibility.</strong> Guardrails check inputs and outputs, and tracing records every step for debugging." },
      { nodes: ["gateway"], edges: ["sdk>gateway"], text: "<strong>One API for many models.</strong> A gateway such as OpenRouter or Commonstack speaks the OpenAI API, so most SDKs only need a different base URL and key." },
      { nodes: ["p1", "p2", "p3"], edges: ["gateway>p1", "gateway>p2", "gateway>p3"], text: "<strong>Choose per task.</strong> Switch between commercial, open-weight, and free-tier models by changing one model ID." }
    ]
  };

  document.addEventListener("DOMContentLoaded", () => {
    const fig = document.getElementById("codeflows-diagram");
    if (fig && window.FlowDiagram) window.FlowDiagram.create(fig, CONFIG);
  });
})();
