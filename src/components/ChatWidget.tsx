"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/data/content";
import { productOptions } from "@/data/products";
import { whatsappUrl } from "@/data/site";
import { MAX_CHAT_MESSAGE_LENGTH, MAX_CHAT_MESSAGES, type ChatResponse, type EnquiryDraft } from "@/lib/chat-schema";
import { enquirySchema, fieldErrors, type EnquiryField } from "@/lib/validation";

const t = content.chat;

type Entry =
  | { kind: "user" | "model"; text: string }
  | { kind: "error"; text: string }
  | { kind: "enquiry"; draft: EnquiryDraft };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Phones: full screen, sized to the visible area so the keyboard never covers the input
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    // Opening the keyboard straight away hides half the panel on phones
    if (finePointer()) inputRef.current?.focus();

    const mobile = matchMedia("(max-width: 640px)");
    const vv = window.visualViewport;
    const prevOverflow = document.body.style.overflow;
    const update = () => {
      document.body.style.overflow = mobile.matches ? "hidden" : prevOverflow;
      setViewport(mobile.matches && vv ? { height: vv.height, top: vv.offsetTop } : null);
    };
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    mobile.addEventListener("change", update);
    return () => {
      document.body.style.overflow = prevOverflow;
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      mobile.removeEventListener("change", update);
    };
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    // When a form arrives, show the reply above it rather than jumping past it
    const reply = entries.at(-1)?.kind === "enquiry" ? [...log.querySelectorAll<HTMLElement>("[data-reply]")].at(-1) : null;
    log.scrollTo({ top: reply ? reply.offsetTop - log.offsetTop - 12 : log.scrollHeight, behavior: "smooth" });
  }, [entries, pending]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const send = async (text: string) => {
    const message = text.trim().slice(0, MAX_CHAT_MESSAGE_LENGTH);
    if (!message || pending) return;

    const next: Entry[] = [...entries, { kind: "user", text: message }];
    setEntries(next);
    setInput("");
    setPending(true);

    // Only the conversation itself goes to the model, starting with a visitor message
    const history = next
      .filter((e): e is Extract<Entry, { kind: "user" | "model" }> => e.kind === "user" || e.kind === "model")
      .map((e) => ({ role: e.kind, text: e.text.slice(0, MAX_CHAT_MESSAGE_LENGTH) }))
      .slice(-MAX_CHAT_MESSAGES);
    while (history[0]?.role === "model") history.shift();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data: ChatResponse = await res.json().catch(() => ({ ok: false, error: "failed" }));
      if (data.ok) {
        setEntries((es) => [
          ...es,
          ...(data.reply ? [{ kind: "model", text: data.reply } as const] : []),
          ...(data.enquiry ? [{ kind: "enquiry", draft: data.enquiry } as const] : []),
        ]);
      } else {
        const error = data.error === "rate_limited" || data.error === "busy" ? t.errors[data.error] : t.errors.generic;
        setEntries((es) => [...es, { kind: "error", text: error }]);
      }
    } catch {
      setEntries((es) => [...es, { kind: "error", text: t.errors.generic }]);
    } finally {
      setPending(false);
      if (finePointer()) inputRef.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-label={t.open}
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen(true)}
        className={`fixed right-[calc(18px+var(--safe-right))] bottom-[calc(88px+var(--safe-bottom))] z-40 grid h-[58px] w-[58px] cursor-pointer place-items-center rounded-full bg-maroon text-on-maroon shadow-[0_12px_28px_rgb(0_0_0/0.22)] transition-transform duration-[250ms] ease-brand hover:scale-[1.08] ${
          open ? "pointer-events-none opacity-0" : ""
        }`}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" strokeLinejoin="round" />
          <path d="M8.5 9.5h7M8.5 12.5h4.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label={t.title}
          onKeyDown={(e) => e.key === "Escape" && close()}
          style={viewport ? { top: viewport.top, bottom: "auto", height: viewport.height } : undefined}
          className="fixed inset-0 z-[70] flex flex-col bg-paper pt-[var(--safe-top)] pb-[var(--safe-bottom)] shadow-[0_18px_48px_rgb(0_0_0/0.28)] min-[641px]:inset-auto min-[641px]:right-[calc(18px+var(--safe-right))] min-[641px]:bottom-[calc(18px+var(--safe-bottom))] min-[641px]:h-[min(620px,calc(100dvh-36px))] min-[641px]:w-[390px] min-[641px]:border min-[641px]:border-line min-[641px]:p-0"
        >
          <header className="flex shrink-0 items-start justify-between gap-3 bg-maroon px-4 py-3 text-on-maroon min-[641px]:px-5 min-[641px]:py-4">
            <div className="min-w-0">
              <h2 className="text-[22px] leading-none min-[641px]:text-[26px]">{t.title}</h2>
              {/* Short screens (phone keyboard open) keep the room for the conversation */}
              <p className="mt-1.5 text-[11.5px] tracking-wide opacity-85 [@media(max-height:480px)]:hidden">{t.subtitle}</p>
            </div>
            <button type="button" onClick={close} aria-label={t.close} className="-mt-1 -mr-1 grid h-11 w-11 shrink-0 cursor-pointer place-items-center text-[28px] leading-none">
              ×
            </button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4">
            <Bubble kind="model">{t.greeting}</Bubble>
            {entries.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {t.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="cursor-pointer border border-blush-line bg-cream px-3 py-1.5 text-left text-[13.5px] hover:border-maroon"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {entries.map((e, i) =>
              e.kind === "enquiry" ? (
                <EnquiryCard key={i} draft={e.draft} />
              ) : e.kind === "error" ? (
                <p key={i} role="alert" className="border-l-[3px] border-error bg-cream px-3 py-2 text-[14px] text-error">
                  {e.text}{" "}
                  <a href={whatsappUrl()} target="_blank" rel="noopener">
                    {content.menu.whatsapp} ↗
                  </a>
                </p>
              ) : (
                <Bubble key={i} kind={e.kind}>
                  {e.text}
                </Bubble>
              ),
            )}
            {pending && <p className="text-[13.5px] text-muted italic">{t.thinking}</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="shrink-0 border-t border-line px-4 pt-3 pb-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                enterKeyHint="send"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={MAX_CHAT_MESSAGE_LENGTH}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                className="field max-h-[120px] min-h-[46px] min-w-0 flex-1 resize-none text-[16px]"
              />
              <button type="submit" disabled={pending || !input.trim()} className="btn btn-solid min-h-[46px] px-4! disabled:opacity-50">
                {t.send}
              </button>
            </div>
            <p className="mt-2 text-[11.5px] text-muted [@media(max-height:480px)]:hidden">{t.disclaimer}</p>
          </form>
        </div>
      )}
    </>
  );
}

