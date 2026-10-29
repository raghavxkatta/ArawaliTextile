import Image from "next/image";
import { content } from "@/data/content";
import { images } from "@/data/images";
import { Buta } from "./Buta";

export function Hero() {
  const t = content.hero;
  return (
    <section
      aria-label={t.label}
      className="hero-shade relative grid min-h-[min(86svh,760px)] place-items-center overflow-hidden bg-hero-bg text-center text-on-hero"
    >
      <Image
        src={images.heroHaveli}
        alt=""
        fill
        preload
        fetchPriority="high"
        quality={85}
        sizes="100vw"
        // Phones only fit a narrow slice: show the printed bedcovers rather than the dark door
        className="object-cover object-[78%_50%] min-[861px]:object-center"
      />
      <div className="relative z-[1] max-w-[820px] pt-[72px] pr-[var(--gut-r)] pb-[120px] pl-[var(--gut-l)]">
        <p className="eyebrow animate-rise text-on-hero! [animation-delay:.1s]">{t.eyebrow}</p>
        <h1 className="mt-4 animate-rise leading-[0.92] [animation-delay:.25s]">
          <span className="block text-[clamp(74px,11vw,156px)] tracking-[-0.01em]">{t.titleA}</span>
          <span className="block text-[clamp(44px,6vw,86px)] italic">{t.titleB}</span>
        </h1>
        <div
          className="mx-auto my-[26px] flex max-w-[260px] animate-rise items-center gap-3.5 [animation-delay:.4s]"
          aria-hidden="true"
        >
          <i className="h-px flex-1 bg-gold" />
          <Buta size={20} className="text-gold" />
          <i className="h-px flex-1 bg-gold" />
        </div>
        <p className="animate-rise font-display text-[clamp(27px,3.2vw,40px)] leading-[1.2] [animation-delay:.4s]">
          {t.tag}
        </p>
        <p className="mx-auto mt-3.5 max-w-[460px] animate-rise text-on-hero-muted [animation-delay:.55s]">{t.sub}</p>
        <a className="btn btn-light mt-[34px] animate-rise [animation-delay:.7s]" href="#collections">
          {t.cta}
        </a>
      </div>
      <a
        className="absolute bottom-[13px] left-[var(--gut-l)] z-[1] flex min-h-11 items-center gap-2.5 text-[14px] text-on-hero no-underline"
        href="#heritage"
      >
        <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true">
          <path d="M7 1v15M1 10l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        {t.scrollCue}
      </a>
      <p className="absolute right-[calc(var(--gut-r)+84px)] bottom-[26px] z-[1] hidden text-[11px] font-semibold tracking-[0.12em] text-on-hero-muted tabular-nums min-[641px]:block">
        {t.coords}
      </p>
    </section>
  );
}
