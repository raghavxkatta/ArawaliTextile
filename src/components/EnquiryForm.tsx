"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/data/content";
import { productOptions } from "@/data/products";
import { whatsappUrl } from "@/data/site";
import { PRODUCT_SELECT_EVENT } from "@/lib/product-select";
import { enquirySchema, fieldErrors, type Enquiry, type EnquiryField } from "@/lib/validation";
import { enquiryText } from "@/lib/whatsapp";
import { CopyButton } from "./CopyButton";

type Values = Record<EnquiryField, string>;
type Errors = Partial<Record<EnquiryField, string>>;

const t = content.form;

const initialValues: Values = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: content.countries[0],
  product: productOptions[0],
  quantity: "",
  message: "",
  website: "",
};

const FIELD_ORDER: EnquiryField[] = ["name", "company", "email", "phone", "country", "product", "quantity", "message"];

export function EnquiryForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState<Enquiry | null>(null);
  const [announce, setAnnounce] = useState("");
  const sentHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Preselect a product from the quick view or the custom-design link
  useEffect(() => {
    const onSelect = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      if (!productOptions.includes(title)) return;
      setValues((v) => ({ ...v, product: title }));
      setStatus((s) => (s === "sent" ? "idle" : s));
    };
    window.addEventListener(PRODUCT_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(PRODUCT_SELECT_EVENT, onSelect);
  }, []);

  useEffect(() => {
    if (status === "sent") sentHeading.current?.focus();
  }, [status]);

  const set = (field: EnquiryField) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const focusFirstError = (errs: Errors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const n = Object.keys(errs).length;
      setAnnounce(`Please check ${n === 1 ? "one field" : `${n} fields`}.`);
      focusFirstError(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    setAnnounce(t.sending);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: { ok?: boolean; errors?: Errors } = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSent(parsed.data);
        setStatus("sent");
        setAnnounce("");
        return;
      }
      setStatus("idle");
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        focusFirstError(data.errors);
        setAnnounce("Please check the highlighted fields.");
        return;
      }
      const message = res.status === 429 ? t.errors.rateLimited : t.errors.server;
      setServerError(message);
      setAnnounce(message);
    } catch {
      setStatus("idle");
      setServerError(t.errors.server);
      setAnnounce(t.errors.server);
    }
  };

  const reset = () => {
    setValues((v) => ({ ...initialValues, country: v.country }));
    setSent(null);
    setStatus("idle");
    window.setTimeout(() => document.getElementById("f-name")?.focus(), 0);
  };

  const fieldProps = (field: EnquiryField) => ({
    id: `f-${field}`,
    name: field,
    value: values[field],
    onChange: set(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `e-${field}` : undefined,
    className: "field",
  });

  const errorText = (field: EnquiryField) => (
    <span id={`e-${field}`} className="min-h-[1em] text-[13.5px] font-medium text-error">
      {errors[field]}
    </span>
  );

  const label = "grid gap-2 text-[15px] font-semibold";

  return (
    <>
      <p className="sr-only" aria-live="polite" role="status">
        {announce}
      </p>

      {status === "sent" && sent ? (
        <div className="border border-line bg-paper p-7">
          <h3 ref={sentHeading} tabIndex={-1} className="text-[36px] leading-tight outline-none">
            {t.success.title}
          </h3>
          <p className="lede mt-2 text-[16px]!">{t.success.body}</p>
          <pre id="summary" className="my-4 bg-blush p-4 font-body text-[15px] leading-relaxed whitespace-pre-wrap">
            {enquiryText(sent)}
          </pre>
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-line" href={whatsappUrl(enquiryText(sent))} target="_blank" rel="noopener">
              {t.success.whatsapp}
            </a>
            <CopyButton text={enquiryText(sent)} fallbackTargetId="summary" className="btn btn-line" label="Copy message" />
            <button type="button" className="link self-center" onClick={reset}>
              {t.success.another}
            </button>
          </div>
        </div>
      ) : (
        <form
          ref={formRef}
          id="form"
          noValidate
          onSubmit={onSubmit}
          aria-busy={status === "sending"}
          className="grid gap-5 border-t-[3px] border-double border-ink pt-[30px] min-[641px]:grid-cols-2"
        >
          <label className={label}>
            {t.name.label}
            <input {...fieldProps("name")} autoComplete="name" placeholder={t.name.placeholder} required aria-required="true" />
            {errorText("name")}
          </label>
          <label className={label}>
            {t.company.label}
            <input {...fieldProps("company")} autoComplete="organization" placeholder={t.company.placeholder} />
            {errorText("company")}
          </label>
          <label className={label}>
            {t.email.label}
            <input
              {...fieldProps("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t.email.placeholder}
              required
              aria-required="true"
            />
            {errorText("email")}
          </label>
          <label className={label}>
            {t.phone.label}
            <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder={t.phone.placeholder} />
            {errorText("phone")}
          </label>
          <label className={label}>
            {t.country.label}
            <select {...fieldProps("country")} autoComplete="country-name">
              {content.countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errorText("country")}
          </label>
          <label className={label}>
            {t.product.label}
            <select {...fieldProps("product")}>
              {productOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            {errorText("product")}
          </label>
          <label className={`${label} min-[641px]:col-span-2`}>
            {t.quantity.label}
            <input {...fieldProps("quantity")} placeholder={t.quantity.placeholder} />
            {errorText("quantity")}
          </label>
          <label className={`${label} min-[641px]:col-span-2`}>
            {t.message.label}
            <textarea
              {...fieldProps("message")}
              placeholder={t.message.placeholder}
              className="field min-h-[130px] resize-y"
            />
            {errorText("message")}
          </label>

          {/* Honeypot: hidden from people and screen readers, tempting to bots */}
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label>
              {t.honeypot}
              <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
            </label>
          </div>

          <div className="grid gap-3.5 min-[641px]:col-span-2">
            {serverError && (
              <p role="alert" className="border-l-[3px] border-error bg-paper px-4 py-3 text-[15px] text-error">
                {serverError}{" "}
                <a href={whatsappUrl(enquiryText(values))} target="_blank" rel="noopener">
                  {content.contact.whatsapp} ↗
                </a>
              </p>
            )}
            <div>
              <button className="btn btn-solid" type="submit" disabled={status === "sending"}>
                {status === "sending" ? t.sending : t.submit}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
