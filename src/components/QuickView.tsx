"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { content } from "@/data/content";
import type { Product } from "@/data/products";

type Props = {
  product: Product | null;
  onClose: () => void;
  onEnquire: (product: Product) => void;
};

/** Native modal <dialog>: the browser traps focus, makes the page inert and closes on Escape. */
export function QuickView({ product, onClose, onEnquire }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = content.collections.quickView;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="qvTitle"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="quick-view m-auto w-full max-w-[min(980px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-auto border-0 bg-cream p-0 text-ink"
    >
      {/* First in the DOM so it takes initial focus; sticky so it stays reachable when the dialog scrolls on phones */}
      <button
        type="button"
        onClick={() => ref.current?.close()}
        aria-label={t.close}
        className="sticky top-3 z-[2] mt-3 mr-3 -mb-11 ml-auto block h-11 w-11 cursor-pointer border-0 bg-paper text-[22px] text-ink"
      >
        ✕
      </button>
      {product && (
        <div className="grid min-[761px]:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
          <div className="relative h-[300px] min-[761px]:h-auto min-[761px]:min-h-[300px] min-[761px]:max-h-[620px]">
            <Image
              src={product.image}
              alt={product.alt}
              fill
              sizes="(max-width: 760px) 100vw, 520px"
              className="object-cover"
              style={product.imagePosition ? { objectPosition: product.imagePosition } : undefined}
            />
          </div>
          <div className="flex flex-col gap-3.5 p-6 min-[761px]:p-9">
            <p className="eyebrow">{t.eyebrow}</p>
            <h3 id="qvTitle" className="pr-10 text-[44px] leading-none">
              {product.title}
            </h3>
            <p className="text-muted">{product.description}</p>
            <dl className="my-2 grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-2 text-[15px]">
              <dt className="font-bold text-maroon">{t.material}</dt>
              <dd className="m-0 text-muted">{product.material}</dd>
              <dt className="font-bold text-maroon">{t.technique}</dt>
              <dd className="m-0 text-muted">{product.technique}</dd>
              <dt className="font-bold text-maroon">{t.sizes}</dt>
              <dd className="m-0 text-muted">{product.sizes}</dd>
              <dt className="font-bold text-maroon">{t.custom}</dt>
              <dd className="m-0 text-muted">{t.customValue}</dd>
            </dl>
            <div className="mt-auto flex flex-wrap gap-3">
              <button type="button" className="btn btn-solid" onClick={() => {
                  // Close first, so the browser's focus restore happens before we scroll to the form
                  ref.current?.close();
                  onEnquire(product);
                }}
              >
                {t.enquire}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
