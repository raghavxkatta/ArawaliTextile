import { z } from "zod";
import { content } from "@/data/content";
import { CUSTOM_DESIGN, productOptions } from "@/data/products";

export const MAX_CHAT_MESSAGES = 20;
export const MAX_CHAT_MESSAGE_LENGTH = 1500;

/** Shared by the chat widget (client) and the chat API route (server). */
export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().trim().min(1).max(MAX_CHAT_MESSAGE_LENGTH),
      }),
    )
    .min(1)
    .max(MAX_CHAT_MESSAGES)
    .refine((m) => m[m.length - 1].role === "user", "The last message must be from the visitor."),
});

export type ChatMessage = z.infer<typeof chatRequestSchema>["messages"][number];

/** What the bot hands to the inline enquiry card. Lenient: bad values fall back instead of failing. */
export const enquiryDraftSchema = z.object({
  product: z
    .string()
    .refine((v) => productOptions.includes(v))
    .catch(CUSTOM_DESIGN),
  quantity: z.string().trim().max(120).catch(""),
  country: z.enum(content.countries).catch("Other"),
  message: z.string().trim().max(4000).catch(""),
});

export type EnquiryDraft = z.infer<typeof enquiryDraftSchema>;

export type ChatResponse =
  | { ok: true; reply: string; enquiry?: EnquiryDraft }
  | { ok: false; error: "invalid" | "rate_limited" | "not_configured" | "busy" | "failed" };
