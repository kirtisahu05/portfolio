import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/ai-system-prompt";
import { checkRateLimit } from "@/lib/rate-limit";
import { getLogEntries, type LogEntry } from "@/lib/log-source";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-flash-lite-latest";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;

type ChatTurn = { role: "user" | "assistant"; content: string };

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return Response.json(
      {
        error: "rate_limited",
        message: "You've reached the question limit for now. Try again shortly.",
      },
      { status: 429 }
    );
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "server_error", message: "Something went wrong. Please try again." },
      { status: 400 }
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return Response.json(
      { error: "server_error", message: "Something went wrong. Please try again." },
      { status: 400 }
    );
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history: ChatTurn[] = rawHistory
    .filter(
      (turn): turn is ChatTurn =>
        !!turn &&
        typeof turn === "object" &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string"
    )
    .slice(-MAX_HISTORY_TURNS);

  const contents = [...history, { role: "user" as const, content: message }].map((turn) => ({
    role: turn.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: turn.content }],
  }));

  try {
    // Private log entries never reach the assistant's knowledge base — the
    // same server-side rule as the /log page: they're stripped down before
    // anything client-facing (including this prompt) ever sees them.
    const logEntries = (await getLogEntries()).filter((e): e is LogEntry => e.visibility === "Public");
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: {
        systemInstruction: buildSystemPrompt(logEntries),
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });

    // Pull the first chunk before committing to a 200 response. If the
    // Gemini call fails outright (bad/missing API key, invalid request),
    // it surfaces here and we can still return a clean JSON error — once we
    // return the streaming Response below we're committed to a 200, so any
    // later failure can only end the stream early, not report itself.
    let first: IteratorResult<GenerateContentResponse>;
    try {
      first = await stream.next();
    } catch (err) {
      console.error("[/api/ask] Gemini request failed:", err);
      return Response.json(
        { error: "server_error", message: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let result = first;
          while (!result.done) {
            const text = result.value.text;
            if (text) controller.enqueue(encoder.encode(text));
            result = await stream.next();
          }
        } catch {
          // Mid-stream error after we already committed to a 200 — the
          // client just sees the stream end early.
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[/api/ask] Unhandled error:", err);
    return Response.json(
      { error: "server_error", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
