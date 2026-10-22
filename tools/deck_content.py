"""Content for the narrated module overview decks.

Each module has four slides: title, objectives, what's inside, and key
takeaway. Slide text is English. Narration is written in American English
("en") and in Arabic for a Saudi Arabic voice ("ar").
Edit this file, then run:  python tools/make_decks.py
"""

DECKS = [
    {
        "id": "evolution", "num": 1, "title": "Evolution of AI",
        "subtitle": "From GANs and Transformers to agents and Physical AI",
        "objectives": [
            "Trace nine milestones, from GANs to Physical AI",
            "Explain why Transformers and LLMs became the core of modern agents",
            "See, in Python, how a language model generates text",
        ],
        "contents": [
            "An interactive timeline of nine milestones",
            "What each milestone added: capabilities, applications, examples",
            "Frontier model releases from 2022 to 2026",
            "Python labs: a tiny language model and real model inference",
        ],
        "takeaway": "Agents are not a new kind of model. They are systems built around models, adding tools, memory, planning, and feedback.",
        "narration": {
            "en": [
                "Welcome to Module 1 of the Agentic AI Crash Course: the Evolution of AI. We will see how we got from networks that generate pictures to agents that act in the world.",
                "In this module, you will trace nine milestones, from generative adversarial networks to Physical AI. You will see why Transformers and large language models became the core of modern agents, and how a language model generates text, one token at a time.",
                "You will explore an interactive timeline. For each milestone, you will see its capabilities, typical applications, representative examples, and its contribution to agentic AI. Then you will run two Python labs on model inference.",
                "The key takeaway: agents are not a new kind of model. They are systems built around models, adding tools, memory, planning, and feedback.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة الأولى من الدورة المكثفة في الذكاء الاصْطِنَاعِيّ الوَكِيلِيّ: تطور الذكاء الاصْطِنَاعِيّ. سنرى كيف انتقلنا من شبكات تولّد الصور إلى وكلاء يعملون في العالم الحقيقي.",
                "في هذه الوحدة، ستتتبع تسع محطات رئيسية، من الشبكات التَّوْلِيدِيَّة التَّنَافُسِيَّة إلى الذكاء الاصْطِنَاعِيّ المَادِّيّ. وستعرف لماذا أصبحت المُحَوِّلات والنماذج اللغوية الكبيرة أساس الوكلاء الحديثين، وكيف يولّد النموذج اللغوي النص كلمة بعد كلمة.",
                "ستستكشف خطًا زمنيًا تفاعليًا. ولكل محطة، سترى قدراتها وتطبيقاتها المعتادة وأمثلة عليها، ومساهمتها في الذكاء الاصْطِنَاعِيّ الوَكِيلِيّ. ثم ستشغّل تجربتين بلغة بايثون حول استدلال النماذج.",
                "الخلاصة الأساسية: الوكلاء ليسوا نوعًا جديدًا من النماذج، بل هم أنظمة مبنية حول النماذج، تضيف إليها الأدوات والذاكرة والتخطيط والتغذية الراجعة.",
            ],
        },
    },
    {
        "id": "components", "num": 2, "title": "Components of AI Agents",
        "subtitle": "The building blocks of every AI agent",
        "objectives": [
            "Define what an AI agent is",
            "Describe nine components and how they connect",
            "Build each core component in short Python examples",
        ],
        "contents": [
            "An interactive agent architecture",
            "Perception, reasoning, planning, action, and tools",
            "Memory, feedback, safety, and human oversight",
            "Five runnable Python examples, one per component",
        ],
        "takeaway": "The foundation model is only one component. Reliability comes from the parts around it.",
        "narration": {
            "en": [
                "Welcome to Module 2: Components of AI Agents. Here we open up an agent and look at the parts that make it work.",
                "You will learn what an AI agent is, describe nine components and how they connect, and build the core components yourself in short Python examples.",
                "You will select each part of an interactive architecture diagram: perception, reasoning, planning, action, and tools, then memory, feedback and learning, safety and governance, and human oversight. Five Python examples bring them to life.",
                "The key takeaway: the foundation model is only one component. Reliability comes from the parts around it.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة الثانية: مكونات وكلاء الذكاء الاصْطِنَاعِيّ. سنفتح الوكيل هنا ونتعرف على الأجزاء التي تجعله يعمل.",
                "ستتعلم ما هو وكيل الذكاء الاصْطِنَاعِيّ، وستصف تسعة مكونات وكيف ترتبط ببعضها، وستبني المكونات الأساسية بنفسك من خلال أمثلة قصيرة بلغة بايثون.",
                "ستختار كل جزء في مخطط تفاعلي للبنية: الإدراك والاسْتِدْلال والتخطيط والتنفيذ والأدوات، ثم الذاكرة والتغذية الراجعة والتعلم، والسلامة والحَوْكَمَة، والإشراف البشري. وخمسة أمثلة بلغة بايثون تجعلها واضحة وعملية.",
                "الخلاصة الأساسية: النموذج الأساسي ليس إلا مكونًا واحدًا، أما الموثوقية فتأتي من الأجزاء المحيطة به.",
            ],
        },
    },
    {
        "id": "patterns", "num": 3, "title": "Agent Design Patterns",
        "subtitle": "Reusable ways to arrange model calls, tools, and checks",
        "objectives": [
            "Distinguish workflows from agents",
            "Explain eight design patterns and their trade-offs",
            "Choose the simplest pattern that solves a task",
        ],
        "contents": [
            "Basic responder, sequential, routing, and parallel",
            "Tool calling, evaluator-optimizer, and plan-and-execute",
            "Multi-agent collaboration",
            "A playable diagram and a Python example for each pattern",
        ],
        "takeaway": "Start with the simplest pattern that works, and add autonomy only when it clearly helps.",
        "narration": {
            "en": [
                "Welcome to Module 3: Agent Design Patterns. Patterns are reusable ways to arrange model calls, tools, and checks.",
                "You will learn the difference between workflows and agents, explore eight design patterns with their strengths and limitations, and practice choosing the simplest pattern that solves a task.",
                "The patterns range from a basic responder to sequential, routing, and parallel workflows, then tool calling, evaluator-optimizer loops, plan-and-execute, and multi-agent collaboration. Each one has a playable diagram and a Python example.",
                "The key takeaway: start with the simplest pattern that works, and add autonomy only when it clearly helps.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة الثالثة: أنماط تصميم الوكلاء. الأنماط هي طرق قابلة لإعادة الاستخدام لتنظيم استدعاءات النماذج والأدوات وعمليات التحقق.",
                "ستتعلم الفرق بين سير العمل والوكلاء، وستستكشف ثمانية أنماط تصميم مع نقاط قوتها وحدودها، وستتدرب على اختيار أبسط نمط يحل المهمة.",
                "تتدرج الأنماط من المستجيب البسيط إلى سير العمل المتسلسل والتوجيه والتنفيذ المتوازي، ثم استدعاء الأدوات وحلقات التقييم والتحسين، والتخطيط ثم التنفيذ، والتعاون بين عدة وكلاء. ولكل نمط مخطط تفاعلي ومثال بلغة بايثون.",
                "الخلاصة الأساسية: ابدأ بأبسط نمط يؤدي المطلوب، ولا تضف مزيدًا من الاستقلالية إلا عندما تكون فائدتها واضحة.",
            ],
        },
    },
    {
        "id": "alwayson", "num": 4, "title": "Always-on AI Agents",
        "subtitle": "Agents that keep working in the background",
        "objectives": [
            "Explain how always-on agents differ from reactive assistants",
            "Describe triggers, persistence, and control",
            "Compare OpenAI dots, Grok Bot, Instinct, and Meta Muse",
        ],
        "contents": [
            "Triggers: schedules, app events, messages, proactive checks",
            "Persistence: long-term memory and a dedicated cloud computer",
            "Control: permission rules, approvals, and activity logs",
            "A Python simulation of one working day",
        ],
        "takeaway": "The more an agent works without you, the more it needs clear permissions, approvals, and an activity log you can inspect.",
        "narration": {
            "en": [
                "Welcome to Module 4: Always-on AI Agents. These agents do not wait for you to ask. They keep working in the background.",
                "You will learn how always-on agents differ from reactive assistants, how they are triggered, how they persist over time, and how they stay under your control. You will also compare four products: OpenAI dots, Grok Bot, Instinct, and Meta Muse.",
                "You will see how schedules, app events, messages, and proactive checks wake an agent up, how memory and a dedicated cloud computer keep it working, and how permission rules, approvals, and activity logs keep it accountable. A Python simulation runs one working day.",
                "The key takeaway: the more an agent works without you, the more it needs clear permissions, approvals, and an activity log you can inspect.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة الرابعة: وكلاء الذكاء الاصْطِنَاعِيّ الذين يعملون باستمرار. هؤلاء الوكلاء لا ينتظرون طلبك، بل يواصلون العمل في الخلفية.",
                "ستتعرف على الفرق بين الوكلاء الذين يعملون باستمرار والمساعدين الذين يستجيبون للطلبات فقط، وكيف يبدأ عملهم، وكيف يستمرون مع الوقت، وكيف يبقون تحت سيطرتك. وستقارن أيضًا بين أربعة منتجات: دوتس من أوبن إيه آي، وغروك بوت، وإنستنكت، وميوز من ميتا.",
                "سترى كيف توقظ الجداول الزمنية وأحداث التطبيقات والرسائل والفحوص الاستباقية الوكيلَ، وكيف تُبقيه الذاكرة والحاسوب السحابي المخصص في حالة عمل، وكيف تجعله قواعد الصلاحيات والموافقات وسجلات النشاط خاضعًا للمساءلة. ومحاكاة بلغة بايثون تعرض يوم عمل كاملًا.",
                "الخلاصة الأساسية: كلما عمل الوكيل دون وجودك، ازدادت حاجته إلى صلاحيات واضحة وموافقات، وإلى سجل نشاط يمكنك مراجعته.",
            ],
        },
    },
    {
        "id": "mcp", "num": 5, "title": "Model Context Protocol",
        "subtitle": "A standard way to connect agents to tools and data",
        "objectives": [
            "Explain what MCP is and why it is useful",
            "Describe hosts, clients, and servers",
            "Use tools, resources, and prompts in Python",
        ],
        "contents": [
            "Hosts, clients, servers, and transports",
            "Tools, resources, and prompts",
            "An interactive MCP workflow",
            "A JSON-RPC simulation and the official Python SDK",
        ],
        "takeaway": "Build a connector once as an MCP server, and any MCP-compatible application can use it, with your approval.",
        "narration": {
            "en": [
                "Welcome to Module 5: the Model Context Protocol, or MCP. It is an open standard for connecting AI applications to external tools and data.",
                "You will learn what MCP is and why it is useful, how hosts, clients, and servers work together, and how to use the three server primitives, tools, resources, and prompts, in Python.",
                "You will follow one question through an interactive workflow, from the user to an external system and back. Then you will read real JSON-RPC messages and build a server and client with the official Python SDK.",
                "The key takeaway: build a connector once as an MCP server, and any MCP-compatible application can use it, with your approval.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة الخامسة: بروتوكول سياق النموذج، أو إم سي بي. وهو معيار مفتوح لربط تطبيقات الذكاء الاصْطِنَاعِيّ بالأدوات والبيانات الخارجية.",
                "ستتعلم ما هو هذا البروتوكول ولماذا هو مفيد، وكيف يعمل المضيف والعميل والخادم معًا، وكيف تستخدم مكونات الخادم الثلاثة، وهي الأدوات والموارد والقوالب، بلغة بايثون.",
                "ستتابع سؤالًا واحدًا عبر مسار عمل تفاعلي، من المستخدم إلى نظام خارجي ثم العودة. وبعد ذلك ستقرأ رسائل حقيقية بصيغة JSON-RPC، وتبني خادمًا وعميلًا باستخدام حزمة بايثون الرسمية.",
                "الخلاصة الأساسية: ابنِ المُوَصِّل مرة واحدة على هيئة خادم إم سي بي، وسيتمكن أي تطبيق متوافق من استخدامه، بموافقتك.",
            ],
        },
    },
    {
        "id": "decisions", "num": 6, "title": "Decision APIs",
        "subtitle": "Consistent, auditable decisions for agents",
        "objectives": [
            "Explain what a decision API is",
            "Compare rules engines, optimizers, and predictive models",
            "Turn an OpenAPI-described service into an agent tool",
        ],
        "contents": [
            "How an agent calls a decision service",
            "An interactive decision table",
            "From an OpenAPI description to an agent tool",
            "Optimization: exhaustive search and OR-Tools",
        ],
        "takeaway": "Let the language model understand and explain, and let the decision service decide.",
        "narration": {
            "en": [
                "Welcome to Module 6: Decision APIs. Many decisions must be consistent, auditable, and sometimes provably optimal.",
                "You will learn what a decision API is, compare rules engines, optimization solvers, and predictive models, and turn a service described with OpenAPI into a tool that an agent can call.",
                "You will follow an agent as it calls a decision service, change the inputs of a live decision table, convert an OpenAPI document into a tool, and solve a small assignment problem by exhaustive search and with OR-Tools.",
                "The key takeaway: let the language model understand and explain, and let the decision service decide.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة السادسة: واجهات برمجة القرارات. كثير من القرارات يجب أن تكون متسقة وقابلة للتدقيق، بل ومثلى في بعض الأحيان.",
                "ستتعلم ما هي واجهة برمجة القرارات، وستقارن بين محركات القواعد وأدوات التحسين والنماذج التنبؤية، وستحوّل خدمة موصوفة بمعيار OpenAPI إلى أداة يستطيع الوكيل استدعاءها.",
                "ستتابع وكيلًا وهو يستدعي خدمة قرارات، وستغيّر مدخلات جدول قرارات تفاعلي، وستحوّل وثيقة OpenAPI إلى أداة، وستحل مسألة توزيع صغيرة بالبحث الشامل ثم باستخدام OR-Tools.",
                "الخلاصة الأساسية: دع النموذج اللغوي يفهم ويشرح، ودع خدمة القرارات تتخذ القرار.",
            ],
        },
    },
    {
        "id": "workflows", "num": 7, "title": "Agentic AI Workflows",
        "subtitle": "Perceive, reason, plan, act, and learn",
        "objectives": [
            "Explain the five stages of the agent loop",
            "Trace how information flows through the loop",
            "Run an end-to-end example that learns from feedback",
        ],
        "contents": [
            "An interactive loop diagram",
            "The inputs and outputs of each stage",
            "Two speeds of learning",
            "A campus shuttle dispatcher in Python",
        ],
        "takeaway": "An agent is a loop, not a single answer. Feedback from each cycle improves the next.",
        "narration": {
            "en": [
                "Welcome to Module 7: Agentic AI Workflows. An agent is a loop: it perceives, reasons, plans, acts, and learns.",
                "You will learn the five stages of the agent loop, trace how information flows from one stage to the next, and run an end-to-end example that improves with feedback.",
                "You will explore an interactive loop diagram, see the inputs and outputs of every stage, and learn the difference between learning inside one task and learning across many tasks. Then you will run a campus shuttle dispatcher in Python.",
                "The key takeaway: an agent is a loop, not a single answer. Feedback from each cycle improves the next.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة السابعة: مسارات عمل الذكاء الاصْطِنَاعِيّ الوَكِيلِيّ. الوكيل حلقة متكررة: يدرك، ثم يَسْتَدِلّ، ثم يخطط، ثم ينفذ، ثم يتعلم.",
                "ستتعلم المراحل الخمس لحلقة الوكيل، وستتتبع انتقال المعلومات من مرحلة إلى أخرى، وستشغّل مثالًا متكاملًا يتحسن بفضل التغذية الراجعة.",
                "ستستكشف مخططًا تفاعليًا للحلقة، وسترى مدخلات كل مرحلة ومخرجاتها، وستتعرف على الفرق بين التعلم داخل مهمة واحدة والتعلم عبر مهام كثيرة. ثم ستشغّل بلغة بايثون نظامًا لتوجيه حافلات الحرم الجامعي.",
                "الخلاصة الأساسية: الوكيل حلقة متكررة لا إجابة واحدة، والتغذية الراجعة من كل دورة تحسّن الدورة التالية.",
            ],
        },
    },
    {
        "id": "nocode", "num": 8, "title": "No-Code Agentic Workflows",
        "subtitle": "Build agent workflows visually",
        "objectives": [
            "Decide when no-code, low-code, or code fits best",
            "Compare visual platforms such as n8n, Langflow, Flowise, and Dify",
            "Build and import three example workflows",
        ],
        "contents": [
            "A comparison of visual workflow platforms",
            "n8n: email triage with human approval",
            "n8n: a weekly research digest",
            "Document Q&A with RAG, plus Python equivalents",
        ],
        "takeaway": "Visual tools are a fast way to prototype. Keep an approval step before anything that sends, pays, or deletes.",
        "narration": {
            "en": [
                "Welcome to Module 8: No-Code Agentic Workflows. Visual platforms let you connect triggers, AI models, tools, and approvals on a canvas.",
                "You will learn when no-code, low-code, or code fits best, compare platforms such as n8n, Langflow, Flowise, and Dify, and build three example workflows that you can import and adapt.",
                "You will walk through an email triage workflow with human approval, a weekly research digest, and a document question-and-answer flow based on retrieval. Each one comes with a step-by-step explanation and a Python equivalent.",
                "The key takeaway: visual tools are a fast way to prototype. Keep an approval step before anything that sends, pays, or deletes.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة الثامنة: مسارات العمل الوَكِيلِيَّة دون برمجة. تتيح لك المنصات المرئية ربط المحفزات ونماذج الذكاء الاصْطِنَاعِيّ والأدوات والموافقات على لوحة واحدة.",
                "ستتعلم متى يكون العمل دون برمجة أو ببرمجة قليلة أو بالبرمجة الكاملة هو الأنسب، وستقارن بين منصات مثل n8n وLangflow وFlowise وDify، وستبني ثلاثة مسارات عمل يمكنك استيرادها وتعديلها.",
                "ستتعرف خطوة بخطوة على مسار لفرز البريد الإلكتروني بموافقة بشرية، ومسار لملخص بحثي أسبوعي، ومسار للإجابة عن الأسئلة من المستندات يعتمد على الاسترجاع. ولكل منها شرح مفصل ومقابل بلغة بايثون.",
                "الخلاصة الأساسية: الأدوات المرئية طريقة سريعة لبناء النماذج الأولية. واحرص دائمًا على خطوة موافقة قبل أي إجراء يرسل أو يدفع أو يحذف.",
            ],
        },
    },
    {
        "id": "codeflows", "num": 9, "title": "Code-based Agentic Workflows",
        "subtitle": "Agent SDKs, and many models through one API",
        "objectives": [
            "Explain what agent SDKs provide",
            "Compare eight Python agent SDKs",
            "Reach free and commercial models through OpenRouter and Commonstack",
        ],
        "contents": [
            "A tiny agent framework in plain Python",
            "OpenAI Agents SDK, Claude Agent SDK, LangChain, CrewAI",
            "smolagents, Pydantic AI, AutoGen, and Magentic-One",
            "Model gateways, safe API keys, and the same agent in seven SDKs",
        ],
        "takeaway": "SDKs handle the plumbing and gateways make models interchangeable, so you can focus on designing the workflow.",
        "narration": {
            "en": [
                "Welcome to Module 9: Code-based Agentic Workflows. When a workflow outgrows a visual canvas, you build it in code.",
                "You will learn what agent SDKs provide, compare eight Python SDKs, and reach free and commercial models through the OpenRouter and Commonstack gateways.",
                "You will start with a tiny agent framework in plain Python, then compare the OpenAI Agents SDK, the Claude Agent SDK, LangChain, CrewAI, smolagents, Pydantic AI, AutoGen, and Magentic-One. Finally, you will load an API key safely and build the same agent in seven SDKs.",
                "The key takeaway: SDKs handle the plumbing and gateways make models interchangeable, so you can focus on designing the workflow.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة التاسعة: مسارات العمل الوَكِيلِيَّة بالبرمجة. عندما يصبح مسار العمل أكبر من أن تستوعبه لوحة مرئية، فإنك تبنيه بالشِّيفْرَة البرمجية.",
                "ستتعلم ما تقدمه حزم تطوير الوكلاء، وستقارن بين ثماني حزم بلغة بايثون، وستصل إلى نماذج مجانية وتجارية عبر بَوَّابَتَي OpenRouter وCommonstack.",
                "ستبدأ بإطار عمل صغير للوكلاء بلغة بايثون الخالصة، ثم ستقارن بين OpenAI Agents SDK وClaude Agent SDK وLangChain وCrewAI وsmolagents وPydantic AI وAutoGen وMagentic-One. وأخيرًا ستحمّل مفتاح الواجهة البرمجية بأمان، وتبني الوكيل نفسه باستخدام سبع حزم مختلفة.",
                "الخلاصة الأساسية: تتولى حزم التطوير التفاصيل التقنية، وتجعل البَوَّابات النماذجَ قابلة للتبديل، فتتفرغ أنت لتصميم مسار العمل.",
            ],
        },
    },
    {
        "id": "governance", "num": 10, "title": "Agentic AI Governance",
        "subtitle": "Keeping agents safe, reliable, and accountable",
        "objectives": [
            "Explain why agents need governance",
            "Describe nine areas of agent governance",
            "Apply guardrails, approvals, evaluation, and monitoring",
        ],
        "contents": [
            "Nine areas of agent governance",
            "Defense in depth: where the controls go",
            "Python labs: guardrails, approval policy, evaluation, monitoring",
            "Incident response and governance frameworks",
        ],
        "takeaway": "No single control is enough. Layer guardrails, permissions, human approval, and monitoring.",
        "narration": {
            "en": [
                "Welcome to Module 10: Agentic AI Governance. When AI systems can act, mistakes become actions.",
                "You will learn why agents need governance, describe nine areas of agent governance, and apply practical controls: guardrails, human approval, evaluation, and monitoring.",
                "You will explore safety, transparency, privacy, oversight, access control, evaluation, accountability, monitoring, and responsible deployment. You will follow a request through layered controls, run three Python labs, and learn how to respond to incidents.",
                "The key takeaway: no single control is enough. Layer guardrails, permissions, human approval, and monitoring.",
            ],
            "ar": [
                "مرحبًا بكم في الوحدة العاشرة: حَوْكَمَة الذكاء الاصْطِنَاعِيّ الوَكِيلِيّ. عندما تستطيع أنظمة الذكاء الاصْطِنَاعِيّ التصرف، تتحول الأخطاء إلى أفعال.",
                "ستتعلم لماذا يحتاج الوكلاء إلى الحَوْكَمَة، وستصف تسعة مجالات لِحَوْكَمَة الوكلاء، وستطبق ضوابط عملية: الحواجز الوقائية، والموافقة البشرية، والتقييم، والمراقبة.",
                "ستستكشف السلامة والشفافية والخصوصية والإشراف وضبط الوصول والتقييم والمساءلة والمراقبة والنشر المسؤول. وستتابع طلبًا عبر طبقات متعددة من الضوابط، وتشغّل ثلاث تجارب بلغة بايثون، وتتعلم كيفية الاستجابة للحوادث.",
                "الخلاصة الأساسية: لا يكفي ضابط واحد. اجمع بين طبقات من الحواجز الوقائية والصلاحيات والموافقة البشرية والمراقبة.",
            ],
        },
    },
]
