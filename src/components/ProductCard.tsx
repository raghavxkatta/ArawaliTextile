import Image from "next/image";
import { content } from "@/data/content";
import { categoryLabel, type Product } from "@/data/products";

type Props = {
  product: Product;
  hidden: boolean;
  onOpen: (product: Product, trigger: HTMLButtonElement) => void;
};

export function ProductCard({ product, hidden, onOpen }: Props) {
  return (
    <button
      type="button"
      hidden={hidden}
      onClick={(e) => onOpen(product, e.currentTarget)}
      aria-haspopup="dialog"
      className="card block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-inherit [font:inherit] [&[hidden]]:hidden"
    >
      <div className="frame aspect-[4/3]">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="object-cover"
          style={product.imagePosition ? { objectPosition: product.imagePosition } : undefined}
        />
        <span className="absolute top-3.5 left-3.5 bg-paper px-2.5 py-1.5 text-[12px] font-bold tracking-[0.12em] text-maroon uppercase">
          {categoryLabel[product.category]}
        </span>
        <span className="view absolute right-3.5 bottom-3.5 bg-maroon px-4 py-2.5 text-[14px] font-semibold text-white">
          {content.collections.viewDetails}
        </span>
      </div>
      <h3 className="mt-[18px] text-[34px]">{product.cardTitle ?? product.title}</h3>
      <p className="mt-1 text-muted">{product.shortDescription}</p>
    </button>
  );
}
