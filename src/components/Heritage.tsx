import Image from "next/image";
import { content } from "@/data/content";
import { images } from "@/data/images";
import { Buta } from "./Buta";

export function Heritage() {
  const t = content.heritage;
  return (
    <section id="heritage" className="section-pad">
      <div className="wrap grid items-center gap-[clamp(36px,6vw,96px)] min-[861px]:grid-cols-2 [&>*]:min-w-0">
        <div className="frame aspect-[1/1.05]">
          <Image src={images.artisanHands} alt={t.imageAlt} fill sizes="(max-width: 860px) 100vw, 600px" className="object-cover" />
        </div>
        <div>
          <Buta size={42} className="mb-5 text-maroon" />
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2">
            {t.title[0]}
            <br />
            <em>{t.title[1]}</em>
          </h2>
          <p className="lede mt-[26px]">{t.paragraphs[0]}</p>
          <p className="lede mt-3.5">{t.paragraphs[1]}</p>
          <dl className="mt-9 grid grid-cols-3 gap-[18px] border-t border-line pt-[26px]">
            {t.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-[13.5px] text-muted">{s.label}</dt>
                <dd className="m-0 font-display text-[42px] leading-none font-medium text-maroon tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
