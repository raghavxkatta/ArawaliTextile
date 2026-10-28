import { images } from "./images";

export type ProductCategory = "home" | "table" | "wear" | "fabric";

export type Product = {
  slug: string;
  /** Full name, used in the quick view, the enquiry form and emails */
  title: string;
  /** Shorter heading for the grid card, if it differs from the title */
  cardTitle?: string;
  category: ProductCategory;
  image: string;
  alt: string;
  /** CSS object-position for the card crop */
  imagePosition?: string;
  shortDescription: string;
  description: string;
  material: string;
  technique: string;
  sizes: string;
};

export const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "home", label: "Bedroom" },
  { value: "table", label: "Table" },
  { value: "wear", label: "Wear" },
  { value: "fabric", label: "Fabric" },
];

export const categoryLabel: Record<ProductCategory, string> = {
  home: "Bedroom",
  table: "Table",
  wear: "Wear",
  fabric: "Fabric",
};

// TODO(owner): confirm which print styles are offered (Sanganeri, Bagru, Dabu…) and add them to `technique`.
export const products: Product[] = [
  {
    slug: "bedcovers-quilts",
    title: "Bedcovers & Quilts",
    category: "home",
    image: images.bedcover,
    alt: "A bed dressed in a cream bedcover with red floral prints in a rose-pink room",
    shortDescription: "Bedspreads, razai quilts and pillow covers.",
    description: "Hand-printed bedspreads, razai quilts, duvet and pillow covers in single, double, king and custom sizes.",
    material: "Cotton and cotton voile",
    technique: "Hand block print, quilted or flat",
    sizes: "Single, double, king or custom",
  },
  {
    slug: "table-linen",
    title: "Table Linen",
    category: "table",
    image: images.tableLinen,
    alt: "A dining table with a green and red block printed tablecloth, napkins and marigolds",
    shortDescription: "Tablecloths, runners, mats and napkins.",
    description: "Tablecloths, runners, placemats and napkins, printed in small batches and matched as sets.",
    material: "Cotton and cotton-linen",
    technique: "Hand block print",
    sizes: "Any table size, sets to order",
  },
  {
    slug: "nightwear",
    title: "Nightwear & Pyjama Sets",
    cardTitle: "Nightwear",
    category: "wear",
    image: images.nightsuitTeal,
    alt: "Model in a teal and pink block printed cotton pyjama set",
    imagePosition: "50% 30%",
    shortDescription: "Pyjama sets and night suits in printed cotton.",
    description: "Soft printed cotton pyjama sets and night suits with piped collars and cuffs.",
    material: "Soft cotton",
    technique: "Hand block print with piping",
    sizes: "XS to XXL or your size chart",
  },
  {
    slug: "robes-kimonos",
    title: "Robes & Kimonos",
    category: "wear",
    image: images.kimonoRobe,
    alt: "Indigo kimono robe with a white tree print and belt",
    shortDescription: "Kimono robes and wrap tops.",
    description: "Belted kimono robes and wrap tops in indigo, madder red and floral prints.",
    material: "Cotton",
    technique: "Hand block print",
    sizes: "Free size or your size chart",
  },
  {
    slug: "fabric-by-the-metre",
    title: "Fabric by the Metre",
    category: "fabric",
    image: images.fabricYellow,
    alt: "Yellow cotton with a large blue and pink floral block print",
    shortDescription: "Printed and yarn-dyed cotton for production.",
    description: "Printed and yarn-dyed cotton for your own production, in our designs or yours.",
    material: "Cotton, voile, cambric",
    technique: "Hand block or yarn-dyed",
    // TODO(owner): confirm minimum order quantity per colourway.
    sizes: "By the metre, minimums apply",
  },
  {
    slug: "embroidered-whites",
    title: "Embroidered Whites",
    category: "wear",
    image: images.chikanTop,
    alt: "White cotton tie-front top with white hand embroidery",
    shortDescription: "Voile tops and blouses, embroidered by hand.",
    description: "White cotton voile tops and blouses with hand embroidery and tie fronts.",
    material: "Cotton voile",
    technique: "Hand embroidery",
    sizes: "Your size chart",
  },
];

export const CUSTOM_DESIGN = "My own design";

/** Options for the enquiry form's product select, in the order buyers see them */
export const productOptions: string[] = [...products.map((p) => p.title), CUSTOM_DESIGN];
