/* Components of AI Agents: selectable architecture diagram.
   Layout follows the course slide "Agent.pptx": user -> agent (prompt
   template, foundation model, memory, toolkit) -> response, extended with
   the nine components covered in this module. */
(function () {
  "use strict";

  const DETAILS = {
    user: {
      title: "User", tag: "Outside the agent",
      role: "States a goal or question (the query or intent) and receives the agent's response. The user may also be asked to clarify or approve.",
      where: "The starting point and end point of every interaction.",
      example: "\"Book a room for 6 students at 3 pm in Building 22.\""
    },
    instructions: {
      title: "Prompt template and instructions", tag: "Configuration",
      role: "The fixed instructions (often called the system prompt) that define the agent's role, rules, tone, and output format. The user's request is inserted into this template.",
      where: "Feeds the foundation model on every step, together with memory and observations.",
      example: "\"You are a campus booking assistant. Only book rooms the user is allowed to use. Reply in JSON.\""
    },
    perception: {
      title: "Perception", tag: "Input", code: "perception",
      role: "Turns raw inputs (text, images, sensor readings, tool results) into clean, structured observations. It also validates inputs and flags missing or suspicious data.",
      where: "First stage of the loop: everything the agent knows about the current situation passes through it.",
      example: "Extracting intent = book_room, group_size = 6, hour = 15 from a chat message."
    },
    reasoning: {
      title: "Reasoning (foundation model)", tag: "Core", code: "reasoning",
      role: "The foundation model interprets the goal, weighs evidence, and decides what to do. The slide notes it can be domain-specific or generic, and a small or large language or reasoning model (LLM or LRM).",
      where: "Central component: it reads instructions, memory, and observations, and produces decisions.",
      example: "\"Two rooms fit; the smaller one is better because it keeps the large room free.\""
    },
    planning: {
      title: "Planning", tag: "Core", code: "planning",
      role: "Breaks a goal into ordered steps, respecting dependencies, and revises the plan when a step fails (replanning).",
      where: "Between reasoning and action: it turns a decision into an executable sequence.",
      example: "pick_date, then book_room and invite_speakers, then open_registration."
    },
    action: {
      title: "Action", tag: "Output", code: "action",
      role: "Executes the next step of the plan: calling a tool, sending a message, writing a file, or moving a robot. Actions should be validated before they run.",
      where: "Where decisions affect the outside world, so it is also where guardrails and approvals matter most.",
      example: "Calling book_room(room=\"B22-204\", hour=15)."
    },
    tools: {
      title: "Tools (toolkit)", tag: "Capabilities", code: "action",
      role: "Functions and services the agent can call: APIs, search, a browser, a vector database, the file system, or an optimization solver. Each tool has a name, a description, and an input schema.",
      where: "Extends what the model can do beyond generating text. MCP (Module 5) standardizes how tools are connected.",
      example: "get_weather(city), calculator(expression), search_catalog(query)."
    },
    memory: {
      title: "Memory", tag: "State", code: "memory",
      role: "Short-term memory holds the current conversation and working notes. Long-term memory stores knowledge across sessions: semantic (facts), episodic (past events), and procedural (how to do things).",
      where: "Retrieved before reasoning and updated after actions, as the slide's retrieve/update arrow shows.",
      example: "Remembering that the user prefers morning meetings (semantic) and booked B22-204 last week (episodic)."
    },
    feedback: {
      title: "Feedback and learning", tag: "Improvement",
      role: "Compares outcomes with goals. The agent can retry, adjust its plan, update memory, or (offline) improve prompts and models from collected feedback.",
      where: "Closes the loop from action back to perception, reasoning, and planning (Module 7 runs this loop end to end).",
      example: "A booking failed because the room was taken, so the agent picks the next-best room and remembers to check availability first."
    },
    safety: {
      title: "Safety and governance", tag: "Controls",
      role: "Policies and technical controls around the agent: input and output guardrails, tool permissions, rate and spending limits, logging, and evaluation.",
      where: "Wraps every component, not just one step. Module 10 covers it in depth.",
      example: "The agent may read calendars but cannot delete events; every tool call is logged."
    },
    oversight: {
      title: "Human oversight", tag: "Controls",
      role: "People who can monitor, approve, correct, or stop the agent. High-risk actions pause for approval (human-in-the-loop); lower-risk ones are monitored after the fact (human-on-the-loop).",
      where: "Connected to safety and governance, with authority over actions.",
      example: "A staff member approves any booking longer than 8 hours."
    }
  };

  const CONFIG = {
    title: "AI agent architecture",
    width: 960, height: 560, minWidth: 640,
    selectable: true, legend: true,
    intro: "Select any box to see its role, or press Play to follow one request through the agent.",
    nodes: [
      { id: "agent", label: "Agent", x: 530, y: 290, w: 700, h: 470, kind: "group" },
      { id: "user", label: "User", sub: "goal or question", x: 85, y: 250, w: 130, kind: "user" },
      { id: "oversight", label: "Human oversight", sub: "approve, stop", x: 85, y: 470, w: 140, kind: "human" },
      { id: "instructions", label: "Prompt template", sub: "instructions", x: 380, y: 125, w: 170, kind: "data" },
      { id: "memory", label: "Memory", sub: "short- and long-term", x: 690, y: 125, w: 180, kind: "data" },
      { id: "perception", label: "Perception", sub: "structure inputs", x: 300, y: 255, w: 150 },
      { id: "reasoning", label: "Reasoning", sub: "foundation model", x: 500, y: 255, w: 160, kind: "llm" },
      { id: "planning", label: "Planning", sub: "ordered steps", x: 705, y: 255, w: 150, kind: "llm" },
      { id: "action", label: "Action", sub: "execute a step", x: 705, y: 375, w: 150 },
      { id: "tools", label: "Tools", sub: "APIs, search, solvers", x: 500, y: 375, w: 170, kind: "tool" },
      { id: "feedback", label: "Feedback", sub: "and learning", x: 300, y: 375, w: 150 },
      { id: "safety", label: "Safety and governance", sub: "guardrails, permissions, logging", x: 530, y: 485, w: 420, h: 50, kind: "human" }
    ],
    edges: [
      { from: "user", to: "perception", label: "query / intent" },
      { from: "instructions", to: "reasoning", label: "instructions" },
      { from: "perception", to: "reasoning" },
      { from: "reasoning", to: "memory", label: "retrieve / update", curve: -20 },
      { from: "reasoning", to: "planning" },
      { from: "planning", to: "action" },
      { from: "action", to: "tools", label: "tool use" },
      { from: "tools", to: "feedback", label: "results" },
      { from: "feedback", to: "perception", dashed: true, label: "observe" },
      { from: "feedback", to: "reasoning", dashed: true, label: "learn", curve: 18 },
      { from: "oversight", to: "safety", dashed: true, label: "approve / intervene" },
      { from: "safety", to: "action", dashed: true, label: "check", via: [[840, 485], [840, 375]] },
      { from: "action", to: "user", label: "agent response", via: [[705, 432], [160, 432], [160, 250]], labelAt: [400, 432] }
    ],
    steps: [
      { nodes: ["user", "perception"], edges: ["user>perception"], text: "<strong>Perception.</strong> The user's request arrives and is parsed into a structured observation (intent, entities, constraints)." },
      { nodes: ["instructions", "reasoning", "memory"], edges: ["instructions>reasoning", "perception>reasoning", "reasoning>memory"], text: "<strong>Reasoning.</strong> The foundation model combines the instructions, the observation, and relevant memories." },
      { nodes: ["planning"], edges: ["reasoning>planning"], text: "<strong>Planning.</strong> The decision becomes an ordered list of steps." },
      { nodes: ["action", "safety"], edges: ["planning>action", "safety>action"], text: "<strong>Action with safety checks.</strong> Before executing, guardrails check permissions and limits." },
      { nodes: ["oversight", "safety"], edges: ["oversight>safety"], text: "<strong>Human oversight.</strong> High-risk actions wait for a person to approve them." },
      { nodes: ["tools"], edges: ["action>tools"], text: "<strong>Tool use.</strong> The action calls a tool, such as a booking API, search, or a solver." },
      { nodes: ["feedback"], edges: ["tools>feedback"], text: "<strong>Feedback.</strong> The result is compared with the goal. Did the booking succeed?" },
      { nodes: ["perception", "reasoning"], edges: ["feedback>perception", "feedback>reasoning"], text: "<strong>Learning loop.</strong> The outcome becomes a new observation, and lessons are stored in memory." },
      { nodes: ["user"], edges: ["action>user"], text: "<strong>Response.</strong> The agent reports back to the user, ideally explaining what it did." }
    ]
  };

  function renderDetail(id) {
    const d = DETAILS[id];
    const panel = document.getElementById("component-detail");
    if (!d || !panel) return;
    panel.innerHTML = `
      <div class="fade-in">
        <span class="tag accent">${d.tag}</span>
        <h3 class="mt-1">${d.title}</h3>
        <div class="detail-cols">
          <div><h4>What it does</h4><p>${d.role}</p></div>
          <div><h4>Where it fits</h4><p>${d.where}</p></div>
          <div><h4>Example</h4><p>${d.example}</p></div>
        </div>
        ${d.code ? `<p class="mt-1"><a class="btn btn-ghost btn-sm" href="#code" data-open-tab="tab-${d.code}">${window.icon("code")}See the Python example</a></p>` : ""}
      </div>`;
    const link = panel.querySelector("[data-open-tab]");
    if (link) link.addEventListener("click", () => {
      const tab = document.getElementById(link.dataset.openTab);
      if (tab) tab.click();
    });
  }

  function renderButtons(flow) {
    const bar = document.getElementById("component-pills");
    if (!bar) return;
    const order = ["perception", "reasoning", "planning", "action", "tools", "memory", "feedback", "safety", "oversight"];
    bar.innerHTML = order.map(id => `<button type="button" class="pill" aria-pressed="false" data-id="${id}">${DETAILS[id].title.replace(" (foundation model)", "").replace(" (toolkit)", "")}</button>`).join("");
    bar.querySelectorAll(".pill").forEach(b => b.addEventListener("click", () => flow.select(b.dataset.id, true)));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const fig = document.getElementById("agent-diagram");
    if (!fig || !window.FlowDiagram) return;
    let flow;
    CONFIG.onSelect = id => {
      renderDetail(id);
      document.querySelectorAll("#component-pills .pill").forEach(p => p.setAttribute("aria-pressed", String(p.dataset.id === id)));
    };
    flow = window.FlowDiagram.create(fig, CONFIG);
    renderButtons(flow);
    flow.select("reasoning");
  });
})();
