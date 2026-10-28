import Image from "next/image";
import { content } from "@/data/content";
import { images } from "@/data/images";
import { Buta } from "./Buta";
import { Reveal } from "./Reveal";

export function Craft() {
  const t = content.craft;
  return (
    <section id="craft" className="section-pad on-green bg-green text-on-dark">
      <div className="wrap">
        <Reveal className="flex items-start justify-between gap-6">
          <h2 className="h2 mt-0!">
            {t.title[0]}
            <br />
            <em>{t.title[1]}</em>
          </h2>
          <Buta size={60} className="flex-none text-gold" />
        </Reveal>

        <Reveal as="figure" className="frame craft-shade mx-0 mt-[52px] mb-0 aspect-[4/5] min-[641px]:aspect-[21/9]">
          <Image src={images.printingBlocks} alt="" fill sizes="(max-width: 1240px) 100vw, 1208px" className="object-cover" />
          <figcaption className="absolute right-5 bottom-[clamp(22px,4vw,48px)] left-[clamp(20px,4vw,48px)] z-[1] max-w-[460px]">
            <p className="eyebrow text-gold">{t.imageEyebrow}</p>
            <p className="mt-2.5 font-display text-[clamp(28px,3.4vw,42px)] leading-[1.15]">{t.imageCaption}</p>
          </figcaption>
        </Reveal>

        <ol className="m-0 mt-14 grid list-none p-0 min-[861px]:grid-cols-4">
          {t.steps.map((s) => (
            <Reveal
              as="li"
              key={s.title}
              className="border-t border-gold/35 py-6 min-[861px]:border-t-0 min-[861px]:border-l min-[861px]:px-7 min-[861px]:py-1.5"
            >
              <span className="font-display text-[22px] text-gold italic" aria-hidden="true">
                {s.n}
              </span>
              <h3 className="mt-2 text-[32px]">{s.title}</h3>
              <p className="mt-1.5 text-[16px] text-on-dark-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
