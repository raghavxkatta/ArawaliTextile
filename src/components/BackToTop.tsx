"use client";

import { useEffect, useState } from "react";
import { content } from "@/data/content";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={content.floating.toTop}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-[calc(88px+var(--safe-right))] bottom-[calc(24px+var(--safe-bottom))] z-40 h-[46px] w-[46px] cursor-pointer border-[1.5px] border-maroon bg-cream text-maroon transition-opacity duration-300 ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      ↑
    </button>
  );
}
