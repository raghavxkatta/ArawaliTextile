import { content } from "@/data/content";
import { Buta } from "./Buta";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  tone?: "maroon" | "light";
  label?: string;
  onClick?: () => void;
};

const sizes = {
  sm: { buta: 30, word: "text-[28px]" },
  md: { buta: 32, word: "text-[28px] min-[861px]:text-[32px]" },
  lg: { buta: 34, word: "text-[40px]" },
};

export function Logo({ size = "md", tone = "maroon", label, onClick }: LogoProps) {
  const s = sizes[size];
  return (
    <a
      href="#top"
      aria-label={label}
      onClick={onClick}
      className={`flex items-center gap-3 no-underline ${tone === "light" ? "text-white" : "text-maroon"}`}
    >
      <Buta size={s.buta} />
      <span>
        <b className={`block font-display font-medium leading-none ${s.word}`}>Arawali</b>
        <small className="mt-[5px] block text-[10px] font-bold tracking-[0.2em] whitespace-nowrap">
          {content.logoTagline}
        </small>
      </span>
    </a>
  );
}
