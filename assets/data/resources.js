/* Curated resources. Each entry:
   title, url, desc, type (one of RESOURCE_TYPES), topic (one of RESOURCE_TOPICS),
   level: beginner | intermediate | advanced
   Links were checked when the course was built (see VERIFICATION.md).
   Colab notebooks are listed automatically from the course modules. */
window.RESOURCE_TYPES = [
  "Official documentation", "Tutorials", "Open-source frameworks", "Research papers", "Courses", "Books",
  "Datasets", "Evaluation benchmarks", "No-code platforms", "Developer tools", "Governance frameworks", "Google Colab notebooks"
];
window.RESOURCE_TOPICS = ["Foundations", "Agents and patterns", "Tools and protocols", "Retrieval and memory", "Evaluation", "Governance and safety", "Robotics and physical AI"];

window.RESOURCES = [
  // Official documentation
  { title: "Model Context Protocol documentation", url: "https://modelcontextprotocol.io/", type: "Official documentation", topic: "Tools and protocols", level: "beginner", desc: "Concepts, tutorials, and SDK guides for MCP." },
  { title: "Model Hardware Standard (research preview)", url: "https://www.anthropic.com/news/model-hardware-standard-research-preview", type: "Official documentation", topic: "Robotics and physical AI", level: "intermediate", desc: "Anthropic's specification for AI agents to safely operate physical devices, with partner case studies from research labs." },
  { title: "Introducing dots (OpenAI)", url: "https://openai.com/index/introducing-dots/", type: "Official documentation", topic: "Agents and patterns", level: "beginner", desc: "OpenAI's always-on agents in ChatGPT, with permission rules and an activity view." },
  { title: "Grok Bot (xAI)", url: "https://x.ai/bot", type: "Official documentation", topic: "Agents and patterns", level: "beginner", desc: "AI teammates with their own cloud computer, scheduled routines, and approvals." },
  { title: "Instinct", url: "https://instinct.com/", type: "Official documentation", topic: "Agents and patterns", level: "beginner", desc: "A personal assistant you text or call, which uses a phone and computer for you." },
  { title: "Muse (Meta)", url: "https://ai.meta.com/muse/", type: "Official documentation", topic: "Agents and patterns", level: "beginner", desc: "Meta's personal AI agent with a secure VM, approvals, and an audit trail." },
  { title: "OpenRouter quickstart", url: "https://openrouter.ai/docs/quickstart", type: "Official documentation", topic: "Tools and protocols", level: "beginner", desc: "Make your first request through OpenRouter's OpenAI-compatible API." },
  { title: "Commonstack quickstart", url: "https://docs.commonstack.ai/overview/quickstart", type: "Official documentation", topic: "Tools and protocols", level: "beginner", desc: "OpenAI- and Anthropic-compatible endpoints for many models." },
  { title: "MCP specification", url: "https://modelcontextprotocol.io/specification", type: "Official documentation", topic: "Tools and protocols", level: "advanced", desc: "The authoritative protocol definition." },
  { title: "OpenAI Agents SDK (Python)", url: "https://openai.github.io/openai-agents-python/", type: "Official documentation", topic: "Agents and patterns", level: "intermediate", desc: "Agents, handoffs, guardrails, and tracing in a lightweight SDK." },
  { title: "Claude documentation: tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", type: "Official documentation", topic: "Tools and protocols", level: "intermediate", desc: "How to define tools and handle tool calls with Claude models." },
  { title: "Hugging Face Transformers", url: "https://huggingface.co/docs/transformers", type: "Official documentation", topic: "Foundations", level: "intermediate", desc: "Load and run thousands of open models, including pipelines used in Module 1." },
  { title: "OpenAPI Specification", url: "https://spec.openapis.org/oas/latest.html", type: "Official documentation", topic: "Tools and protocols", level: "intermediate", desc: "The latest published version of the OpenAPI Specification." },
  { title: "Google OR-Tools", url: "https://developers.google.com/optimization", type: "Official documentation", topic: "Tools and protocols", level: "intermediate", desc: "Guides for assignment, scheduling, and routing with open-source solvers." },
  { title: "n8n documentation", url: "https://docs.n8n.io/", type: "Official documentation", topic: "Agents and patterns", level: "beginner", desc: "Workflow basics, AI nodes, and self-hosting." },

  // Tutorials
  { title: "Building effective agents (Anthropic)", url: "https://www.anthropic.com/engineering/building-effective-agents", type: "Tutorials", topic: "Agents and patterns", level: "beginner", desc: "Workflows versus agents and the core patterns: chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer." },
  { title: "Prompt engineering guide (Anthropic)", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "Tutorials", topic: "Foundations", level: "beginner", desc: "Practical techniques for clear, reliable prompts." },
  { title: "MCP quickstart: build a server", url: "https://modelcontextprotocol.io/quickstart/server", type: "Tutorials", topic: "Tools and protocols", level: "intermediate", desc: "Step-by-step guide to writing your first MCP server." },
  { title: "arXiv API user manual", url: "https://info.arxiv.org/help/api/index.html", type: "Tutorials", topic: "Tools and protocols", level: "beginner", desc: "Query arXiv programmatically, as in the research-digest workflow." },

  // Open-source frameworks
  { title: "LangGraph", url: "https://github.com/langchain-ai/langgraph", type: "Open-source frameworks", topic: "Agents and patterns", level: "intermediate", desc: "Build stateful, controllable agent workflows as graphs." },
  { title: "CrewAI", url: "https://github.com/crewAIInc/crewAI", type: "Open-source frameworks", topic: "Agents and patterns", level: "beginner", desc: "Role-based multi-agent collaboration." },
  { title: "AutoGen", url: "https://github.com/microsoft/autogen", type: "Open-source frameworks", topic: "Agents and patterns", level: "intermediate", desc: "Microsoft's framework for multi-agent applications." },
  { title: "smolagents", url: "https://github.com/huggingface/smolagents", type: "Open-source frameworks", topic: "Agents and patterns", level: "beginner", desc: "A small Hugging Face library for agents that write and run code." },
  { title: "LlamaIndex", url: "https://github.com/run-llama/llama_index", type: "Open-source frameworks", topic: "Retrieval and memory", level: "intermediate", desc: "Data framework for RAG and document agents." },
  { title: "Pydantic AI", url: "https://github.com/pydantic/pydantic-ai", type: "Open-source frameworks", topic: "Agents and patterns", level: "intermediate", desc: "Type-safe agents with structured outputs." },
  { title: "Agent Development Kit (Google)", url: "https://github.com/google/adk-python", type: "Open-source frameworks", topic: "Agents and patterns", level: "intermediate", desc: "Google's open-source toolkit for building and deploying agents." },
  { title: "Claude Agent SDK (Python)", url: "https://github.com/anthropics/claude-agent-sdk-python", type: "Open-source frameworks", topic: "Agents and patterns", level: "intermediate", desc: "The agent harness behind Claude Code, used in Module 9." },
  { title: "OpenAI Agents SDK (GitHub)", url: "https://github.com/openai/openai-agents-python", type: "Open-source frameworks", topic: "Agents and patterns", level: "beginner", desc: "Source code and examples for the OpenAI Agents SDK." },
  { title: "LangChain", url: "https://github.com/langchain-ai/langchain", type: "Open-source frameworks", topic: "Agents and patterns", level: "beginner", desc: "Agents and integrations with hundreds of models and tools." },
  { title: "Magentic-One", url: "https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html", type: "Open-source frameworks", topic: "Agents and patterns", level: "advanced", desc: "Microsoft's generalist multi-agent team built on AutoGen." },
  { title: "MCP Python SDK", url: "https://github.com/modelcontextprotocol/python-sdk", type: "Open-source frameworks", topic: "Tools and protocols", level: "intermediate", desc: "Official SDK used in Module 5." },

  // Research papers
  { title: "Generative Adversarial Networks (Goodfellow et al., 2014)", url: "https://arxiv.org/abs/1406.2661", type: "Research papers", topic: "Foundations", level: "advanced", desc: "The paper that introduced GANs." },
  { title: "Attention Is All You Need (Vaswani et al., 2017)", url: "https://arxiv.org/abs/1706.03762", type: "Research papers", topic: "Foundations", level: "advanced", desc: "The Transformer architecture." },
  { title: "Language Models are Few-Shot Learners (Brown et al., 2020)", url: "https://arxiv.org/abs/2005.14165", type: "Research papers", topic: "Foundations", level: "advanced", desc: "GPT-3 and in-context learning." },
  { title: "Training language models to follow instructions with human feedback (2022)", url: "https://arxiv.org/abs/2203.02155", type: "Research papers", topic: "Foundations", level: "advanced", desc: "InstructGPT, the method behind chat assistants." },
  { title: "Chain-of-Thought Prompting Elicits Reasoning (Wei et al., 2022)", url: "https://arxiv.org/abs/2201.11903", type: "Research papers", topic: "Agents and patterns", level: "intermediate", desc: "Step-by-step reasoning in prompts." },
  { title: "ReAct: Synergizing Reasoning and Acting (Yao et al., 2022)", url: "https://arxiv.org/abs/2210.03629", type: "Research papers", topic: "Agents and patterns", level: "intermediate", desc: "Interleaving thoughts, actions, and observations." },
  { title: "Toolformer (Schick et al., 2023)", url: "https://arxiv.org/abs/2302.04761", type: "Research papers", topic: "Tools and protocols", level: "advanced", desc: "Language models that learn to use tools." },
  { title: "Reflexion (Shinn et al., 2023)", url: "https://arxiv.org/abs/2303.11366", type: "Research papers", topic: "Agents and patterns", level: "advanced", desc: "Agents that improve through verbal self-reflection." },
  { title: "Self-Refine (Madaan et al., 2023)", url: "https://arxiv.org/abs/2303.17651", type: "Research papers", topic: "Agents and patterns", level: "intermediate", desc: "Iterative refinement with self-feedback." },
  { title: "Generative Agents (Park et al., 2023)", url: "https://arxiv.org/abs/2304.03442", type: "Research papers", topic: "Retrieval and memory", level: "intermediate", desc: "Agents with memory, reflection, and planning in a simulated town." },
  { title: "Retrieval-Augmented Generation (Lewis et al., 2020)", url: "https://arxiv.org/abs/2005.11401", type: "Research papers", topic: "Retrieval and memory", level: "advanced", desc: "The original RAG paper." },
  { title: "Visual Instruction Tuning, LLaVA (Liu et al., 2023)", url: "https://arxiv.org/abs/2304.08485", type: "Research papers", topic: "Foundations", level: "advanced", desc: "An open multimodal assistant." },
  { title: "RT-2: Vision-Language-Action Models (2023)", url: "https://arxiv.org/abs/2307.15818", type: "Research papers", topic: "Robotics and physical AI", level: "advanced", desc: "Transferring web knowledge to robot control." },
  { title: "OpenVLA (Kim et al., 2024)", url: "https://arxiv.org/abs/2406.09246", type: "Research papers", topic: "Robotics and physical AI", level: "advanced", desc: "An open-source Vision-Language-Action model." },
  { title: "Sensor-Language-Action Models (Xu, Shuai, Yang, 2026)", url: "https://arxiv.org/abs/2610.08244", type: "Research papers", topic: "Robotics and physical AI", level: "advanced", desc: "OpenSLA: one model that links sensor streams, language, and actions, evaluated in clinical care, surgery, and metabolic health." },
  { title: "A Survey on LLM-based Autonomous Agents (Wang et al., 2023)", url: "https://arxiv.org/abs/2308.11432", type: "Research papers", topic: "Agents and patterns", level: "intermediate", desc: "A broad survey of agent construction and applications." },
  { title: "Constitutional AI (Bai et al., 2022)", url: "https://arxiv.org/abs/2212.08073", type: "Research papers", topic: "Governance and safety", level: "advanced", desc: "Training harmless assistants from a set of principles." },
  { title: "False Frontiers: Diagnosing and Mitigating Co-Cheating in Self-Evolving Search Agents (Chen et al., ICLR 2027 submission)", url: "https://arxiv.org/abs/2609.39102", type: "Research papers", topic: "Evaluation", level: "advanced", desc: "Meijia Chen, Hao Li, Zheng Lu, Hongshan Lin, Junbai Tian, Yichen Liu, Zijun Tian, Yufan Zou, Shuhan Sun, Hanxin Chen, Zeyu Zhang, Weizhi Du, Yueting Li, Tianyu Shi, Alaa Khamis. ICLR 2027 Conference Submission. Shows how self-evolving search agents can agree on wrong answers (co-cheating) and how to detect and reduce it." },
  { title: "Agentic AI Systems: Architecture and Evaluation using a Frictionless Parking Scenario (Khamis, 2025)", url: "https://doi.org/10.1109/ACCESS.2025.3590264", type: "Research papers", topic: "Agents and patterns", level: "intermediate", desc: "Alaa Khamis. IEEE Access, 2025. Agent design, handoff and cueing between agents, and cooperation patterns, illustrated and evaluated with a frictionless parking scenario." },

  // Courses
  { title: "Hugging Face AI Agents Course", url: "https://huggingface.co/learn/agents-course", type: "Courses", topic: "Agents and patterns", level: "beginner", desc: "Free course from agent basics to frameworks." },
  { title: "Hugging Face LLM Course", url: "https://huggingface.co/learn/llm-course", type: "Courses", topic: "Foundations", level: "beginner", desc: "Free course on Transformers and LLMs." },
  { title: "DeepLearning.AI short courses", url: "https://www.deeplearning.ai/short-courses/", type: "Courses", topic: "Agents and patterns", level: "beginner", desc: "Short, hands-on courses on agents, RAG, MCP, and more." },
  { title: "Anthropic courses", url: "https://github.com/anthropics/courses", type: "Courses", topic: "Foundations", level: "beginner", desc: "Notebooks on prompt engineering and tool use." },
  { title: "Stanford CS224N: NLP with Deep Learning", url: "https://web.stanford.edu/class/cs224n/", type: "Courses", topic: "Foundations", level: "advanced", desc: "University course on language models and Transformers." },
  { title: "MIT 6.S191: Introduction to Deep Learning", url: "http://introtodeeplearning.com/", type: "Courses", topic: "Foundations", level: "beginner", desc: "Open lectures and labs on deep learning." },

  // Books
  { title: "Dive into Deep Learning", url: "https://d2l.ai/", type: "Books", topic: "Foundations", level: "intermediate", desc: "Free interactive book with runnable code." },
  { title: "Deep Learning (Goodfellow, Bengio, Courville)", url: "https://www.deeplearningbook.org/", type: "Books", topic: "Foundations", level: "advanced", desc: "Free online edition of the classic textbook." },
  { title: "Speech and Language Processing (Jurafsky and Martin)", url: "https://web.stanford.edu/~jurafsky/slp3/", type: "Books", topic: "Foundations", level: "intermediate", desc: "Free draft chapters, including Transformers and LLMs." },
  { title: "Artificial Intelligence: A Modern Approach", url: "https://aima.cs.berkeley.edu/", type: "Books", topic: "Agents and patterns", level: "intermediate", desc: "The classic AI textbook, built around the idea of intelligent agents." },

  // Datasets
  { title: "GSM8K", url: "https://huggingface.co/datasets/openai/gsm8k", type: "Datasets", topic: "Evaluation", level: "beginner", desc: "Grade-school math word problems for testing reasoning." },
  { title: "HotpotQA", url: "https://hotpotqa.github.io/", type: "Datasets", topic: "Retrieval and memory", level: "intermediate", desc: "Multi-hop questions that need several documents." },
  { title: "MMLU", url: "https://huggingface.co/datasets/cais/mmlu", type: "Datasets", topic: "Evaluation", level: "beginner", desc: "Multiple-choice questions across 57 subjects." },
  { title: "Open X-Embodiment", url: "https://robotics-transformer-x.github.io/", type: "Datasets", topic: "Robotics and physical AI", level: "advanced", desc: "Large collection of robot learning data across many robots." },

  // Evaluation benchmarks
  { title: "SWE-bench", url: "https://www.swebench.com/", type: "Evaluation benchmarks", topic: "Evaluation", level: "intermediate", desc: "Real GitHub issues that coding agents must resolve." },
  { title: "GAIA", url: "https://huggingface.co/gaia-benchmark", type: "Evaluation benchmarks", topic: "Evaluation", level: "intermediate", desc: "Questions for general AI assistants that require tools and reasoning." },
  { title: "WebArena", url: "https://webarena.dev/", type: "Evaluation benchmarks", topic: "Evaluation", level: "advanced", desc: "Realistic websites for testing web agents." },
  { title: "AgentBench", url: "https://github.com/THUDM/AgentBench", type: "Evaluation benchmarks", topic: "Evaluation", level: "advanced", desc: "LLMs as agents across several environments." },
  { title: "tau-bench", url: "https://github.com/sierra-research/tau-bench", type: "Evaluation benchmarks", topic: "Evaluation", level: "intermediate", desc: "Tool-using agents in customer-service style conversations." },
  { title: "OSWorld", url: "https://os-world.github.io/", type: "Evaluation benchmarks", topic: "Evaluation", level: "advanced", desc: "Computer-use agents in real operating systems." },
  { title: "Berkeley Function Calling Leaderboard", url: "https://gorilla.cs.berkeley.edu/leaderboard.html", type: "Evaluation benchmarks", topic: "Tools and protocols", level: "intermediate", desc: "How accurately models call functions." },

  // No-code platforms
  { title: "n8n", url: "https://n8n.io/", type: "No-code platforms", topic: "Agents and patterns", level: "beginner", desc: "Workflow automation with AI Agent nodes; cloud or self-hosted." },
  { title: "Langflow", url: "https://www.langflow.org/", type: "No-code platforms", topic: "Retrieval and memory", level: "beginner", desc: "Open-source visual builder for agents and RAG." },
  { title: "Flowise", url: "https://flowiseai.com/", type: "No-code platforms", topic: "Agents and patterns", level: "beginner", desc: "Open-source drag-and-drop LLM apps." },
  { title: "Dify", url: "https://dify.ai/", type: "No-code platforms", topic: "Agents and patterns", level: "beginner", desc: "Open-source LLM app platform with workflows." },
  { title: "Make", url: "https://www.make.com/", type: "No-code platforms", topic: "Agents and patterns", level: "beginner", desc: "Visual automation scenarios across many apps." },
  { title: "Zapier", url: "https://zapier.com/", type: "No-code platforms", topic: "Agents and patterns", level: "beginner", desc: "App automation with AI features." },

  // Developer tools
  { title: "Google Colab", url: "https://colab.research.google.com/", type: "Developer tools", topic: "Foundations", level: "beginner", desc: "Free hosted notebooks used throughout this course." },
  { title: "OpenRouter", url: "https://openrouter.ai/", type: "Developer tools", topic: "Foundations", level: "beginner", desc: "One API for many open and commercial language models, so you can switch models without changing code." },
  { title: "Commonstack", url: "https://commonstack.ai/", type: "Developer tools", topic: "Foundations", level: "beginner", desc: "A single gateway to closed and open-source LLMs, with integration and usage management to help reduce inference costs." },
  { title: "Ollama", url: "https://ollama.com/", type: "Developer tools", topic: "Foundations", level: "beginner", desc: "Run open models on your own computer." },
  { title: "MCP Inspector", url: "https://github.com/modelcontextprotocol/inspector", type: "Developer tools", topic: "Tools and protocols", level: "intermediate", desc: "Test and debug MCP servers in a browser." },
  { title: "Langfuse", url: "https://langfuse.com/", type: "Developer tools", topic: "Evaluation", level: "intermediate", desc: "Open-source tracing, evaluation, and monitoring for LLM apps." },
  { title: "promptfoo", url: "https://www.promptfoo.dev/", type: "Developer tools", topic: "Evaluation", level: "intermediate", desc: "Open-source testing and red teaming for prompts and agents." },
  { title: "Chroma", url: "https://www.trychroma.com/", type: "Developer tools", topic: "Retrieval and memory", level: "beginner", desc: "Open-source embedding database." },
  { title: "FAISS", url: "https://github.com/facebookresearch/faiss", type: "Developer tools", topic: "Retrieval and memory", level: "advanced", desc: "Library for efficient similarity search." },

  // Governance frameworks
  { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework", type: "Governance frameworks", topic: "Governance and safety", level: "beginner", desc: "Govern, Map, Measure, Manage." },
  { title: "EU AI Act explorer", url: "https://artificialintelligenceact.eu/", type: "Governance frameworks", topic: "Governance and safety", level: "intermediate", desc: "Browse the European AI regulation by article." },
  { title: "ISO/IEC 42001", url: "https://www.iso.org/standard/81230.html", type: "Governance frameworks", topic: "Governance and safety", level: "advanced", desc: "AI management system standard." },
  { title: "OECD AI Principles", url: "https://oecd.ai/en/ai-principles", type: "Governance frameworks", topic: "Governance and safety", level: "beginner", desc: "Principles for trustworthy AI." },
  { title: "OWASP GenAI Security Project", url: "https://genai.owasp.org/", type: "Governance frameworks", topic: "Governance and safety", level: "intermediate", desc: "Top 10 risks for LLM applications and agent security guidance." },
  { title: "International AI Safety Report", url: "https://internationalaisafetyreport.org/", type: "Governance frameworks", topic: "Governance and safety", level: "intermediate", desc: "Scientific report on the capabilities and risks of general-purpose AI, chaired by Yoshua Bengio." },
  { title: "SDAIA (Saudi Data and AI Authority)", url: "https://sdaia.gov.sa/", type: "Governance frameworks", topic: "Governance and safety", level: "beginner", desc: "National AI authority publishing AI ethics principles and guidance." }
];
