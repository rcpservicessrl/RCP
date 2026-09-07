import type { PillarId } from "@/lib/types";
import { catalogArt } from "@/lib/product-art";
import { ProductArtwork } from "./product-artwork";

export function CatalogIcon({ id, category, pillar }: { id: string; category: string; pillar: PillarId }) {
  return <ProductArtwork kind={catalogArt(id, category, pillar)} className={`catalog-icon catalog-icon--${pillar}`} />;
}
