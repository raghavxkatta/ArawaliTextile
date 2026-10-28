import { content } from "@/data/content";
import { whatsappUrl } from "@/data/site";
import type { Enquiry, EnquiryField } from "./validation";

type EnquiryLike = Record<Exclude<EnquiryField, "website">, string>;

/** Plain-text summary of an enquiry, used for the success screen and the WhatsApp prefill. */
export function enquiryText(e: EnquiryLike): string {
  return [
    content.form.whatsappIntro,
    "",
    `Name: ${e.name}`,
    `Company: ${e.company || "-"}`,
    `Email: ${e.email}`,
    ...(e.phone ? [`Phone: ${e.phone}`] : []),
    `Country: ${e.country}`,
    `Product: ${e.product}`,
    `Quantity: ${e.quantity || "-"}`,
    "",
    `Details: ${e.message || "-"}`,
  ].join("\n");
}

export const enquiryWhatsappUrl = (e: Enquiry) => whatsappUrl(enquiryText(e));

/** wa.me link to message a buyer back, from a free-form phone number. Null if it doesn't look usable. */
export function buyerWhatsappUrl(phone: string, text?: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
