/* No-Code Agentic Workflows: diagrams styled like visual workflow canvases. */
(function () {
  "use strict";

  const FLOWS = {
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

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.FlowDiagram) return;
    document.querySelectorAll(".nocode-diagram[data-flow]").forEach(fig => {
      const cfg = FLOWS[fig.dataset.flow];
      if (cfg) window.FlowDiagram.create(fig, cfg);
    });
  });
})();
