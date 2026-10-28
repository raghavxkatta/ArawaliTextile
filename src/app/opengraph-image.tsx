import { ImageResponse } from "next/og";
import { BUTA_PATHS } from "@/components/Buta";
import { content } from "@/data/content";

export const alt = content.meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MAROON = "#7B1E26";
const CREAM = "#FAF6EF";
const GOLD = "#D9A84E";

/** Loads a Google font as TTF for Satori. Falls back to the default font if offline. */
async function loadFont(family: string, weight: number, italic: boolean, text: string) {
  try {
    const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axis}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

function Buta({ color, width }: { color: string; width: number }) {
  return (
    <svg width={width} height={width * 1.5} viewBox="0 0 40 60">
      {BUTA_PATHS.filled.map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
      <path d={BUTA_PATHS.stroke} fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export default async function OpengraphImage() {
  const tag = "The soul of Jaipur, in every thread.";
  const labels = ["SINCE 1991", "JAIPUR · INDIA", "HAND BLOCK PRINTED IN JAIPUR"];
  const [regular, italic, sans] = await Promise.all([
    loadFont("Cormorant Garamond", 500, false, `Arawali${tag}`),
    loadFont("Cormorant Garamond", 500, true, "Textile"),
    loadFont("Manrope", 700, false, labels.join("")),
  ]);
  const fonts = [
    ...(regular ? [{ name: "Cormorant", data: regular, weight: 500 as const, style: "normal" as const }] : []),
    ...(italic ? [{ name: "Cormorant", data: italic, weight: 500 as const, style: "italic" as const }] : []),
    ...(sans ? [{ name: "Manrope", data: sans, weight: 700 as const, style: "normal" as const }] : []),
  ];
  const label = { display: "flex", fontFamily: "Manrope, sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 5 } as const;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: CREAM, fontFamily: "Cormorant, serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 360, background: MAROON, padding: "48px 40px", color: CREAM }}>
          <div style={label}>{labels[0]}</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Buta color={GOLD} width={150} />
          </div>
          <div style={label}>{labels[1]}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 72px", color: MAROON }}>
          <div style={{ ...label, fontSize: 18 }}>{labels[2]}</div>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 1, marginTop: 18 }}>Arawali</div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1, fontStyle: "italic" }}>Textile</div>
          <div style={{ display: "flex", width: 220, height: 2, background: GOLD, margin: "34px 0 26px" }} />
          <div style={{ display: "flex", fontSize: 40, color: "#1D2621" }}>{tag}</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
