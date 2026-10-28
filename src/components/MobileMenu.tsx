"use client";

import { useEffect, useRef } from "react";
import { content } from "@/data/content";
import { site, whatsappUrl } from "@/data/site";
import { Logo } from "./Logo";

type Props = { open: boolean; onClose: () => void };

export function MobileMenu({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      // Keep Tab inside the panel
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a[href], button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const links = [...content.nav, { ...content.mobileExtraNav, mobile: [content.mobileExtraNav.label, ""] as const }];

  return (
    <div
      ref={panel}
      id="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-0 z-[80] flex h-dvh flex-col bg-maroon pt-[calc(20px+var(--safe-top))] pr-[var(--gut-r)] pb-[calc(28px+var(--safe-bottom))] pl-[var(--gut-l)] text-white min-[861px]:hidden ${
        // Visible immediately on open (so focus can move in); hidden only after the slide-up finishes
        open
          ? "visible translate-y-0 [transition:transform_450ms_var(--ease-brand)]"
          : "invisible -translate-y-full [transition:transform_450ms_var(--ease-brand),visibility_0s_linear_450ms]"
      }`}
    >
      <div className="flex items-center justify-between">
        <Logo size="sm" tone="light" onClick={onClose} />
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label={content.menu.close}
          className="h-12 w-12 cursor-pointer border-[1.5px] border-white/60 bg-transparent text-[22px] text-white"
        >
          ✕
        </button>
      </div>
      <nav aria-label="Mobile" className="mt-12 flex flex-col gap-1.5 overflow-y-auto">
        {links.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="py-1 font-display text-[46px] leading-[1.15] font-medium text-white no-underline"
          >
            {item.mobile[0]}
            {item.mobile[1] && <em className="text-gold">{item.mobile[1]}</em>}
          </a>
        ))}
      </nav>
      <div className="mt-auto grid gap-3.5 pt-6 text-[15px] text-on-maroon">
        <a className="btn bg-white text-maroon" href={whatsappUrl()} target="_blank" rel="noopener">
          {content.menu.whatsapp}
        </a>
        <span>{site.address.short}</span>
      </div>
    </div>
  );
}
