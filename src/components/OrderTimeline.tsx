import { content } from "@/data/content";
import { Reveal } from "./Reveal";

export function OrderTimeline() {
  const t = content.ordering;
  return (
    <section id="ordering" className="section-pad">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2">
            {t.title[0]}
            <em>{t.title[1]}</em>
          </h2>
        </Reveal>
        <ol className="timeline m-0 mt-[52px] grid list-none gap-[26px] p-0 min-[861px]:grid-cols-5 min-[861px]:gap-0">
          {t.steps.map((s) => (
            <Reveal as="li" key={s.title}>
              <b className="block font-display text-[28px] leading-[1.1] font-medium">{s.title}</b>
              <span className="mt-1.5 block text-[15px] text-muted">{s.body}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
