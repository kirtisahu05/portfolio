"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  TbAdjustments,
  TbBrain,
  TbBucket,
  TbChartBar,
  TbCloudUpload,
  TbCode,
  TbCreditCard,
  TbFilter,
  TbHistory,
  TbLayoutDashboard,
  TbMessageChatbot,
  TbSearch,
  TbShieldLock,
  TbStack2,
} from "react-icons/tb";
import FlowLane, { type FlowLaneData } from "@/components/FlowLane";

// Interactive architecture for the YourBot project card (default theme),
// following the sift-rag-chatbot source. Three flows through the platform —
// ingesting a document, answering a question, and tracking usage — with each
// node labeled by who built it, matching the project's `ownership` in
// content.ts: the Next.js app layer is mine; ingestion, retrieval and LLM
// inference run in a teammate's backend AI service that the app hands work to
// (Redis Stream) and reads from (chat-history API).

type Owner = "mine" | "service" | "shared";
type Node = { id: string; icon: IconType; title: string; owner: Owner; body: string; tech: string[] };
type Flow = { id: string; label: string; nodes: Node[]; lanes: FlowLaneData[] };

const FLOWS: Flow[] = [
  {
    id: "ingest",
    label: "Ingest a document",
    nodes: [
      {
        id: "tenant",
        icon: TbShieldLock,
        title: "Tenant & auth",
        owner: "mine",
        body: "Signing up creates the company's account in Postgres and its user in Keycloak through the Admin API, sends the verify-email action, and assigns the free plan. Access and refresh tokens live in httpOnly cookies, JWTs are verified against Keycloak's JWKS, and sessions refresh silently.",
        tech: ["Keycloak", "Admin API", "JWT", "JWKS", "httpOnly cookies"],
      },
      {
        id: "upload",
        icon: TbCloudUpload,
        title: "Upload",
        owner: "mine",
        body: "A server action checks the session and issues a 60-second presigned PUT URL, so the browser uploads the file straight to storage without passing through the app. The Document row and its IngestionJob are written to Postgres through Prisma.",
        tech: ["Server Actions", "Presigned PUT", "Prisma", "PostgreSQL"],
      },
      {
        id: "storage",
        icon: TbBucket,
        title: "Object storage",
        owner: "mine",
        body: "Each tenant gets its own MinIO bucket, named after its tenant id and created on first upload. Its documents and branding logos are stored there, separate from every other company's.",
        tech: ["MinIO / S3 API", "Bucket per tenant"],
      },
      {
        id: "handoff",
        icon: TbStack2,
        title: "Queue handoff",
        owner: "mine",
        body: "Once the file is saved, the app publishes a document_uploaded event to the files_queue Redis Stream with the tenant, file and job ids, so the AI service picks the work up without the app waiting on it. The IngestionJob row tracks the file's status, stage and attempts.",
        tech: ["Redis Streams", "XADD files_queue", "IngestionJob status"],
      },
      {
        id: "pipeline",
        icon: TbFilter,
        title: "Ingestion & index",
        owner: "service",
        body: "My teammate's AI service reads from the stream, then parses, chunks and embeds each document and indexes it in pgvector, scoped to the bot's collection.",
        tech: ["Celery workers", "Parse → chunk → embed", "pgvector"],
      },
    ],
    lanes: [
      { duration: 8, tokens: ["tenant: acme", "JWT ✓", "plan: free"].map((t) => ({ t, kind: "chunk" as const })) },
      { duration: 6.5, tokens: ["📄", "pdf", "📄", "docx", "📄", "txt"].map((t) => ({ t })) },
      { duration: 8, tokens: ["bucket: acme", "key ✓", "job: queued"].map((t) => ({ t, kind: "chunk" as const })) },
      { duration: 8, tokens: ["XADD", "files_queue", "document_uploaded"].map((t) => ({ t, kind: "chunk" as const })) },
    ],
  },
  {
    id: "answer",
    label: "Answer a question",
    nodes: [
      {
        id: "config",
        icon: TbAdjustments,
        title: "Bot config",
        owner: "mine",
        body: "A 7-step wizard (brand and persona, tone, guardrails, documents, indexing, test chat, deploy) saves the bot's settings as JSON on the Bot row: branding, LLM settings (tone, temperature, style prompt), guardrails (blocked phrases, fact-checking, topic restriction, PII blocking, max length) and retrieval settings.",
        tech: ["7-step wizard", "Persona & tone", "Guardrails", "top-k 4 · threshold 0.78"],
      },
      {
        id: "widget",
        icon: TbCode,
        title: "Embed snippet",
        owner: "mine",
        body: "The deploy step generates the bot's embed script with the tenant id, theme color and logo, and stores it with a domain whitelist that can be managed from the bot's settings tab. Customers paste the script into their own site.",
        tech: ["Script generation", "Domain whitelist", "Install settings"],
      },
      {
        id: "retrieval",
        icon: TbSearch,
        title: "Retrieval",
        owner: "service",
        body: "When a visitor asks a question, the AI service runs a similarity search in pgvector over this bot's collection, using the top-k and similarity-threshold values saved by the configuration UI.",
        tech: ["pgvector", "Per-bot collection", "Config-driven params"],
      },
      {
        id: "llm",
        icon: TbBrain,
        title: "LLM inference",
        owner: "service",
        body: "The service sends the retrieved passages to the LLM along with the bot's persona and guardrails, and the LLM writes an answer grounded in the customer's own documents, with citations.",
        tech: ["Grounded generation", "Guardrails", "Citations"],
      },
      {
        id: "reply",
        icon: TbMessageChatbot,
        title: "Answer & log",
        owner: "service",
        body: "The answer is shown in the bot's branded chat window on the customer's site. The service logs each exchange with its session, latency and cited sources, which the usage dashboards read.",
        tech: ["Branded widget", "Session · latency · citations"],
      },
    ],
    lanes: [
      { duration: 8, tokens: ["persona ✓", "guardrails ✓", "top-k = 4"].map((t) => ({ t, kind: "chunk" as const })) },
      { duration: 8, tokens: ["what's your", "refund", "policy?"].map((t) => ({ t, kind: "chunk" as const })) },
      {
        duration: 6.5,
        tokens: [{ t: "¶" }, { t: "§4", kind: "join" }, { t: "¶" }, { t: "§2", kind: "join" }, { t: "¶" }],
      },
      { duration: 8, tokens: ["Refunds within", "30 days —", "see §4."].map((t) => ({ t, kind: "word" as const })) },
    ],
  },
  {
    id: "usage",
    label: "Track usage",
    nodes: [
      {
        id: "history",
        icon: TbHistory,
        title: "Chat history API",
        owner: "service",
        body: "The AI service exposes each tenant's conversations through a paginated history endpoint: the query, session, latency and cited files for every answer.",
        tech: ["/chat/{tenant}/history", "Paginated"],
      },
      {
        id: "aggregate",
        icon: TbChartBar,
        title: "Analytics",
        owner: "mine",
        body: "A server action pulls the latest 100 exchanges and aggregates them into query volume, unique sessions, average latency and the most-cited source files.",
        tech: ["Server Actions", "Aggregation"],
      },
      {
        id: "bot-dash",
        icon: TbMessageChatbot,
        title: "Bot analytics",
        owner: "mine",
        body: "Each bot's detail page has tabs for overview, configuration, knowledge base (documents and their ingestion status), analytics and install settings. The analytics tab shows total queries, sessions, average latency and the top-cited sources.",
        tech: ["Per-bot tabs", "Stat cards", "Top-cited sources"],
      },
      {
        id: "overview",
        icon: TbLayoutDashboard,
        title: "Dashboards",
        owner: "mine",
        body: "The workspace overview summarizes the tenant: total conversations, active bots, average response time, success and no-answer rates, system status, and a recent-activity feed of uploads and bot changes. A separate dashboard charts usage trends and token breakdown.",
        tech: ["KPIs", "Recharts", "System status", "Activity feed"],
      },
      {
        id: "billing",
        icon: TbCreditCard,
        title: "Plans & usage",
        owner: "mine",
        body: "A subscription data model (Hobby, Pro, Pro+ and Ultra plans with per-country prices and entitlements) backs a billing screen that compares live usage of messages, documents and bots against each plan's quotas.",
        tech: ["Plans & entitlements", "Quotas", "Usage meters"],
      },
    ],
    lanes: [
      { duration: 8, tokens: ["page=1", "size=100", "200 OK"].map((t) => ({ t, kind: "chunk" as const })) },
      { duration: 8, tokens: ["queries", "sessions", "latency"].map((t) => ({ t, kind: "chunk" as const })) },
      { duration: 6.5, tokens: ["▁", "▃", "▅", "▂", "▇", "▄"].map((t) => ({ t })) },
      { duration: 8, tokens: ["msgs 412/1k", "docs 18/100", "bots 3/5"].map((t) => ({ t, kind: "chunk" as const })) },
    ],
  },
];

