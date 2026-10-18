/* Evolution of AI: interactive timeline.
   Milestones and years follow the course slide "Evolution.pptx". Years mark
   when each wave became prominent in the slide; first papers can be earlier.
   Edit MILESTONES to change content; the UI is generated from it. */
(function () {
  "use strict";

  const MILESTONES = [
    {
      id: "gans", year: "2014", label: "GANs", full: "Generative Adversarial Networks", icon: "image", agentic: 1,
      explain: "Two neural networks train against each other: a generator creates fake samples and a discriminator tries to tell them from real data. Competing pushes the generator to produce realistic images.",
      capabilities: ["Generate realistic images from random noise", "Translate images between styles or domains", "Create synthetic training data"],
      applications: ["Synthetic data for scarce or private datasets", "Image super-resolution and restoration", "Design and creative tools"],
      examples: ["Original GAN paper (Goodfellow et al., 2014)", "CycleGAN and pix2pix (image-to-image translation)", "StyleGAN (high-quality face synthesis)"],
      contribution: "Showed that neural networks can generate convincing new content, not only classify it. The generator-versus-critic idea reappears in agents as generate-then-evaluate loops, and synthetic data helps train and test agents."
    },
    {
      id: "transformers", year: "2017", label: "Transformers", full: "The Transformer architecture", icon: "layers", agentic: 2,
      explain: "A neural network design built on attention: every word (token) can look at every other token to decide what matters. It trains efficiently in parallel and scales to very large models.",
      capabilities: ["Model long-range context in text", "Train in parallel on huge datasets", "Work for text, images, audio, and actions as token sequences"],
      applications: ["Machine translation", "Search and text understanding", "Foundation for nearly all modern language and vision models"],
      examples: ["\"Attention Is All You Need\" (Vaswani et al., 2017)", "BERT (2018) for language understanding", "Vision Transformer, ViT (2020)"],
      contribution: "The common architecture behind LLMs, multimodal models, and Vision-Language-Action models. Agents inherit their language skills and context handling from it."
    },
    {
      id: "llms", year: "2020", label: "LLMs", full: "Large Language Models", icon: "brain", agentic: 3,
      explain: "Transformers trained on very large text collections to predict the next token. At scale they can follow examples in the prompt (few-shot learning) and perform many tasks without task-specific training.",
      capabilities: ["Generate fluent text and code", "Learn a task from a few examples in the prompt", "Summarize, translate, classify, and answer questions"],
      applications: ["Writing and coding assistants", "Document summarization", "Question answering over knowledge"],
      examples: ["GPT-3 (2020), \"Language Models are Few-Shot Learners\"", "Open-weight families such as Llama, Qwen, and Mistral", "Code models such as Codex"],
      contribution: "Provided a general-purpose reasoning and language engine. In an agent, the LLM is the component that interprets goals, reasons, and decides what to do next."
    },
    {
      id: "chatgpt", year: "2022", label: "ChatGPT", full: "Chat assistants", icon: "message", agentic: 3,
      explain: "LLMs fine-tuned to follow instructions and hold a conversation, using human feedback to make answers more helpful and safer. ChatGPT (November 2022) brought this to the general public.",
      capabilities: ["Follow natural-language instructions", "Multi-turn conversation with context", "Refuse some unsafe requests"],
      applications: ["Tutoring and explanation", "Drafting emails and reports", "Brainstorming and customer support"],
      examples: ["ChatGPT (OpenAI, 2022)", "Claude (Anthropic, 2023)", "Gemini (Google)"],
      contribution: "Instruction following and the chat message format became the interface agents use: system instructions, user turns, and later tool-call messages (function calling)."
    },
    {
      id: "mllms", year: "2023", label: "MLLMs", full: "Multimodal Large Language Models", icon: "eye", agentic: 3,
      explain: "Language models that also accept images, and in some cases audio or video. They can describe a photo, read a chart or a scanned form, or talk in real time.",
      capabilities: ["Understand images, screenshots, charts, and documents", "Combine visual and text reasoning", "Speech input and output in some models"],
      applications: ["Document and form processing", "Accessibility (describing images)", "Visual inspection and troubleshooting"],
      examples: ["GPT-4 with image input (2023) and GPT-4o (2024)", "LLaVA (open visual instruction tuning, 2023)", "Gemini (natively multimodal)"],
      contribution: "Gave agents richer perception. An agent can now look at a screen, a camera feed, or a PDF, which is essential for computer-use and physical agents."
    },
    {
      id: "agents", year: "2024", label: "AI Agents", full: "LLM-based AI agents", icon: "robot", agentic: 4,
      explain: "An LLM placed in a loop with tools, memory, and instructions. It decides on an action, calls a tool (search, code, an API), observes the result, and continues until the task is done.",
      capabilities: ["Call tools and APIs through structured outputs", "Use memory across steps", "Operate software, including browsers and desktops in some systems"],
      applications: ["Coding agents that edit and test code", "Research assistants that search and cite", "Customer-service agents with system access"],
      examples: ["ReAct prompting (reason + act, 2022 paper)", "Computer use in Claude 3.5 Sonnet (2024)", "Model Context Protocol, announced November 2024"],
      contribution: "This is where models start to act. Tools, memory, and the perceive-reason-act loop turn a chatbot into an agent."
    },
    {
      id: "agentic", year: "2025", label: "Agentic AI", full: "Agentic AI systems", icon: "users", agentic: 5,
      explain: "Systems where one or more agents pursue goals with more autonomy: planning multi-step work, coordinating with other agents, running for long periods, and checking their own results, under human oversight.",
      capabilities: ["Long-running, multi-step task execution", "Multi-agent orchestration", "Reasoning models that think before answering"],
      applications: ["Deep research reports", "Software engineering tasks end to end", "Business process automation with approvals"],
      examples: ["Reasoning models such as OpenAI o1 (2024)", "Long-running agents such as Claude 4 (2025)", "Multi-agent frameworks (LangGraph, CrewAI, AutoGen)"],
      contribution: "The focus of this course: designing systems of agents, patterns, protocols, and governance so autonomy stays useful, reliable, and safe."
    },
    {
      // Slide label: "VLA, SLA & MHS".
      id: "vla", year: "2026", label: "VLA, SLA & MHS", full: "Action models and hardware standards: VLA, SLA, and MHS", icon: "eye", agentic: 5,
      explain: "Three developments that connect AI models to the physical world. <strong>Vision-Language-Action (VLA)</strong> models turn camera images and an instruction into robot actions. <strong>Sensor-Language-Action (SLA)</strong> models do the same for sensor streams such as ECG, vital signs, or glucose monitors, using language as the shared interface. The <strong>Model Hardware Standard (MHS)</strong> is a shared specification that lets AI agents safely discover and operate physical devices.",
      capabilities: ["VLA: map images and instructions to motor actions", "SLA: decide whether to act, what kind of action, and which one, from a sensor window, and explain the evidence", "MHS: standard device drivers with read and write primitives, generated reference files with safety limits, and control through MCP, a command line, or code"],
      applications: ["Robotic manipulation and lab automation", "Clinical care, the operating room, and insulin decisions from glucose monitors (SLA research)", "Agents running lab instruments such as liquid handlers, plate readers, microscopes, and robot arms (MHS)"],
      examples: ["VLA: RT-2 (Google DeepMind, 2023), OpenVLA (2024), π0 (Physical Intelligence, 2024)", "SLA: <a href=\"https://yang-ai-lab.github.io/OpenSLA/\">OpenSLA</a> (UCLA, 2026)", "MHS: <a href=\"https://www.anthropic.com/news/model-hardware-standard-research-preview\">Model Hardware Standard</a> research preview (Anthropic, August 2026)"],
      contribution: "Extends what agents can perceive and change beyond software: VLA and SLA models link perception directly to action, and MHS gives agents a safe, standard way to operate real hardware. Together they set the stage for Physical AI."
    },
    {
      id: "physical", year: "Next", label: "Physical AI", full: "Physical AI", icon: "globe", agentic: 5,
      explain: "AI that perceives, reasons, and acts in the physical world: robots, autonomous vehicles, drones, and smart infrastructure. It combines agents, VLA models, simulation, and digital twins.",
      capabilities: ["Act safely in real environments", "Learn in simulation, then transfer to the real world", "Coordinate fleets of machines"],
      applications: ["Autonomous driving and smart mobility", "Manufacturing and logistics", "Energy and infrastructure inspection"],
      examples: ["Humanoid and mobile manipulation robots", "Autonomous vehicle fleets", "Digital twins of factories and cities for training and testing"],
      contribution: "Agentic AI with a body. Safety, real-time control, and governance become even more important because actions have physical consequences."
    }
  ];

  // Model releases from the same slide, grouped by the slide's time columns.
  const RELEASES = {
    note: "Release names, highlights, and counts are reproduced from the course slide.",
    counts: [["2022 to 2023", 5], ["2024", 8], ["2025", 13], ["2026 (year to date)", 12]],
    lanes: [
      { name: "OpenAI", items: [
        ["2022 to 2023", "ChatGPT 3.5", "Chat AI goes public"], ["2022 to 2023", "ChatGPT-4", "Exam-level reasoning"],
        ["2024", "o1", "First reasoning model"], ["2024", "ChatGPT-4o", "Multimodal, voice"],
        ["2025", "ChatGPT-5", "Unified, auto-routing"],
        ["2026", "ChatGPT-5.6", "Tiered; cyber, science"], ["2026", "ChatGPT-6 Astra", "Computer use, cyber, science"],
        ["2026", "Dots", "Autonomous background agents"] ] },
      { name: "Anthropic", items: [
        ["2022 to 2023", "Claude 1", "Constitutional AI"], ["2022 to 2023", "Claude 2", "100K-token context"],
        ["2024", "Claude 3", "Vision across tiers"], ["2024", "Claude 3.5", "Computer use"],
        ["2025", "Claude 3.7", "Extended thinking"], ["2025", "Claude 4", "Long-running agents"],
        ["2026", "Fable 5", "First Mythos-class"], ["2026", "Fable 5.1", "Always-on thinking"] ] }
    ]
  };

  function list(items) { return "<ul>" + items.map(i => `<li>${i}</li>`).join("") + "</ul>"; }

  function render() {
    const host = document.getElementById("timeline");
    if (!host) return;
    host.innerHTML = `
      <div class="tl-track" role="tablist" aria-label="AI milestones from 2014 onward">
        ${MILESTONES.map((m, i) => `
          <div class="tl-item" data-i="${i}">
            <button class="tl-btn" role="tab" id="tl-tab-${m.id}" aria-controls="tl-panel" aria-selected="false" tabindex="-1">
              <span class="tl-year">${m.year}</span>
              <span class="tl-dot">${window.icon(m.icon)}</span>
              <span class="tl-label">${m.label}</span>
            </button>
          </div>`).join("")}
      </div>
      <div class="tl-detail card" id="tl-panel" role="tabpanel" tabindex="0" aria-live="polite"></div>`;

    const tabs = Array.from(host.querySelectorAll(".tl-btn"));
    const items = Array.from(host.querySelectorAll(".tl-item"));
    const panel = host.querySelector("#tl-panel");

    function show(i, focus, user = true) {
      const m = MILESTONES[i];
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", String(j === i));
        t.tabIndex = j === i ? 0 : -1;
        items[j].classList.toggle("past", j <= i);
      });
      panel.setAttribute("aria-labelledby", "tl-tab-" + m.id);
      const meter = Array.from({ length: 5 }, (_, k) => `<i class="${k < m.agentic ? "on" : ""}"></i>`).join("");
      panel.innerHTML = `
        <div class="fade-in">
          <div class="tl-detail-head">
            <span class="tag brand">${m.year === "Next" ? "Emerging" : m.year}</span>
            <h3>${m.full}</h3>
            <div class="tl-nav">
              <button type="button" class="ctrl" data-go="${i - 1}" ${i === 0 ? "disabled" : ""} aria-label="Previous milestone">${window.icon("left")}</button>
              <button type="button" class="ctrl" data-go="${i + 1}" ${i === MILESTONES.length - 1 ? "disabled" : ""} aria-label="Next milestone">${window.icon("right")}</button>
            </div>
          </div>
          <p>${m.explain}</p>
          <div class="def-grid">
            <div><h4>Key capabilities</h4>${list(m.capabilities)}</div>
            <div><h4>Typical applications</h4>${list(m.applications)}</div>
            <div><h4>Representative examples</h4>${list(m.examples)}</div>
          </div>
          <div class="tl-contrib">
            <h4>Contribution to Agentic AI</h4>
            <p>${m.contribution}</p>
          </div>
          <div class="agentic-meter mt-1" title="Illustrative rating by the course team">
            <span>How directly it enables agents (illustrative):</span><span class="bar" aria-hidden="true">${meter}</span>
            <span class="visually-hidden">${m.agentic} out of 5</span>
          </div>
        </div>`;
      panel.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => show(+b.dataset.go, true)));
      if (window.markExternal) window.markExternal();
      if (!user) return;                          // initial render: no scrolling or URL change
      if (focus) tabs[i].focus();
      const track = host.querySelector(".tl-track");
      track.scrollTo({ left: tabs[i].parentElement.offsetLeft - track.clientWidth / 2 + tabs[i].parentElement.offsetWidth / 2, behavior: "smooth" });
      try { history.replaceState(null, "", "#" + m.id); } catch (e) { /* file:// */ }
    }

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", e => {
        let j = null;
        if (e.key === "ArrowRight") j = Math.min(i + 1, tabs.length - 1);
        if (e.key === "ArrowLeft") j = Math.max(i - 1, 0);
        if (e.key === "Home") j = 0;
        if (e.key === "End") j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); show(j, true); }
      });
    });

    const fromHash = MILESTONES.findIndex(m => "#" + m.id === location.hash);
    show(fromHash >= 0 ? fromHash : 0, false, false);
    if (fromHash >= 0) setTimeout(() => host.scrollIntoView({ block: "start" }), 150);
  }

  function renderReleases() {
    const host = document.getElementById("releases");
    if (!host) return;
    const max = Math.max(...RELEASES.counts.map(c => c[1]));
    host.innerHTML = `
      <div class="lanes">
        ${RELEASES.lanes.map(l => `
          <div class="lane"><h4>${l.name}</h4><ol>
            ${l.items.map(([yr, name, note]) => `<li><span class="yr">${yr}</span><b>${name}</b><span>${note}</span></li>`).join("")}
          </ol></div>`).join("")}
        <div class="lane">
          <h4>Frontier model releases per period</h4>
          <table class="bars">
            <caption class="visually-hidden">Number of frontier model releases per period, from the course slide</caption>
            <thead class="visually-hidden"><tr><th>Period</th><th>Releases</th></tr></thead>
            <tbody>
            ${RELEASES.counts.map(([p, n]) => `<tr><th scope="row">${p}</th><td><span class="bar-fill" style="width:${(n / max) * 100}%"></span><span class="bar-val">${n}</span></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <p class="small muted mt-1">${RELEASES.note}</p>`;
  }

  document.addEventListener("DOMContentLoaded", () => { render(); renderReleases(); });
})();
