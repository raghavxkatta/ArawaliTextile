import Image from "next/image";
import { content } from "@/data/content";
import { images } from "@/data/images";
import { CUSTOM_DESIGN } from "@/data/products";
import { EnquireLink } from "./EnquireLink";
import { Reveal } from "./Reveal";

export function CustomFeature() {
  const t = content.customFeature;
  return (
    <div className="mt-[72px] grid items-center gap-[clamp(36px,6vw,96px)] border-t border-blush-line pt-[72px] min-[861px]:grid-cols-2 [&>*]:min-w-0">
      <Reveal className="frame aspect-video">
        <Image src={images.printingBlocks} alt={t.imageAlt} fill sizes="(max-width: 860px) 100vw, 600px" className="object-cover" />
      </Reveal>
      <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <h3 className="mt-3.5 text-[clamp(40px,4.4vw,58px)] leading-[1.04]">{t.title}</h3>
        <p className="lede mt-3.5">{t.body}</p>
        <p className="mt-[22px]">
          <EnquireLink product={CUSTOM_DESIGN}>
            {t.link} <span aria-hidden="true">↗</span>
          </EnquireLink>
        </p>
      </Reveal>
    </div>
  );
}