const OWNER_LABEL: Record<Owner, string> = { mine: "Built by me", service: "AI service", shared: "Me + AI service" };

function OwnerBadge({ owner }: { owner: Owner }) {
  const mine = owner !== "service";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-[var(--font-mono)] text-[10px]"
      style={{
        borderColor: mine ? "var(--accent)" : "var(--border-strong)",
        color: mine ? "var(--accent)" : "var(--text-muted)",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: mine ? "var(--accent)" : "var(--text-muted)" }} />
      {OWNER_LABEL[owner]}
    </span>
  );
}

const TENANTS = ["acme", "globex", "initech"];

export default function YourBotArchitecture() {
  const [flowIndex, setFlowIndex] = useState(0);
  const [active, setActive] = useState(0);
  const flow = FLOWS[flowIndex];
  const node = flow.nodes[active];

  return (
    <section
      aria-labelledby="yourbot-arch"
      className="card-dark mt-5 overflow-hidden rounded-[var(--radius-lg)] border p-6 sm:p-8"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="section-label">Architecture</span>
          <h4
            id="yourbot-arch"
            className="mt-3 font-[var(--font-display)] text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl"
          >
            One platform, many tenants — follow a request through it
          </h4>
        </div>
        {/* Flow switch */}
        <div
          role="tablist"
          aria-label="YourBot flows"
          className="inline-flex rounded-full border p-1"
          style={{ borderColor: "var(--border-strong)" }}
        >
          {FLOWS.map((f, i) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={i === flowIndex}
              onClick={() => {
                setFlowIndex(i);
                setActive(0);
              }}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium transition"
              style={{
                background: i === flowIndex ? "var(--accent)" : "transparent",
                color: i === flowIndex ? "var(--accent-contrast)" : "var(--text-secondary)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-tenancy: every request runs inside exactly one tenant. */}
      <div className="mt-6 flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">
        <span>tenants:</span>
        {TENANTS.map((t, i) => (
          <span
            key={t}
            className="rounded-full border px-2.5 py-0.5"
            style={{
              borderColor: i === 0 ? "var(--accent)" : "var(--border)",
              color: i === 0 ? "var(--accent)" : "var(--text-muted)",
              opacity: i === 0 ? 1 : 0.55,
            }}
          >
            {i === 0 ? "● " : ""}
            {t}
          </span>
        ))}
        <span className="ml-1">— this request is scoped to one tenant; the others stay isolated</span>
      </div>

      {/* Node rail with animated lanes between tiles (desktop). */}
      <div className="relative mt-8">
        {flow.lanes.map((lane, i) => (
          <div
            key={`${flow.id}-${i}`}
            className="absolute top-0 hidden md:block"
            style={{ left: `calc(${10 + 20 * i}% + 34px)`, width: "calc(20% - 68px)" }}
          >
            <FlowLane lane={lane} active={i === active - 1} />
          </div>
        ))}
        <div role="tablist" aria-label={`${flow.label} steps`} className="relative grid grid-cols-5">
          {flow.nodes.map((n, i) => {
            const Icon = n.icon;
            const isActive = i === active;
            return (
              <button
                key={n.id}
                type="button"
                role="tab"
                id={`yb-${flow.id}-${n.id}`}
                aria-selected={isActive}
                aria-controls="yb-panel"
                onClick={() => setActive(i)}
                className="group flex flex-col items-center gap-2 text-center"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl border transition"
                  style={{
                    background: isActive ? "var(--accent)" : "var(--bg-elevated)",
                    color: isActive ? "var(--accent-contrast)" : "var(--text-secondary)",
                    borderColor: isActive ? "var(--accent)" : "var(--border)",
                    boxShadow: isActive ? "0 0 0 6px rgb(154 251 164 / 0.12)" : undefined,
                    borderStyle: n.owner === "service" && !isActive ? "dashed" : "solid",
                  }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span
                  className={`hidden text-xs font-medium sm:block ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}
                >
                  {n.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="yb-panel"
        role="tabpanel"
        aria-labelledby={`yb-${flow.id}-${node.id}`}
        aria-live="polite"
        className="mt-6 rounded-[calc(var(--radius-lg)-0.25rem)] border p-5"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
            {flow.label} · {String(active + 1).padStart(2, "0")} {node.title}
          </p>
          <OwnerBadge owner={node.owner} />
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">{node.body}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {node.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border px-3 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              {t}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border" style={{ borderColor: "var(--border)" }} /> solid tile: I built it
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-dashed" style={{ borderColor: "var(--border-strong)" }} /> dashed: backend
          AI service I integrate with
        </span>
      </p>
    </section>
  );
}
