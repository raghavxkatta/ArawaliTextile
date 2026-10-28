import type { ComponentPropsWithoutRef, ElementType } from "react";

type RevealProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/**
 * Marks an element for the scroll-reveal lift. Renders fully visible on the
 * server; <RevealObserver /> only animates elements that start below the fold.
 */
export function Reveal<T extends ElementType = "div">({ as, ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag data-reveal="" {...rest} />;
}
