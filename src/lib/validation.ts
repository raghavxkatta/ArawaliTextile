import { z } from "zod";
import { content } from "@/data/content";
import { productOptions } from "@/data/products";

const { errors } = content.form;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s().-]{6,24}$/;

const optionalText = (max: number) => z.string().trim().max(max, errors.tooLong).default("");

/** Shared by the enquiry form (client) and the API route (server). */
export const enquirySchema = z.object({
  name: z.string().trim().min(1, errors.name).max(120, errors.tooLong),
  company: optionalText(160),
  email: z.string().trim().max(200, errors.tooLong).regex(EMAIL_RE, errors.email),
  phone: z
    .string()
    .trim()
    .max(24, errors.tooLong)
    .refine((v) => v === "" || PHONE_RE.test(v), "Please check the phone number, or leave it empty.")
    .default(""),
  country: z.enum(content.countries),
  product: z.string().refine((v) => productOptions.includes(v), "Please choose a product."),
  quantity: optionalText(120),
  message: optionalText(4000),
  /** Honeypot. Real people never see or fill this. */
  website: z.string().max(500).default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;
export type EnquiryField = keyof Enquiry;

export function fieldErrors(error: z.ZodError): Partial<Record<EnquiryField, string>> {
  const out: Partial<Record<EnquiryField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as EnquiryField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