const finePointer = () => matchMedia("(pointer: fine)").matches;

function Bubble({ kind, children }: { kind: "user" | "model"; children: React.ReactNode }) {
  return (
    <p
      data-reply={kind === "model" ? "" : undefined}
      className={`max-w-[88%] px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
        kind === "user" ? "self-end bg-maroon text-on-maroon" : "self-start bg-blush text-ink"
      }`}
    >
      {children}
    </p>
  );
}

type CardField = Exclude<EnquiryField, "website">;

function EnquiryCard({ draft }: { draft: EnquiryDraft }) {
  const [values, setValues] = useState<Record<CardField, string>>({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: draft.country,
    product: draft.product,
    quantity: draft.quantity,
    message: draft.message,
  });
  const [errors, setErrors] = useState<Partial<Record<EnquiryField, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState("");
  const f = content.form;

  const set = (field: CardField) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, message: `[Via website chat] ${values.message}`.slice(0, 4000) }),
      });
      const data: { ok?: boolean; errors?: Partial<Record<EnquiryField, string>> } = await res.json().catch(() => ({}));
      if (res.ok && data.ok) return setStatus("sent");
      setStatus("idle");
      if (res.status === 400 && data.errors) return setErrors(data.errors);
      setServerError(res.status === 429 ? f.errors.rateLimited : f.errors.server);
    } catch {
      setStatus("idle");
      setServerError(f.errors.server);
    }
  };

  if (status === "sent") {
    return <p className="border-l-[3px] border-whatsapp bg-cream px-3 py-2.5 text-[14.5px] font-semibold text-green">{t.enquiry.sent}</p>;
  }

  const label = "grid gap-1 text-[13px] font-semibold";
  const input = (field: CardField) => ({
    name: field,
    value: values[field],
    onChange: set(field),
    "aria-invalid": errors[field] ? true : undefined,
    // 16px or more, or iPhone Safari zooms the page in when a field is tapped
    className: "field min-w-0 py-2! text-[16px]",
  });
  const error = (field: CardField) => errors[field] && <span className="text-[12.5px] font-medium text-error">{errors[field]}</span>;

  return (
    <form noValidate onSubmit={onSubmit} aria-label={t.enquiry.title} className="grid gap-3 border border-line bg-cream p-3.5">
      <p className="font-display text-[20px] leading-tight">{t.enquiry.title}</p>
      <label className={label}>
        {f.name.label}
        <input {...input("name")} autoComplete="name" required />
        {error("name")}
      </label>
      <label className={label}>
        {f.email.label}
        <input {...input("email")} type="email" inputMode="email" autoComplete="email" required />
        {error("email")}
      </label>
      <label className={label}>
        {f.phone.label}
        <input {...input("phone")} type="tel" inputMode="tel" autoComplete="tel" />
        {error("phone")}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={label}>
          {f.country.label}
          <select {...input("country")} autoComplete="country-name">
            {content.countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          {f.quantity.label}
          <input {...input("quantity")} />
        </label>
      </div>
      <label className={label}>
        {f.product.label}
        <select {...input("product")}>
          {productOptions.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className={label}>
        {t.enquiry.edit}
        <textarea {...input("message")} rows={3} className="field min-w-0 resize-y py-2! text-[16px]" />
        {error("message")}
      </label>
      {serverError && (
        <p role="alert" className="text-[13.5px] text-error">
          {serverError}
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className="btn btn-solid justify-self-start">
        {status === "sending" ? f.sending : t.enquiry.submit}
      </button>
    </form>
  );
}
