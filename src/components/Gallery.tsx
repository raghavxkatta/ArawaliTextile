"use client";

import Image from "next/image";
import { useRef } from "react";
import { content } from "@/data/content";
import { gallery } from "@/data/images";

const GAP = 16;

export function Gallery() {
  const t = content.gallery;
  const track = useRef<HTMLDivElement>(null);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const fig = el?.querySelector("figure");
    if (!el || !fig) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (fig.getBoundingClientRect().width + GAP), behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "h-[50px] w-[50px] cursor-pointer border-[1.5px] border-maroon bg-transparent text-[20px] text-maroon hover:bg-maroon hover:text-white";

  return (
    <section aria-labelledby="galTitle" className="pb-[clamp(72px,9vw,128px)]">
      <div className="wrap">
        <div data-reveal="" className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="galTitle" className="h2 text-[clamp(36px,4.2vw,54px)]!">
              {t.title}
            </h2>
          </div>
          <div className="flex flex-none gap-2.5">
            <button type="button" className={arrow} aria-label={t.prev} aria-controls="track" onClick={() => step(-1)}>
              ←
            </button>
            <button type="button" className={arrow} aria-label={t.next} aria-controls="track" onClick={() => step(1)}>
              →
            </button>
          </div>
        </div>
        <div
          ref={track}
          id="track"
          tabIndex={0}
          role="region"
          aria-label={t.trackLabel}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]"
        >
          {gallery.map((g) => (
            <figure key={g.image} className="m-0 flex-[0_0_clamp(230px,26vw,320px)] snap-start">
              <div className="frame aspect-[3/4]">
                <Image
                  src={g.image}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 885px) 230px, 320px"
                  className="object-cover"
                  style={g.position ? { objectPosition: g.position } : undefined}
                />
              </div>
              <figcaption className="mt-2.5 text-[14px] text-muted">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
