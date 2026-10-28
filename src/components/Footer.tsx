import { cacheLife } from "next/cache";
import { content } from "@/data/content";
import { Logo } from "./Logo";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const t = content.footer;
  return (
    <footer className="bg-blush">
      <div className="wrap flex flex-wrap justify-between gap-10 pt-14 pb-9">
        <div>
          <Logo size="lg" />
          <p className="mt-5 font-display text-[28px] text-ink italic">{t.say}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-14 text-[15px]">
          <div className="grid content-start gap-2.5">
            <span className="eyebrow">{t.explore}</span>
            {content.nav.map((item) => (
              <a key={item.href} href={item.href} className="text-ink no-underline hover:text-maroon">
                {item.label}
              </a>
            ))}
          </div>
          <div className="grid content-start gap-2.5">
            <span className="eyebrow">{t.visit}</span>
            <span className="max-w-[220px] text-muted">{t.visitNote}</span>
          </div>
        </nav>
      </div>
      <div className="wrap border-t border-blush-line py-5 text-[13px] text-muted">
        © <CurrentYear /> {t.legal}
      </div>
    </footer>
  );
}
