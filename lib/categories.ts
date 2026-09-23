export type Product = {
  id: string; name: string; category: string | null;
  image_url: string | null; stock: number; brand_id: string; created_at?: string;
  sku?: string | null; wholesale_price?: number | null;
};

export type SortKey = "price-desc" | "price-asc" | "name";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "name", label: "Name: A to Z" },
];

// Default: most expensive first (nulls last).
export function sortProducts<T extends { name: string; wholesale_price?: number | null }>(
  list: T[],
  sort: SortKey
): T[] {
  const arr = [...list];
  if (sort === "price-asc") arr.sort((a, b) => (a.wholesale_price ?? Infinity) - (b.wholesale_price ?? Infinity));
  else if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
  else arr.sort((a, b) => (b.wholesale_price ?? -Infinity) - (a.wholesale_price ?? -Infinity));
  return arr;
}

export const CATEGORIES: Record<string, { title: string }> = {
  "beauty": { title: "Beauty & Cosmetics" },
  "outdoor": { title: "Outdoor & Sports" },
  "home": { title: "Home & Living" },
  "electronics": { title: "Electronics" },
  "new-arrivals": { title: "New Arrivals" },
};

export function deriveCategory(cat: string | null, brandName: string): { parent: string | null; sub: string | null } {
  const c = (cat || "").toLowerCase();

  // SHEGLAM is a beauty/cosmetics brand — group all its items under "beauty",
  // using each product's category (Blush, Mascara, Lipstick…) as the sub.
  if (brandName === "SHEGLAM") {
    const sub = (cat || "").trim();
    return { parent: "beauty", sub: sub || "Cosmetics" };
  }

  const rules: [RegExp, string, string][] = [
    [/goggle|swim goggles|snorkeling mask|diving.*mask/, "outdoor", "Goggles & Masks"],
    [/sunglass|eyewear/, "outdoor", "Sunglasses & Eyewear"],
    [/helmet/, "outdoor", "Helmets"],
    [/backpack|bag/, "outdoor", "Backpacks & Bags"],
    [/paddle board|surfboard/, "outdoor", "Paddle Boards"],
    [/tent|canop|gazebo/, "outdoor", "Tents & Shelters"],
    [/glove/, "outdoor", "Gloves"],
    [/sock/, "outdoor", "Socks"],
    [/bicycle|cycling/, "outdoor", "Cycling"],
    [/climbing/, "outdoor", "Climbing"],
    [/water bottle/, "outdoor", "Bottles"],
    [/fins|snorkeling/, "outdoor", "Diving & Snorkeling"],
    [/lock/, "outdoor", "Locks"],
    [/vacuum accessor|filter|cleaning head|accessory kit/, "home", "Vacuum Accessories"],
    [/vacuum/, "home", "Vacuums"],
    [/floor|steam/, "home", "Floor & Steam Cleaners"],
    [/pool|spa/, "home", "Pool & Spa"],
    [/water filt|cartridge|plumbing/, "home", "Water Filtration"],
    [/kitchen|food/, "home", "Kitchen"],
    [/compressor|tools/, "home", "Tools"],
    [/charger|power adapter/, "electronics", "Chargers & Adapters"],
    [/batter/, "electronics", "Batteries"],
  ];
  for (const [re, parent, sub] of rules) {
    if (re.test(c)) return { parent, sub };
  }

  if (/sporting goods|outdoor recreation/.test(c) || brandName === "OutdoorMaster") return { parent: "outdoor", sub: "Other Outdoor" };
  if (/home & garden|household/.test(c) || brandName === "Vakume Home" || brandName === "RedKey") return { parent: "home", sub: "Other Home" };
  if (/electronic/.test(c)) return { parent: "electronics", sub: "Other Electronics" };

  return { parent: null, sub: null };
}

export function slugifySub(sub: string): string {
  return sub.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}