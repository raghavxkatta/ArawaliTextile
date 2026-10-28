import { ApiError, type GenerateContentResponse } from "@google/genai";
import { z } from "zod";
import { chatModels, getGemini, httpOptions, replySchema, systemInstruction, thinkingLevel } from "@/lib/chat";
import { chatRequestSchema, enquiryDraftSchema, type ChatResponse } from "@/lib/chat-schema";
import { createRateLimiter } from "@/lib/rate-limit";

// 30 chat messages per 10 minutes per IP keeps the free Gemini quota for real visitors
const rateLimit = createRateLimiter(30);

const json = (body: ChatResponse, status = 200, headers?: HeadersInit) => Response.json(body, { status, headers });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "invalid" }, 400);

  const limit = rateLimit(ip);
  if (!limit.ok) return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": String(limit.retryAfter) });

  const gemini = getGemini();
  if (!gemini) {
    console.error("[chat] GEMINI_API_KEY is not set");
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const contents = parsed.data.messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
  const models = chatModels();

  for (const [i, model] of models.entries()) {
    try {
      const response = await gemini.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        responseJsonSchema: replySchema,
          thinkingConfig: { thinkingLevel },
          maxOutputTokens: 1024,
          httpOptions,
        },
      });
      return toChatResponse(response);
    } catch (error) {
      const last = i === models.length - 1;
      // 429 = free quota used up, 503 = model overloaded, no status = timed out: try the next model
      const busy = !(error instanceof ApiError) || error.status === 429 || error.status === 503;
      console.warn(`[chat] ${model} failed`, error instanceof ApiError ? error.status : error);
      if (!busy) return json({ ok: false, error: "failed" }, 502);
      if (last) return json({ ok: false, error: "busy" }, 503);
    }
  }
  return json({ ok: false, error: "failed" }, 502);
}

const modelReplySchema = z.object({
  reply: z.string().trim().min(1),
  show_enquiry_form: z.boolean().catch(false),
  // Only present with the form; enquiryDraftSchema fills in fallbacks
  product: z.unknown().optional(),
  quantity: z.unknown().optional(),
  country: z.unknown().optional(),
  summary: z.unknown().optional(),
});

function toChatResponse(response: GenerateContentResponse) {
  let raw: unknown;
  let parseError = "";
  try {
    raw = JSON.parse(response.text ?? "");
  } catch (e) {
    parseError = String(e);
  }
  const parsed = modelReplySchema.safeParse(raw);
  if (!parsed.success) {
    console.error("[chat] Unreadable reply", response.candidates?.[0]?.finishReason, parseError || parsed.error.message, response.text?.slice(-300));
    return json({ ok: false, error: "failed" }, 502);
  }

  const { reply, show_enquiry_form, summary, ...rest } = parsed.data;
  if (!show_enquiry_form) return json({ ok: true, reply });
  return json({ ok: true, reply, enquiry: enquiryDraftSchema.parse({ ...rest, message: summary }) });
}
