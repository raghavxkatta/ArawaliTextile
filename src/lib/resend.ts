import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

/** Returns null when RESEND_API_KEY is not set. */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client ??= new Resend(key);
  return client;
}

// TODO(owner): verify arawalitextile.com in Resend so enquiries@arawalitextile.com can send.
// Until then, Resend's test sender only delivers to the Resend account's own address.
export const fromEmail = () => process.env.ENQUIRY_FROM_EMAIL || "Arawali Textile <onboarding@resend.dev>";
export const ownerEmail = () => process.env.ENQUIRY_TO_EMAIL || "arawali007@gmail.com";
