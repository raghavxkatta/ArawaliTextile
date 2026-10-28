import { ImageResponse } from "next/og";
import { BUTA_PATHS } from "@/components/Buta";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#7B1E26" }}>
        <svg width="92" height="138" viewBox="0 0 40 60">
          {BUTA_PATHS.filled.map((d) => (
            <path key={d} d={d} fill="#FAF6EF" />
          ))}
          <path d={BUTA_PATHS.stroke} fill="none" stroke="#FAF6EF" strokeWidth="2" />
        </svg>
      </div>
    ),
    size,
  );
}
