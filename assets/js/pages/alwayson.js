/* Always-on AI Agents: common architecture of proactive, persistent agents. */
(function () {
  "use strict";

  const CONFIG = {
    title: "How an always-on agent works",
    width: 980, height: 400, minWidth: 660, legend: true,
    nodes: [
      { id: "sched", label: "Schedules", sub: "daily digest, routines", x: 95, y: 60, w: 170, kind: "user" },
      { id: "events", label: "App events", sub: "new email, bug report", x: 95, y: 150, w: 170, kind: "user" },
      { id: "msgs", label: "Your messages", sub: "chat, Slack, voice", x: 95, y: 240, w: 170, kind: "user" },
      { id: "scan", label: "Proactive check", sub: "read-only background scan", x: 95, y: 330, w: 190, kind: "user" },
      { id: "agent", label: "Always-on agent", sub: "goals, memory, reasoning", x: 400, y: 195, w: 200, h: 70, kind: "llm" },
      { id: "computer", label: "Its own computer", sub: "browser, files, logins", x: 400, y: 330, w: 200, kind: "data" },
      { id: "rules", label: "Permission rules", sub: "allow, approve, block", x: 665, y: 195, w: 180, kind: "human" },
      { id: "apps", label: "Connected apps", sub: "act on your behalf", x: 880, y: 110, w: 170, kind: "tool" },
      { id: "you", label: "You", sub: "approve, redirect, pause", x: 880, y: 280, w: 170, kind: "human" },
      { id: "log", label: "Activity log", sub: "everything it did", x: 665, y: 330, w: 160, kind: "data" }
    ],
    edges: [
      { from: "sched", to: "agent" }, { from: "events", to: "agent" }, { from: "msgs", to: "agent" }, { from: "scan", to: "agent" },
      { from: "agent", to: "computer", label: "works in", dashed: true },
      { from: "agent", to: "rules", label: "request" },
      { from: "rules", to: "apps", label: "allowed" },
      { from: "rules", to: "you", label: "needs approval" },
      { from: "you", to: "apps", label: "approved" },
      { from: "rules", to: "log", dashed: true },
      { from: "you", to: "agent", label: "feedback", dashed: true, via: [[972, 280], [972, 28], [400, 28]], labelAt: [690, 28] }
    ],
    steps: [
      { nodes: ["sched", "events", "msgs", "scan", "agent"], edges: ["sched>agent", "events>agent", "msgs>agent", "scan>agent"], text: "<strong>Wake up.</strong> No prompt is needed. A schedule, an event in a connected app, your message, or the agent's own read-only background check can start work." },
      { nodes: ["agent", "computer"], edges: ["agent>computer"], text: "<strong>Work.</strong> The agent uses its memory of your goals and preferences, often working in its own cloud computer with a browser and files that you can inspect." },
      { nodes: ["rules"], edges: ["agent>rules"], text: "<strong>Check permissions.</strong> Every proposed action is checked against rules: some actions are allowed, some need your approval, and some are blocked." },
      { nodes: ["apps"], edges: ["rules>apps"], text: "<strong>Act.</strong> Allowed actions run in your connected apps, such as drafting a document or preparing a pull request." },
      { nodes: ["you"], edges: ["rules>you", "you>apps"], text: "<strong>Ask.</strong> Consequential actions, like sending an email or paying an invoice, wait for you." },
      { nodes: ["log", "agent"], edges: ["rules>log", "you>agent"], text: "<strong>Learn and stay accountable.</strong> Everything is recorded in an activity log, and your feedback updates the agent's memory for next time." }
    ]
  };

  document.addEventListener("DOMContentLoaded", () => {
    const fig = document.getElementById("alwayson-diagram");
    if (fig && window.FlowDiagram) window.FlowDiagram.create(fig, CONFIG);
  });
})();
