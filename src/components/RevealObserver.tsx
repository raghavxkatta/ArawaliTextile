"use client";

import { useEffect } from "react";

/** Lifts [data-reveal] elements into view as they scroll in. Runs once per page load. */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("reveal-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el, i) => {
      // Only arm elements below the fold, so the first frame is complete
      if (el.getBoundingClientRect().top <= window.innerHeight) return;
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      el.classList.add("reveal-armed");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
