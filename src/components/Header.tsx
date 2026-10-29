"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/data/content";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const SECTION_IDS = ["heritage", "collections", "craft", "ordering", "contact"];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuBtn.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active nav link follows whichever section crosses the middle of the viewport
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        className={`sticky top-[var(--safe-top)] z-50 border-b border-line bg-cream transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_30px_rgb(29_38_33/0.08)]" : ""
        }`}
      >
        <div
          className={`wrap flex items-center justify-between gap-5 transition-[padding] duration-300 ${
            scrolled ? "py-2" : "py-3.5"
          }`}
        >
          <Logo />
          <nav aria-label="Main" className="hidden gap-9 min-[861px]:flex">
            {content.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href.slice(1) ? "true" : undefined}
                className="nav-link py-1.5 text-[15.5px] text-ink no-underline aria-[current=true]:text-maroon"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a className="btn btn-line hidden min-[861px]:inline-flex" href="#contact">
            {content.headerCta}
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="inline-flex h-12 w-12 cursor-pointer items-center justify-center border-[1.5px] border-maroon bg-transparent text-maroon min-[861px]:hidden"
            aria-label={content.menu.open}
            aria-expanded={menuOpen}
            aria-controls="drawer"
            onClick={() => setMenuOpen(true)}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
              <path d="M0 1h22M0 8h22M0 15h22" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
