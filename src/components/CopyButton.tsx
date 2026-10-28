"use client";

import { useRef, useState } from "react";
import { content } from "@/data/content";

type Props = {
  text: string;
  /** Element whose text gets selected if the clipboard API is unavailable */
  fallbackTargetId?: string;
  className?: string;
  label?: string;
};

export function CopyButton({ text, fallbackTargetId, className, label = content.contact.copy }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
  const timer = useRef<number>(undefined);

  const flash = (s: typeof state) => {
    setState(s);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1600);
  };

  const selectFallback = () => {
    const target = fallbackTargetId && document.getElementById(fallbackTargetId);
    if (target) {
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    flash("selected");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash("copied");
    } catch {
      selectFallback();
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ??
        "ml-1.5 min-h-8 cursor-pointer border border-line bg-paper px-2.5 py-1 text-[12px] font-semibold text-maroon"
      }
    >
      <span aria-live="polite">
        {state === "copied" ? content.contact.copied : state === "selected" ? content.contact.copyFallback : label}
      </span>
    </button>
  );
}
