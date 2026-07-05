export type Product = {
  id: string; name: string; category: string | null;
  image_url: string | null; stock: number; brand_id: string; created_at?: string;
};

export const CATEGORIES: Record<string, { title: string }> = {
  "outdoor": { title: "Outdoor & Sports" },
  "home": { title: "Home & Living" },
  "electronics": { title: "Electronics" },
  "new-arrivals": { title: "New Arrivals" },
};

export function deriveCategory(cat: string | null, brandName: string): { parent: string | null; sub: string | null } {
  const c = (cat || "").toLowerCase();

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