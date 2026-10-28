import { BuyerAutoReply } from "@/emails/BuyerAutoReply";
import { OwnerEnquiry } from "@/emails/OwnerEnquiry";
import { rateLimit } from "@/lib/rate-limit";
import { fromEmail, getResend, ownerEmail } from "@/lib/resend";
import { getSupabase } from "@/lib/supabase";
import { enquirySchema, fieldErrors, type Enquiry } from "@/lib/validation";
import { buyerWhatsappUrl } from "@/lib/whatsapp";

const json = (body: unknown, status = 200, headers?: HeadersInit) => Response.json(body, { status, headers });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, errors: fieldErrors(parsed.error) }, 400);
  const enquiry = parsed.data;

  // Honeypot hit: pretend it worked so the bot moves on
  if (enquiry.website) return json({ ok: true });

  const limit = rateLimit(ip);
  if (!limit.ok) return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": String(limit.retryAfter) });

  const supabase = getSupabase();
  const resend = getResend();

  if (!supabase && !resend) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[enquiry] Supabase and Resend are not configured; logging instead.\n", enquiry);
      return json({ ok: true, dev: true });
    }
    console.error("[enquiry] No storage or email configured");
    return json({ ok: false, error: "not_configured" }, 500);
  }

  const [saved, emailed] = await Promise.all([saveLead(enquiry), emailOwner(enquiry)]);

  // The lead is safe if it reached either the database or the owner's inbox
  if (!saved && !emailed) return json({ ok: false, error: "delivery_failed" }, 500);

  await emailBuyer(enquiry);
  return json({ ok: true });
}

async function saveLead(e: Enquiry): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("leads").insert({
    name: e.name,
    company: e.company || null,
    email: e.email,
    phone: e.phone || null,
    country: e.country,
    product: e.product,
    quantity: e.quantity || null,
    message: e.message || null,
    source: "website",
  });
  if (error) console.error("[enquiry] Supabase insert failed", error);
  return !error;
}

async function emailOwner(e: Enquiry): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const firstName = e.name.split(/\s+/)[0];
  const whatsappReplyUrl = e.phone
    ? buyerWhatsappUrl(e.phone, `Hello ${firstName}, thank you for your enquiry about ${e.product}. This is Arawali Textile, Jaipur.`)
    : null;
  const receivedAt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date()) + " IST";
  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: ownerEmail(),
    replyTo: e.email,
    subject: `New enquiry: ${e.product} from ${e.name}, ${e.country}`,
    react: OwnerEnquiry({ enquiry: e, whatsappReplyUrl, receivedAt }),
  });
  if (error) console.error("[enquiry] Owner email failed", error);
  return !error;
}

async function emailBuyer(e: Enquiry): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: e.email,
    replyTo: ownerEmail(),
    subject: "Thank you for your enquiry · Arawali Textile",
    react: BuyerAutoReply({ enquiry: e }),
  });
  // Not fatal: the owner already has the lead
  if (error) console.error("[enquiry] Buyer auto-reply failed", error);
}
