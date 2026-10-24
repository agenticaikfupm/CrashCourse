/* No-Code Agentic Workflows: diagrams styled like visual workflow canvases,
   plus the Google Manager and lost-and-found simulators. */
(function () {
  "use strict";

  const FLOWS = {
    google: {
      title: "n8n: Google Manager (Gmail and Calendar)",
      width: 1000, height: 380, minWidth: 700, legend: true,
      nodes: [
        { id: "chat", label: "Chat message", sub: "Chat Trigger", x: 85, y: 110, w: 150, kind: "user" },
        { id: "mail", label: "Gmail Trigger", sub: "every minute", x: 85, y: 240, w: 150, kind: "user" },
        { id: "agent", label: "AI Agent", sub: "system message + time", x: 305, y: 175, w: 170, kind: "llm" },
        { id: "model", label: "Chat model", sub: "sub-node", x: 235, y: 330, w: 130, kind: "data" },
        { id: "mem", label: "Simple Memory", sub: "per chat or thread", x: 395, y: 330, w: 160, kind: "data" },
        { id: "read", label: "Read and create tools", sub: "Gmail get, Calendar get, create", x: 560, y: 65, w: 230, kind: "tool" },
        { id: "approve", label: "Approve in chat", sub: "Approve or Decline", x: 565, y: 285, w: 170, kind: "human" },
        { id: "risky", label: "Send, reply, delete", sub: "4 sensitive tools", x: 815, y: 330, w: 175, kind: "tool" },
        { id: "ifchat", label: "Started from chat?", sub: "If node", x: 735, y: 175, w: 170 },
        { id: "reply", label: "Reply in chat", sub: "Chat node", x: 920, y: 175, w: 140, kind: "tool" }
      ],
      edges: [
        { from: "chat", to: "agent" }, { from: "mail", to: "agent" },
        { from: "model", to: "agent", dashed: true }, { from: "mem", to: "agent", dashed: true },
        { from: "read", to: "agent", dashed: true, label: "runs directly" },
        { from: "approve", to: "agent", dashed: true, label: "pauses first" },
        { from: "risky", to: "approve", dashed: true },
        { from: "agent", to: "ifchat" }, { from: "ifchat", to: "reply", label: "true" }
      ],
      steps: [
        { nodes: ["chat", "mail"], edges: [], text: "<strong>Two entry points.</strong> A chat message or a new email (checked every minute, skipping your own mail) starts the same agent." },
        { nodes: ["agent", "model", "mem"], edges: ["chat>agent", "mail>agent", "model>agent", "mem>agent"], text: "<strong>Reason with memory.</strong> The agent knows the current time and where the run started. Memory is kept per chat session or per email thread." },
        { nodes: ["read"], edges: ["read>agent"], text: "<strong>Safe tools run directly.</strong> Reading email, reading the calendar, and creating personal events. Creation checks for duplicates and conflicts first." },
        { nodes: ["approve", "risky"], edges: ["approve>agent", "risky>approve"], text: "<strong>Sensitive tools wait.</strong> Sending, replying, and deleting sit behind Approve in chat, which shows the exact parameters and waits for Approve or Decline." },
        { nodes: ["ifchat", "reply"], edges: ["agent>ifchat", "ifchat>reply"], text: "<strong>Answer where the run began.</strong> Only chat runs reply in chat. Email runs finish in the execution log and never use the sensitive tools." }
      ]
    },
    lostfound: {
      title: "n8n: lost-and-found assistant on Telegram",
      width: 1000, height: 380, minWidth: 700, legend: true,
      nodes: [
        { id: "tg", label: "Telegram Trigger", sub: "message updates", x: 85, y: 150, w: 150, kind: "user" },
        { id: "prep", label: "Prepare message", sub: "Edit Fields", x: 255, y: 150, w: 150 },
        { id: "agent", label: "AI Agent", sub: "one question at a time", x: 445, y: 150, w: 180, kind: "llm" },
        { id: "model", label: "Chat model", sub: "sub-node", x: 230, y: 320, w: 130, kind: "data" },
        { id: "mem", label: "Simple Memory", sub: "per Telegram chat", x: 385, y: 320, w: 150, kind: "data" },
        { id: "search", label: "Search Found Items", sub: "Available rows only", x: 560, y: 320, w: 180, kind: "tool" },
        { id: "claim", label: "Submit Claim", sub: "after confirmation", x: 745, y: 320, w: 160, kind: "tool" },
        { id: "guard", label: "Privacy check", sub: "Guardrails node", x: 650, y: 150, w: 160, kind: "human" },
        { id: "ok", label: "Reply Approved", sub: "Telegram", x: 880, y: 75, w: 150, kind: "tool" },
        { id: "refuse", label: "Safe Refusal", sub: "then Reply Blocked", x: 880, y: 210, w: 170, kind: "data" }
      ],
      edges: [
        { from: "tg", to: "prep" }, { from: "prep", to: "agent" },
        { from: "model", to: "agent", dashed: true }, { from: "mem", to: "agent", dashed: true },
        { from: "search", to: "agent", dashed: true }, { from: "claim", to: "agent", dashed: true },
        { from: "agent", to: "guard" }, { from: "guard", to: "ok", label: "pass" }, { from: "guard", to: "refuse", label: "fail" }
      ],
      steps: [
        { nodes: ["tg", "prep"], edges: ["tg>prep"], text: "<strong>Receive.</strong> A Telegram message arrives. Edit Fields prepares the text, the chat ID for the reply, and a session ID." },
        { nodes: ["agent", "model", "mem"], edges: ["prep>agent", "model>agent", "mem>agent"], text: "<strong>Ask.</strong> The agent collects details with one open question at a time and never suggests answers. Memory is kept per chat." },
        { nodes: ["search"], edges: ["search>agent"], text: "<strong>Search privately.</strong> Only Available records are returned to the agent, which compares them and reveals at most one plausible match." },
        { nodes: ["claim"], edges: ["claim>agent"], text: "<strong>Claim.</strong> After the person confirms a summary, one Pending Review row is saved. A claim never proves ownership by itself." },
        { nodes: ["guard", "ok"], edges: ["agent>guard", "guard>ok"], text: "<strong>Check every reply.</strong> A Guardrails node blocks bulk disclosure of items or claims; safe replies go to Telegram." },
        { nodes: ["refuse"], edges: ["guard>refuse"], text: "<strong>Fail safely.</strong> A blocked reply is replaced by a fixed refusal, so private records never reach the chat." }
      ]
    },
    triage: {
      title: "n8n: email triage with human approval",
      width: 1000, height: 330, minWidth: 680, legend: true,
      nodes: [
        { id: "trig", label: "Gmail Trigger", sub: "new email", x: 85, y: 165, w: 150, kind: "user" },
        { id: "cls", label: "Classify email", sub: "Text Classifier (AI)", x: 285, y: 165, w: 180, kind: "llm" },
        { id: "model", label: "Chat model", sub: "sub-node", x: 285, y: 285, w: 140, kind: "data" },
        { id: "spam", label: "Archive", sub: "spam", x: 510, y: 55, w: 130 },
        { id: "urgent", label: "Notify on-call", sub: "urgent", x: 510, y: 165, w: 150 },
        { id: "draft", label: "Draft reply", sub: "AI Agent", x: 510, y: 275, w: 140, kind: "llm" },
        { id: "approve", label: "Human approval", sub: "send and wait", x: 720, y: 275, w: 160, kind: "human" },
        { id: "send", label: "Send and log", sub: "Gmail + Sheets", x: 910, y: 275, w: 150, kind: "tool" }
      ],
      edges: [
        { from: "trig", to: "cls" },
        { from: "model", to: "cls", dashed: true },
        { from: "cls", to: "spam", label: "spam" }, { from: "cls", to: "urgent", label: "urgent" }, { from: "cls", to: "draft", label: "question" },
        { from: "draft", to: "approve" }, { from: "approve", to: "send", label: "approved" }
      ],
      steps: [
        { nodes: ["trig"], edges: [], text: "<strong>Trigger.</strong> The workflow starts whenever a new email arrives." },
        { nodes: ["cls", "model"], edges: ["trig>cls", "model>cls"], text: "<strong>Classify.</strong> An AI node, backed by a chat model sub-node, labels the email as spam, urgent, or question." },
        { nodes: ["spam", "urgent"], edges: ["cls>spam", "cls>urgent"], text: "<strong>Route.</strong> Spam is archived and urgent messages go to on-call staff. No AI reply is sent for these." },
        { nodes: ["draft"], edges: ["cls>draft"], text: "<strong>Draft.</strong> For questions, an AI Agent node drafts a polite reply." },
        { nodes: ["approve"], edges: ["draft>approve"], text: "<strong>Approve.</strong> A person reviews the draft before anything is sent (human-in-the-loop)." },
        { nodes: ["send"], edges: ["approve>send"], text: "<strong>Act and log.</strong> The reply is sent and the outcome is written to a log sheet." }
      ]
    },
    digest: {
      title: "n8n: weekly research digest",
      width: 1000, height: 250, minWidth: 680, legend: true,
      nodes: [
        { id: "sched", label: "Schedule", sub: "Sundays, 9 am", x: 85, y: 100, w: 140, kind: "user" },
        { id: "http", label: "HTTP Request", sub: "arXiv API search", x: 270, y: 100, w: 170, kind: "tool" },
        { id: "xml", label: "Parse XML", sub: "to JSON items", x: 455, y: 100, w: 150 },
        { id: "llm", label: "Summarize", sub: "LLM chain", x: 640, y: 100, w: 150, kind: "llm" },
        { id: "model", label: "Chat model", sub: "sub-node", x: 640, y: 205, w: 140, kind: "data" },
        { id: "send", label: "Send digest", sub: "email or Teams", x: 870, y: 100, w: 170, kind: "tool" }
      ],
      edges: [
        { from: "sched", to: "http" }, { from: "http", to: "xml" }, { from: "xml", to: "llm" },
        { from: "model", to: "llm", dashed: true }, { from: "llm", to: "send" }
      ],
      steps: [
        { nodes: ["sched"], edges: [], text: "<strong>Schedule.</strong> The workflow runs automatically once a week." },
        { nodes: ["http"], edges: ["sched>http"], text: "<strong>Fetch.</strong> An HTTP Request node queries the public arXiv API for the five newest papers matching \"agentic AI\"." },
        { nodes: ["xml"], edges: ["http>xml"], text: "<strong>Parse.</strong> arXiv returns XML (Atom), which is converted to JSON items." },
        { nodes: ["llm", "model"], edges: ["xml>llm", "model>llm"], text: "<strong>Summarize.</strong> An LLM chain writes a short, student-friendly summary using only the fetched data." },
        { nodes: ["send"], edges: ["llm>send"], text: "<strong>Deliver.</strong> The digest is sent by email or to a team channel." }
      ]
    },
    rag: {
      title: "Langflow (or Flowise, Dify): document Q&A",
      width: 1000, height: 300, minWidth: 680, legend: true,
      nodes: [
        { id: "docs", label: "Load files", sub: "PDF, text", x: 85, y: 80, w: 140, kind: "user" },
        { id: "split", label: "Split text", sub: "chunks", x: 270, y: 80, w: 140 },
        { id: "embed", label: "Embeddings", sub: "model", x: 455, y: 80, w: 140, kind: "llm" },
        { id: "store", label: "Vector store", sub: "index", x: 640, y: 80, w: 140, kind: "data" },
        { id: "q", label: "Chat input", sub: "question", x: 85, y: 220, w: 140, kind: "user" },
        { id: "ret", label: "Retriever", sub: "top chunks", x: 455, y: 220, w: 140, kind: "tool" },
        { id: "prompt", label: "Prompt + LLM", sub: "answer with sources", x: 670, y: 220, w: 190, kind: "llm" },
        { id: "out", label: "Chat output", x: 900, y: 220, w: 140, kind: "data" }
      ],
      edges: [
        { from: "docs", to: "split" }, { from: "split", to: "embed" }, { from: "embed", to: "store" },
        { from: "q", to: "ret", label: "embed question" }, { from: "store", to: "ret", label: "similar chunks" },
        { from: "ret", to: "prompt" }, { from: "prompt", to: "out" }
      ],
      steps: [
        { nodes: ["docs", "split"], edges: ["docs>split"], text: "<strong>Ingest.</strong> Documents are loaded and split into small chunks." },
        { nodes: ["embed", "store"], edges: ["split>embed", "embed>store"], text: "<strong>Index.</strong> Each chunk is turned into an embedding vector and stored in a vector store. This runs once per document." },
        { nodes: ["q", "ret"], edges: ["q>ret", "store>ret"], text: "<strong>Retrieve.</strong> A question is embedded and the most similar chunks are fetched." },
        { nodes: ["prompt"], edges: ["ret>prompt"], text: "<strong>Generate.</strong> The chunks are inserted into a prompt that tells the LLM to answer only from them." },
        { nodes: ["out"], edges: ["prompt>out"], text: "<strong>Answer.</strong> The response is shown with its sources." }
      ]
    }
  };

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* Google Manager simulator: mirrors examples/nc_google_manager.py. ------- */
  const GM_SENSITIVE = new Set(["send_message", "reply_to_message", "delete_message", "delete_calendar_event"]);
  const GM_REQUESTS = {
    unread: { calls: [["get_messages", { search_query: "is:unread", limit: 5 }]], done: "Three unread emails summarized. The dean's lab schedule approval, due Tuesday, is flagged as urgent." },
    schedule: { calls: [["get_calendar_event", { after: "tomorrow 00:00", before: "tomorrow 23:59" }]], done: "Tomorrow you have Office hours from 14:00 to 15:00." },
    create: { calls: [["create_calendar_event", { title: "Calendar test", start: "tomorrow 10:00", end: "tomorrow 10:30" }]], done: "Created Calendar test tomorrow from 10:00 to 10:30 in your primary calendar." },
    duplicate: { calls: [["create_calendar_event", { title: "Calendar test", start: "tomorrow 10:00", end: "tomorrow 10:30" }]], done: "That event already exists, so no duplicate was created.", note: "already_exists" },
    conflict: { calls: [["create_calendar_event", { title: "Lab sync", start: "tomorrow 14:30", end: "tomorrow 15:00" }]], done: "No event created: it overlaps Office hours. Which time would you prefer?", note: "conflict" },
    send: { calls: [["send_message", { to: "alex@example.com", subject: "Calendar test", message: "This is a test message." }]], done: "The email to alex@example.com was sent." },
    reply: { calls: [["get_messages", { search_query: "from:dean@university.edu", limit: 1 }], ["reply_to_message", { message_id: "m1", message: "Approved. Thank you." }]], done: "Your reply to the dean was sent in the same thread." },
    delmail: { calls: [["get_messages", { search_query: "from:promo@shop.example", limit: 1 }], ["delete_message", { message_id: "m3" }]], done: "The promotional email was permanently deleted." },
    delevent: { calls: [["get_calendar_event", { after: "tomorrow 00:00", before: "tomorrow 23:59" }], ["delete_calendar_event", { event_id: "e2" }]], done: "The Calendar test event was deleted." }
  };

  function initGoogleSim() {
    const form = document.getElementById("gm-form"), out = document.getElementById("gm-result");
    if (!form || !out) return;
    const review = document.getElementById("gm-review");
    function update() {
      const origin = form.origin.value, req = GM_REQUESTS[form.request.value];
      const approve = form.review.value === "approve";
      const needsReview = origin === "chat" && req.calls.some(([t]) => GM_SENSITIVE.has(t));
      review.disabled = !needsReview;
      review.classList.toggle("is-off", !needsReview);
      let outcome = "done", card = "";
      const rows = req.calls.map(([tool, args]) => {
        let tag;
        if (!GM_SENSITIVE.has(tool)) tag = '<span class="tag brand">runs directly</span>';
        else if (origin === "email") { tag = '<span class="tag danger">not available to email runs</span>'; outcome = "email"; }
        else {
          tag = `<span class="tag gold">waits for Approve in chat</span> <span class="tag ${approve ? "brand" : "danger"}">${approve ? "approved, runs" : "declined, not run"}</span>`;
          card = `Approve this action?\nTool: ${tool}\n${JSON.stringify(args, null, 2)}`;
          if (!approve) outcome = "declined";
        }
        return `<li><code>${tool}</code> ${tag}</li>`;
      }).join("");
      const reply = outcome === "email"
        ? "Nothing is sent or deleted. The proposed action is noted in the execution log for the owner to request later through chat."
        : outcome === "declined" ? "Understood, I did not do that. (The agent must not retry it with another tool.)" : req.done;
      const cls = outcome === "done" ? (req.note === "conflict" ? "d-manual_review" : "d-approve") : outcome === "declined" ? "d-reject" : "d-manual_review";
      out.className = "decision-result " + cls;
      out.innerHTML = `<span class="kicker">Tool calls</span><ol class="tool-trace">${rows}</ol>
        ${card ? `<span class="kicker">Approval card in the chat</span><code class="json">${esc(card)}</code>` : ""}
        <span class="kicker" style="margin-top:.8rem">${origin === "chat" ? "Agent reply in chat" : "Result (email runs do not reply in chat)"}</span><p class="mb-0">${esc(reply)}</p>`;
    }
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", e => e.preventDefault());
    update();
  }

  /* Lost-and-found simulator: mirrors examples/nc_lost_found.py. ---------- */
  const LF_ITEMS = [
    ["LF001", "Headphones", "Black", "Sony", "Main Library", "2026-10-15", "Available"],
    ["LF002", "Earbuds", "Black", "Samsung", "Main Library", "2026-10-16", "Available"],
    ["LF003", "Headphones", "White", "JBL", "Engineering Building", "2026-10-15", "Available"],
    ["LF004", "Wallet", "Brown", "Unknown", "Student Center", "2026-10-14", "Available"],
    ["LF005", "Phone", "Black", "Apple", "Cafeteria", "2026-10-17", "Available"],
    ["LF006", "Keys", "Silver", "Unknown", "Parking Area B", "2026-10-16", "Available"],
    ["LF007", "Backpack", "Blue", "Adidas", "Lecture Hall 2", "2026-10-13", "Claimed"],
    ["LF008", "Watch", "Black", "Casio", "Sports Center", "2026-10-17", "Available"]
  ].map(([id, category, color, brand, location, date, status]) => ({ id, category, color, brand, location, date, status }));
  const LF_REFUSAL = "I can help search for a specific item you lost, but I cannot provide the current item inventory or access claim records. Please describe your lost item.";

  function lfScore(query, value) {
    const q = query.trim().toLowerCase(), v = value.trim().toLowerCase();
    if (!q || !v || v === "unknown") return 0;
    if (v.includes(q) || q.includes(v)) return 3;
    const vw = new Set(v.split(/\s+/));
    return Math.min(q.split(/\s+/).filter(w => vw.has(w)).length, 2);
  }
  function lfDateScore(asked, found) {
    if (!asked) return 0;
    const gap = Math.abs(Date.parse(found) - Date.parse(asked)) / 864e5;
    return gap === 0 ? 3 : gap === 1 ? 2 : gap <= 3 ? 1 : 0;
  }

  function initLostFoundSim() {
    const form = document.getElementById("lf-form"), out = document.getElementById("lf-result");
    if (!form || !out) return;
    function update() {
      const inventory = form.mode.value === "inventory";
      form.querySelectorAll("[data-lf]").forEach(l => { l.hidden = inventory; });
      const d = { category: form.category.value, color: form.color.value, brand: form.brand.value, location: form.location.value, date: form.date.value };
      let reply, trace;
      if (inventory) {
        reply = LF_REFUSAL;
        trace = "<li>No tool call: the agent refuses requests for the inventory or for claims.</li><li>Privacy check: <span class=\"tag brand\">pass</span> (a refusal is allowed). Had the reply listed two records, it would fail and the Safe Refusal would be sent instead.</li>";
      } else {
        const missing = [["category", "What type of item did you lose?"], ["location", "Where do you think you lost it?"], ["date", "About when did you lose it?"]]
          .find(([k]) => !d[k].trim());
        if (missing) {
          reply = missing[1];
          trace = "<li>No search yet: the agent asks one open question at a time and never suggests possible answers.</li>";
        } else {
          const ranked = LF_ITEMS.filter(i => i.status === "Available")
            .map(i => ({ i, s: lfScore(d.category, i.category) + lfScore(d.color, i.color) + lfScore(d.brand, i.brand) + lfScore(d.location, i.location) + lfDateScore(d.date, i.date) }))
            .filter(r => r.s >= 3).sort((a, b) => b.s - a.s).slice(0, 3);
          const hidden = ranked.length ? ranked.map(r => `${r.i.id} (score ${r.s})`).join(", ") : "none";
          trace = `<li><code>search_found_items</code> <span class="tag brand">runs directly</span><br>Candidates seen only by the agent: ${hidden}. LF007 is Claimed, so it is never returned.</li>`;
          if (!ranked.length) reply = "I could not find a likely match. You can correct or add details about the item.";
          else if (ranked.length > 1 && ranked[0].s - ranked[1].s < 3) reply = "Can you describe anything distinctive about it?";
          else {
            const m = ranked[0].i;
            reply = `A possible match is ${m.id}: ${m.color.toLowerCase()} ${m.brand === "Unknown" ? "" : m.brand + " "}${m.category.toLowerCase()}, found at ${m.location} on ${m.date}. Ownership still needs to be verified. Would you like to file a claim?`;
          }
          trace += "<li>Privacy check: <span class=\"tag brand\">pass</span> (at most one record is shown).</li>";
        }
      }
      out.className = "decision-result " + (inventory ? "d-reject" : "d-approve");
      out.innerHTML = `<span class="kicker">What the user sees</span><p>${esc(reply)}</p>
        <span class="kicker">Inside the workflow</span><ul class="tool-trace">${trace}</ul>`;
    }
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", e => e.preventDefault());
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initGoogleSim();
    initLostFoundSim();
    if (!window.FlowDiagram) return;
    document.querySelectorAll(".nocode-diagram[data-flow]").forEach(fig => {
      const cfg = FLOWS[fig.dataset.flow];
      if (cfg) window.FlowDiagram.create(fig, cfg);
    });
  });
})();
