/** Lets the quick view and the custom-design link preselect a product in the enquiry form. */
export const PRODUCT_SELECT_EVENT = "arawali:select-product";

export function selectProduct(title: string, { scroll = false } = {}) {
  window.dispatchEvent(new CustomEvent<string>(PRODUCT_SELECT_EVENT, { detail: title }));
  if (!scroll) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  window.setTimeout(() => document.getElementById("f-name")?.focus({ preventScroll: true }), reduce ? 0 : 600);
}
