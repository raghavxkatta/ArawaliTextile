"use client";

import { selectProduct } from "@/lib/product-select";

/** A link to the enquiry form that also preselects a product. */
export function EnquireLink({ product, children }: { product: string; children: React.ReactNode }) {
  return (
    <a className="link" href="#contact" onClick={() => selectProduct(product)}>
      {children}
    </a>
  );
}
