/* Model Context Protocol: interactive host/client/server workflow. */
(function () {
  "use strict";

  const CONFIG = {
    title: "MCP workflow: answering \"When is the Module 4 session?\"",
    width: 960, height: 400, minWidth: 640, legend: true,
    nodes: [
      { id: "host", label: "Host application (e.g., a chat app or IDE)", x: 330, y: 200, w: 330, h: 330, kind: "group" },
      { id: "user", label: "User", sub: "asks a question", x: 70, y: 200, w: 110, kind: "user" },
      { id: "llm", label: "LLM", sub: "chooses a tool", x: 330, y: 115, w: 160, kind: "llm" },
      { id: "client", label: "MCP client", sub: "one per server", x: 330, y: 290, w: 160 },
      { id: "s1", label: "Files server", sub: "MCP server", x: 640, y: 80, w: 160, kind: "tool" },
      { id: "s2", label: "Course server", sub: "MCP server", x: 640, y: 200, w: 160, kind: "tool" },
      { id: "s3", label: "Calendar server", sub: "MCP server", x: 640, y: 320, w: 160, kind: "tool" },
      { id: "e1", label: "Local files", x: 870, y: 80, w: 130, kind: "data" },
      { id: "e2", label: "Course database", x: 870, y: 200, w: 150, kind: "data" },
      { id: "e3", label: "Calendar API", x: 870, y: 320, w: 130, kind: "data" }
    ],
    edges: [
      { from: "client", to: "s1", label: "initialize", curve: 0 },
      { from: "client", to: "s2", label: "tools/call" },
      { from: "client", to: "s3", label: "tools/list" },
      { from: "s1", to: "e1" }, { from: "s2", to: "e2", label: "query" }, { from: "s3", to: "e3" },
      { from: "user", to: "llm", label: "question", curve: -18 },
      { from: "llm", to: "client", label: "call get_schedule", curve: -30 },
      { from: "client", to: "llm", label: "result", curve: -30, dashed: true },
      { from: "llm", to: "user", label: "answer", curve: -18 }
    ],
    steps: [
      { nodes: ["client", "s1", "s2", "s3"], edges: ["client>s1", "client>s3"], text: "<strong>Connect and discover.</strong> When the host starts, each client connects to its server, runs <code>initialize</code>, and asks what it offers (<code>tools/list</code>, <code>resources/list</code>, <code>prompts/list</code>)." },
      { nodes: ["user", "llm"], edges: ["user>llm"], text: "<strong>Ask.</strong> The user asks a question. The host gives the LLM the question plus the list of available tools and their schemas." },
      { nodes: ["llm", "client"], edges: ["llm>client"], text: "<strong>Choose a tool.</strong> The LLM decides to call <code>get_course_schedule</code> with <code>{\"module\": 4}</code>. The host may ask the user to approve this call." },
      { nodes: ["client", "s2"], edges: ["client>s2"], text: "<strong>Call.</strong> The client sends a JSON-RPC <code>tools/call</code> request to the course server over stdio or HTTP." },
      { nodes: ["s2", "e2"], edges: ["s2>e2"], text: "<strong>Reach the external system.</strong> The server runs its own code: here it queries the course database. The LLM never sees credentials." },
      { nodes: ["llm"], edges: ["client>llm"], text: "<strong>Return the result.</strong> The tool result travels back through the client into the LLM's context." },
      { nodes: ["user"], edges: ["llm>user"], text: "<strong>Answer.</strong> The LLM writes a grounded answer: \"Module 4 runs on Sunday at 4 pm.\"" }
    ]
  };

  document.addEventListener("DOMContentLoaded", () => {
    const fig = document.getElementById("mcp-diagram");
    if (fig && window.FlowDiagram) window.FlowDiagram.create(fig, CONFIG);
  });
})();
