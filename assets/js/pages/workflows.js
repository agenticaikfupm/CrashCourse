/* Agentic AI Workflows: the perception-to-feedback loop. */
(function () {
  "use strict";

  const STAGE = {
    perception: { title: "Perception", input: "Raw signals: messages, sensor readings, documents, tool results", output: "A clean, structured observation", example: "{Dorms: 25, Library: 14, North gate: 6} riders waiting" },
    reasoning: { title: "Reasoning", input: "Observation, goals, memory, and rules", output: "An interpretation or decision", example: "Dorms is congested because 25 riders exceed the threshold of 16" },
    planning: { title: "Planning", input: "Decision and constraints", output: "An ordered list of actions", example: "Send one extra shuttle to Dorms (at most two extra shuttles)" },
    action: { title: "Action", input: "The next planned step", output: "A change in the environment, through a tool", example: "dispatch_extra(stop=\"Dorms\")" },
    env: { title: "Environment", input: "The agent's actions", output: "New state and measurable outcomes", example: "Riders board; wait times change" },
    feedback: { title: "Feedback and learning", input: "Outcomes compared with goals", output: "Updates to memory, thresholds, prompts, or plans", example: "Worst wait 8.8 min exceeds the 8 min target, so lower the threshold to 12" }
  };

  const CONFIG = {
    title: "The agentic workflow loop",
    width: 980, height: 400, minWidth: 640, legend: true, selectable: true,
    intro: "Press Play to watch information flow around the loop, or select a stage for its inputs and outputs.",
    nodes: [
      { id: "perception", label: "Perception", sub: "observe", x: 130, y: 90, w: 160 },
      { id: "reasoning", label: "Reasoning", sub: "interpret and decide", x: 370, y: 90, w: 180, kind: "llm" },
      { id: "planning", label: "Planning", sub: "order the steps", x: 610, y: 90, w: 170, kind: "llm" },
      { id: "action", label: "Action", sub: "use tools", x: 850, y: 90, w: 150, kind: "tool" },
      { id: "feedback", label: "Feedback and learning", sub: "compare with goals", x: 490, y: 225, w: 220, kind: "human" },
      { id: "env", label: "Environment", sub: "users, sensors, systems", x: 490, y: 345, w: 230, kind: "user" }
    ],
    edges: [
      { from: "perception", to: "reasoning", label: "observation" },
      { from: "reasoning", to: "planning", label: "decision" },
      { from: "planning", to: "action", label: "plan" },
      { from: "action", to: "env", label: "changes the world" },
      { from: "env", to: "perception", label: "new signals" },
      { from: "env", to: "feedback", label: "outcome" },
      { from: "feedback", to: "perception", dashed: true, label: "improve sensing" },
      { from: "feedback", to: "reasoning", dashed: true, label: "update memory" },
      { from: "feedback", to: "planning", dashed: true, label: "adjust plans" }
    ],
    steps: [
      { nodes: ["env", "perception"], edges: ["env>perception"], text: "<strong>Perception.</strong> Sensors report how many riders wait at each stop. The agent cleans the data into an observation." },
      { nodes: ["reasoning"], edges: ["perception>reasoning"], text: "<strong>Reasoning.</strong> Using its memory (the current congestion threshold), the agent decides which stops are congested." },
      { nodes: ["planning"], edges: ["reasoning>planning"], text: "<strong>Planning.</strong> It orders the congested stops by urgency and respects a limit of two extra shuttles." },
      { nodes: ["action", "env"], edges: ["planning>action", "action>env"], text: "<strong>Action.</strong> Dispatch tools send shuttles. The world changes." },
      { nodes: ["feedback"], edges: ["env>feedback"], text: "<strong>Feedback.</strong> Measured wait times are compared with the 8-minute target." },
      { nodes: ["perception", "reasoning", "planning"], edges: ["feedback>perception", "feedback>reasoning", "feedback>planning"], text: "<strong>Learning.</strong> Missed the target? Lower the threshold so the next cycle reacts earlier. Feedback can also improve sensing and planning rules." }
    ]
  };

  function showStage(id) {
    const s = STAGE[id];
    const panel = document.getElementById("stage-detail");
    if (!s || !panel) return;
    panel.innerHTML = `<div class="fade-in"><h3>${s.title}</h3>
      <div class="detail-cols">
        <div><h4>Input</h4><p>${s.input}</p></div>
        <div><h4>Output</h4><p>${s.output}</p></div>
        <div><h4>In the shuttle example</h4><p><code>${s.example}</code></p></div>
      </div></div>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const fig = document.getElementById("loop-diagram");
    if (!fig || !window.FlowDiagram) return;
    CONFIG.onSelect = showStage;
    const flow = window.FlowDiagram.create(fig, CONFIG);
    flow.select("perception");
  });
})();
