import { content } from "@/data/content";
import { site, whatsappUrl } from "@/data/site";
import { CopyButton } from "./CopyButton";
import { EnquiryForm } from "./EnquiryForm";
import { Reveal } from "./Reveal";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  "aria-hidden": true,
  className: "mt-1 flex-none text-maroon",
} as const;

export function Contact() {
  const t = content.contact;
  return (
    <section id="contact" className="section-pad pt-0!">
      <div className="wrap grid items-start gap-[clamp(36px,6vw,96px)] min-[861px]:grid-cols-2 [&>*]:min-w-0">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2">
            {t.title[0]}
            <br />
            <em>{t.title[1]}</em>
          </h2>
          <p className="lede mt-[22px]">{t.lede}</p>
          <address className="mt-[34px] grid gap-3.5 not-italic">
            <div className="flex items-start gap-3.5">
              <svg {...iconProps}>
                <rect x="3" y="5" width="18" height="14" rx="1" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              <span className="min-w-0 break-words">
                <a id="email" href={`mailto:${site.email}`} className="text-ink no-underline hover:text-maroon">
                  {site.email}
                </a>
                <CopyButton text={site.email} fallbackTargetId="email" />
              </span>
            </div>
            <div className="flex items-start gap-3.5">
              <svg {...iconProps}>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
              </svg>
              <span>
                <a id="phone" href={`tel:${site.phoneE164}`} className="text-ink no-underline hover:text-maroon">
                  {site.phoneDisplay}
                </a>
                <CopyButton text={site.phoneDisplay} fallbackTargetId="phone" /> ·{" "}
                <a href={whatsappUrl()} target="_blank" rel="noopener">
                  {t.whatsapp}
                </a>
              </span>
            </div>
            <div className="flex items-start gap-3.5 text-muted">
              <svg {...iconProps}>
                <path d="M12 21s-7-6.3-7-12a7 7 0 0 1 14 0c0 5.7-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span>{site.address.full}</span>
            </div>
          </address>
        </Reveal>
        <Reveal>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
