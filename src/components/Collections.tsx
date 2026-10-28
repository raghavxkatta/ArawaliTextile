"use client";

import { useRef, useState } from "react";
import { content } from "@/data/content";
import { categories, products, type Product, type ProductCategory } from "@/data/products";
import { selectProduct } from "@/lib/product-select";
import { ProductCard } from "./ProductCard";
import { QuickView } from "./QuickView";

export function Collections({ children }: { children?: React.ReactNode }) {
  const t = content.collections;
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const [open, setOpen] = useState<Product | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const returnFocus = useRef(true);

  return (
    <section id="collections" className="section-pad bg-blush">
      <div className="wrap">
        <div data-reveal="" className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="h2">
              {t.title[0]}
              <em>{t.title[1]}</em>
            </h2>
          </div>
          <p className="lede max-w-[320px]">{t.lede}</p>
        </div>

        <div className="mt-9 flex flex-wrap gap-2.5" role="group" aria-label={t.filterLabel}>
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={filter === c.value}
              onClick={() => setFilter(c.value)}
              className="min-h-11 cursor-pointer border border-maroon bg-transparent px-5 text-[14.5px] font-semibold text-maroon transition-colors duration-200 hover:bg-maroon hover:text-white aria-pressed:bg-maroon aria-pressed:text-white"
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-9 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-8 gap-y-11">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              hidden={filter !== "all" && p.category !== filter}
              onOpen={(product, el) => {
                trigger.current = el;
                returnFocus.current = true;
                setOpen(product);
              }}
            />
          ))}
        </div>

        {children}
      </div>

      <QuickView
        product={open}
        onClose={() => {
          setOpen(null);
          if (returnFocus.current) trigger.current?.focus({ preventScroll: true });
        }}
        onEnquire={(product) => {
          returnFocus.current = false;
          selectProduct(product.title, { scroll: true });
        }}
      />
    </section>
  );
}
