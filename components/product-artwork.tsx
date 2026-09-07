import Image from "next/image";
import { productArt, type ProductArtKind } from "@/lib/product-art";

export function ProductArtwork({ kind, className = "", large = false }: { kind: ProductArtKind; className?: string; large?: boolean }) {
  return <span className={`product-artwork ${className}`} aria-hidden="true"><Image loading={large ? "eager" : "lazy"} src={productArt[kind]} alt="" width={1254} height={1254} sizes={large ? "(max-width: 760px) 80vw, 440px" : "(max-width: 600px) 70vw, 280px"} /></span>;
}
