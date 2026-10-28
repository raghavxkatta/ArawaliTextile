import type { SVGProps } from "react";

type ButaProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  /** Any CSS colour. Defaults to the surrounding text colour. */
  color?: string;
  size?: number;
};

/** The Arawali flower motif: a three-petal bud on a stem with two leaves and a base line. */
export function Buta({ color, size = 40, style, ...rest }: ButaProps) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 40 60"
      aria-hidden="true"
      focusable="false"
      style={color ? { color, ...style } : style}
      {...rest}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20 5C13 10 13 18 20 23C27 18 27 10 20 5Z" fill="currentColor" stroke="none" />
        <path d="M20 23C12 23 8 16 11 11C14 14 17 18 20 23Z" fill="currentColor" stroke="none" />
        <path d="M20 23C28 23 32 16 29 11C26 14 23 18 20 23Z" fill="currentColor" stroke="none" />
        <path d="M20 23L20 51M20 40C13 39 10 34 9 29C14 30 18 34 20 40M20 35C27 34 30 29 31 25C26 26 22 29 20 35M11 53L29 53" />
      </g>
    </svg>
  );
}

/** Raw path data, for places that can't render React (OG image, favicon). */
export const BUTA_PATHS = {
  filled: [
    "M20 5C13 10 13 18 20 23C27 18 27 10 20 5Z",
    "M20 23C12 23 8 16 11 11C14 14 17 18 20 23Z",
    "M20 23C28 23 32 16 29 11C26 14 23 18 20 23Z",
  ],
  stroke: "M20 23L20 51M20 40C13 39 10 34 9 29C14 30 18 34 20 40M20 35C27 34 30 29 31 25C26 26 22 29 20 35M11 53L29 53",
};
