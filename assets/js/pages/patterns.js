/* Agent Design Patterns: one interactive workflow diagram per pattern.
   Text content lives in patterns.html; this file only defines diagrams and
   renders each one the first time its tab is opened. */
(function () {
  "use strict";

  const D = {
    basic: {
      title: "Basic responder", width: 760, height: 200,
      nodes: [
        { id: "user", label: "User", sub: "query", x: 90, y: 100, kind: "user" },
        { id: "llm", label: "LLM", sub: "single call", x: 380, y: 100, kind: "llm" },
        { id: "out", label: "Response", sub: "model output", x: 670, y: 100, kind: "data" }
      ],
      edges: [{ from: "user", to: "llm", label: "prompt" }, { from: "llm", to: "out" }],
      steps: [
        { nodes: ["user", "llm"], edges: ["user>llm"], text: "The user's query is wrapped in a prompt and sent to the model once." },
        { nodes: ["out"], edges: ["llm>out"], text: "The model's answer is returned directly. Nothing checks it, so it can be outdated or invented." }
      ]
    },
    sequential: {
      title: "Sequential workflow (prompt chaining)", width: 980, height: 250,
      nodes: [
        { id: "in", label: "Input", x: 60, y: 100, w: 90, kind: "user" },
        { id: "s1", label: "Step 1", sub: "extract ideas", x: 210, y: 100, kind: "llm" },
        { id: "s2", label: "Step 2", sub: "outline", x: 385, y: 100, kind: "llm" },
        { id: "gate", label: "Gate", sub: "check passes?", x: 560, y: 100, kind: "human" },
        { id: "s3", label: "Step 3", sub: "write", x: 735, y: 100, kind: "llm" },
        { id: "out", label: "Output", x: 905, y: 100, w: 100, kind: "data" },
        { id: "exit", label: "Stop early", sub: "ask for more input", x: 560, y: 205, w: 170, kind: "data" }
      ],
      edges: [
        { from: "in", to: "s1" }, { from: "s1", to: "s2" }, { from: "s2", to: "gate" },
        { from: "gate", to: "s3", label: "pass" }, { from: "s3", to: "out" },
        { from: "gate", to: "exit", label: "fail", dashed: true }
      ],
      steps: [
        { nodes: ["in", "s1"], edges: ["in>s1"], text: "Step 1 receives the raw input and extracts the key ideas." },
        { nodes: ["s2"], edges: ["s1>s2"], text: "Step 2 receives only Step 1's output and turns it into an outline." },
        { nodes: ["gate"], edges: ["s2>gate"], text: "A programmatic gate checks the intermediate result (here: at least three points)." },
        { nodes: ["exit"], edges: ["gate>exit"], text: "If the check fails, the chain stops early instead of producing a weak result." },
        { nodes: ["s3", "out"], edges: ["gate>s3", "s3>out"], text: "If it passes, Step 3 writes the final text." }
      ]
    },
    routing: {
      title: "Router pattern", width: 860, height: 330,
      nodes: [
        { id: "user", label: "User", sub: "query", x: 70, y: 165, w: 110, kind: "user" },
        { id: "router", label: "Router LLM", sub: "classify intent", x: 260, y: 165, kind: "llm" },
        { id: "r1", label: "Image model", sub: "e.g. DALL-E 3 / VLM", x: 500, y: 55, w: 180, kind: "tool" },
        { id: "r2", label: "LLM route 1", sub: "coding prompt", x: 500, y: 165, w: 180, kind: "llm" },
        { id: "r3", label: "LLM route 2", sub: "general prompt", x: 500, y: 275, w: 180, kind: "llm" },
        { id: "out", label: "Response", x: 765, y: 165, w: 120, kind: "data" }
      ],
      edges: [
        { from: "user", to: "router" },
        { from: "router", to: "r1", label: "image" }, { from: "router", to: "r2", label: "code" }, { from: "router", to: "r3", label: "general" },
        { from: "r1", to: "out" }, { from: "r2", to: "out" }, { from: "r3", to: "out" }
      ],
      steps: [
        { nodes: ["user", "router"], edges: ["user>router"], text: "A router reads the request and returns one label from a fixed list." },
        { nodes: ["r1"], edges: ["router>r1"], text: "\"Generate an image of a camel crossing a desert highway\" goes to an image model." },
        { nodes: ["r2"], edges: ["router>r2"], text: "A coding question goes to a prompt (or model) specialized for code." },
        { nodes: ["r3"], edges: ["router>r3"], text: "Everything else goes to a general, often cheaper, route." },
        { nodes: ["out"], edges: ["r1>out", "r2>out", "r3>out"], text: "Only one route runs per request, and its result becomes the response." }
      ]
    },
    parallel: {
      title: "Parallel execution", width: 860, height: 330,
      nodes: [
        { id: "in", label: "Input", x: 70, y: 165, w: 100, kind: "user" },
        { id: "split", label: "Split", sub: "fan-out", x: 230, y: 165, w: 120 },
        { id: "w1", label: "Worker A", sub: "clarity review", x: 450, y: 55, w: 170, kind: "llm" },
        { id: "w2", label: "Worker B", sub: "accuracy review", x: 450, y: 165, w: 170, kind: "llm" },
        { id: "w3", label: "Worker C", sub: "safety review", x: 450, y: 275, w: 170, kind: "llm" },
        { id: "agg", label: "Aggregate", sub: "merge or vote", x: 660, y: 165, w: 140 },
        { id: "out", label: "Output", x: 805, y: 165, w: 90, kind: "data" }
      ],
      edges: [
        { from: "in", to: "split" },
        { from: "split", to: "w1" }, { from: "split", to: "w2" }, { from: "split", to: "w3" },
        { from: "w1", to: "agg" }, { from: "w2", to: "agg" }, { from: "w3", to: "agg" },
        { from: "agg", to: "out" }
      ],
      steps: [
        { nodes: ["in", "split"], edges: ["in>split"], text: "The task is split into independent parts (sectioning) or copied for several attempts (voting)." },
        { nodes: ["w1", "w2", "w3"], edges: ["split>w1", "split>w2", "split>w3"], text: "Workers run at the same time, so total time is close to the slowest worker, not the sum." },
        { nodes: ["agg"], edges: ["w1>agg", "w2>agg", "w3>agg"], text: "An aggregator merges the sections or takes a majority vote." },
        { nodes: ["out"], edges: ["agg>out"], text: "One combined result is returned." }
      ]
    },
    tools: {
      title: "Tool calling", width: 900, height: 340,
      nodes: [
        { id: "user", label: "User", sub: "task", x: 70, y: 110, w: 110, kind: "user" },
        { id: "llm", label: "LLM", sub: "decides tool calls", x: 280, y: 110, w: 170, kind: "llm" },
        { id: "tools", label: "Tools", sub: "APIs, browser, vector DB, files, solver", x: 610, y: 110, w: 300, kind: "tool" },
        { id: "human", label: "Human confirmation", sub: "for actions with side effects", x: 610, y: 250, w: 260, kind: "human" },
        { id: "out", label: "Response", x: 280, y: 250, w: 140, kind: "data" }
      ],
      edges: [
        { from: "user", to: "llm" },
        { from: "llm", to: "tools", label: "tool call (JSON)", curve: -26 },
        { from: "tools", to: "llm", label: "result", curve: -26, dashed: true },
        { from: "llm", to: "human", label: "send emails?", curve: 0 },
        { from: "human", to: "out", label: "approved" }
      ],
      steps: [
        { nodes: ["user", "llm"], edges: ["user>llm"], text: "\"Filter my emails by importance and send an out-of-office reply to the top 5.\"" },
        { nodes: ["tools"], edges: ["llm>tools"], text: "The model requests read_emails, then rank_by_importance, as structured tool calls." },
        { nodes: ["llm"], edges: ["tools>llm"], text: "Each result is returned to the model, which decides the next call." },
        { nodes: ["human"], edges: ["llm>human"], text: "Sending emails has side effects, so the agent asks the user to confirm first." },
        { nodes: ["out"], edges: ["human>out"], text: "After approval the emails are sent and the agent reports what it did." }
      ]
    },
    reflection: {
      title: "Reflection / evaluator-optimizer loop", width: 900, height: 300,
      nodes: [
        { id: "user", label: "Query", x: 70, y: 110, w: 100, kind: "user" },
        { id: "gen", label: "LLM (generate)", sub: "write a draft", x: 270, y: 110, w: 180, kind: "llm" },
        { id: "draft", label: "Initial output", x: 480, y: 110, w: 150, kind: "data" },
        { id: "eval", label: "LLM (reflect)", sub: "critique or test", x: 690, y: 110, w: 170, kind: "llm" },
        { id: "out", label: "Reflected output", sub: "after it passes", x: 690, y: 240, w: 190, kind: "data" }
      ],
      edges: [
        { from: "user", to: "gen" }, { from: "gen", to: "draft" }, { from: "draft", to: "eval" },
        { from: "eval", to: "gen", label: "feedback: iterate", dashed: true, via: [[690, 30], [270, 30]] },
        { from: "eval", to: "out", label: "pass" }
      ],
      steps: [
        { nodes: ["user", "gen"], edges: ["user>gen"], text: "The generator writes a first attempt." },
        { nodes: ["draft", "eval"], edges: ["gen>draft", "draft>eval"], text: "The evaluator checks it against criteria: a rubric, tests, or another model's critique." },
        { nodes: ["gen"], edges: ["eval>gen"], text: "Specific feedback goes back to the generator, which revises the draft." },
        { nodes: ["out"], edges: ["eval>out"], text: "The loop stops when the checks pass or a round limit is reached." }
      ]
    },
    plan: {
      title: "Plan-and-execute", width: 900, height: 320,
      nodes: [
        { id: "goal", label: "Goal", x: 65, y: 120, w: 90, kind: "user" },
        { id: "planner", label: "Planner", sub: "writes all steps", x: 230, y: 120, w: 150, kind: "llm" },
        { id: "plan", label: "Plan", sub: "1. search 2. summarize 3. share", x: 450, y: 120, w: 230, kind: "data" },
        { id: "exec", label: "Executor", sub: "one step at a time", x: 680, y: 120, w: 170 },
        { id: "tools", label: "Tools", x: 820, y: 230, w: 100, kind: "tool" },
        { id: "replan", label: "Replanner", sub: "on failure", x: 450, y: 260, w: 150, kind: "llm" },
        { id: "out", label: "Result", x: 835, y: 45, w: 100, kind: "data" }
      ],
      edges: [
        { from: "goal", to: "planner" }, { from: "planner", to: "plan" }, { from: "plan", to: "exec" },
        { from: "exec", to: "tools", label: "call" },
        { from: "exec", to: "replan", label: "step failed", dashed: true },
        { from: "replan", to: "plan", label: "revised steps", dashed: true },
        { from: "exec", to: "out", label: "done" }
      ],
      steps: [
        { nodes: ["goal", "planner"], edges: ["goal>planner"], text: "The planner reads the goal and writes the full plan as structured steps." },
        { nodes: ["plan", "exec"], edges: ["planner>plan", "plan>exec"], text: "The executor takes one step at a time." },
        { nodes: ["tools"], edges: ["exec>tools"], text: "Each step calls a tool and stores its result." },
        { nodes: ["replan"], edges: ["exec>replan", "replan>plan"], text: "If a step fails (the mail server is down), the replanner revises only the remaining steps." },
        { nodes: ["out"], edges: ["exec>out"], text: "When all steps succeed, the result is returned." }
      ]
    },
    multi: {
      title: "Multi-agent collaboration", width: 900, height: 340,
      nodes: [
        { id: "user", label: "User", x: 70, y: 170, w: 100, kind: "user" },
        { id: "mgr", label: "Manager agent", sub: "splits and merges", x: 270, y: 170, w: 180, kind: "llm" },
        { id: "a1", label: "Researcher", sub: "sub-agent", x: 540, y: 60, w: 160, kind: "llm" },
        { id: "a2", label: "Analyst", sub: "sub-agent", x: 540, y: 170, w: 160, kind: "llm" },
        { id: "a3", label: "Critic", sub: "sub-agent", x: 540, y: 280, w: 160, kind: "llm" },
        { id: "out", label: "Response", x: 800, y: 170, w: 130, kind: "data" }
      ],
      edges: [
        { from: "user", to: "mgr" },
        { from: "mgr", to: "a1", label: "augmentative" }, { from: "mgr", to: "a2" },
        { from: "a1", to: "a2", dashed: true }, { from: "a2", to: "a3", label: "debate", dashed: true },
        { from: "a3", to: "mgr", label: "critique", dashed: true },
        { from: "mgr", to: "out", label: "integrated answer", via: [[270, 315], [800, 315]] }
      ],
      steps: [
        { nodes: ["user", "mgr"], edges: ["user>mgr"], text: "The manager agent receives the task and decides who does what." },
        { nodes: ["a1", "a2"], edges: ["mgr>a1", "mgr>a2"], text: "Augmentative cooperation: each specialist contributes a different piece." },
        { nodes: ["a2", "a3"], edges: ["a1>a2", "a2>a3"], text: "Debative cooperation: a critic challenges the draft and the agents revise it." },
        { nodes: ["mgr"], edges: ["a3>mgr"], text: "Integrative cooperation: the manager merges the pieces into one consistent answer." },
        { nodes: ["out"], edges: ["mgr>out"], text: "The combined response goes back to the user." }
      ]
    }
  };

  const rendered = new Set();
  function renderPattern(key) {
    if (rendered.has(key) || !D[key]) return;
    const fig = document.querySelector(`.pattern-diagram[data-pattern="${key}"]`);
    if (!fig) return;
    window.FlowDiagram.create(fig, Object.assign({ legend: true, minWidth: 600 }, D[key]));
    rendered.add(key);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.FlowDiagram) return;
    const list = document.getElementById("pattern-tabs");
    if (!list) return;
    const keyOf = tab => tab.getAttribute("aria-controls").replace("panel-", "");
    list.addEventListener("tabchange", e => {
      const key = keyOf(e.detail);
      renderPattern(key);
      try { history.replaceState(null, "", "#" + key); } catch (err) { /* ignore */ }
    });
    // Deep link: patterns.html#routing opens that tab.
    const want = location.hash.slice(1);
    const tab = want && list.querySelector(`[aria-controls="panel-${want}"]`);
    if (tab) { tab.click(); setTimeout(() => document.getElementById("catalog").scrollIntoView(), 150); }
    const current = list.querySelector('[aria-selected="true"]');
    if (current) renderPattern(keyOf(current));
  });
})();
