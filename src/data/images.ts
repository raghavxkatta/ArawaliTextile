/**
 * Every image path on the site lives here.
 * TODO(owner): these are low-resolution placeholders cropped from screenshots.
 * Replace the files in /public/images with real product photos (same names),
 * or point the paths below at new files.
 */
export const images = {
  heroHaveli: "/images/hero-haveli.jpg",
  artisanHands: "/images/h-hands.jpg",
  printingBlocks: "/images/h-blocks.jpg",
  bedcover: "/images/h-bed.jpg",
  tableLinen: "/images/h-table.jpg",
  textilePanels: "/images/h-textile.jpg",
  nightsuitTeal: "/images/nightsuit-teal.jpg",
  nightsuitTurquoise: "/images/hero-nightsuit.jpg",
  kimonoRobe: "/images/kimono-robe.jpg",
  wrapTop: "/images/wrap-top.jpg",
  chikanTop: "/images/chikan-top.jpg",
  fabricYellow: "/images/fabric-yellow.jpg",
  fabricBorder: "/images/fabric-border.jpg",
  fabricButa: "/images/fabric-buta.jpg",
  fabricPink: "/images/fabric-pink.jpg",
} as const;

export type GalleryItem = {
  image: string;
  alt: string;
  caption: string;
  /** CSS object-position, for photos whose subject is off-centre */
  position?: string;
};

export const gallery: GalleryItem[] = [
  { image: images.nightsuitTurquoise, alt: "Turquoise block printed night suit", caption: "Turquoise buta night suit", position: "50% 20%" },
  { image: images.wrapTop, alt: "Madder red paisley wrap top", caption: "Madder paisley wrap top" },
  { image: images.fabricBorder, alt: "Cotton with a pomegranate border and vine stripes", caption: "Pomegranate border fabric" },
  { image: images.kimonoRobe, alt: "Indigo tree print kimono robe", caption: "Indigo tree kimono" },
  { image: images.fabricButa, alt: "Magenta flower buta on striped white cotton", caption: "Magenta buta on stripe" },
  { image: images.textilePanels, alt: "Block printed cotton hanging in a courtyard", caption: "Red flower panels", position: "30% 50%" },
  { image: images.fabricPink, alt: "Small pink flowers printed on natural cotton", caption: "Pink poppy all-over print" },
];
