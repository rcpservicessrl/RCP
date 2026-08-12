import type { PillarId } from "@/lib/types";

interface CatalogIconProps {
  id: string;
  category: string;
  pillar: PillarId;
}

const variantFor = (id: string, category: string) => {
  const value = `${id} ${category}`;
  if (/web|digital|seo|crm|analitica|automatizacion/.test(value)) return "digital";
  if (/impresos|exterior|merchandising|etiquetas|uniformes|papeleria/.test(value)) return "print";
  if (/legal|fiscal|impositiva|contabilidad|documentos|riesgo|laboral/.test(value)) return "document";
  if (/marca|identidad|experiencia|contenido|campanas/.test(value)) return "brand";
  return "operations";
};

export function CatalogIcon({ id, category, pillar }: CatalogIconProps) {
  const variant = variantFor(id, category);

  return (
    <span className={`catalog-icon catalog-icon--${pillar}`} aria-hidden="true">
      <svg viewBox="0 0 96 72" role="presentation">
        <path className="catalog-icon__shadow" d="M18 58 48 42l30 16-30 10-30-10Z" />
        {variant === "digital" && (
          <>
            <rect className="catalog-icon__surface" x="18" y="12" width="60" height="42" rx="7" />
            <path className="catalog-icon__line" d="M24 22h48M31 34h13v12H31zM50 31h20M50 38h16M50 45h11" />
            <circle className="catalog-icon__accent" cx="27" cy="18" r="2" />
          </>
        )}
        {variant === "print" && (
          <>
            <path className="catalog-icon__surface" d="m25 20 35-9 12 13-35 10-12-14Z" />
            <path className="catalog-icon__surface catalog-icon__surface--back" d="m37 34 35-10v27L37 62V34Z" />
            <path className="catalog-icon__line" d="m25 20 12 14v28L25 48V20Zm19 20 20-6M44 47l16-5" />
            <path className="catalog-icon__accent" d="m48 17 10-2 5 6-10 3-5-7Z" />
          </>
        )}
        {variant === "document" && (
          <>
            <path className="catalog-icon__surface" d="M27 9h31l12 12v41H27V9Z" />
            <path className="catalog-icon__line" d="M58 9v13h12M36 32h25M36 40h25M36 48h15" />
            <circle className="catalog-icon__accent" cx="65" cy="55" r="10" />
            <path className="catalog-icon__check" d="m60 55 3 3 6-7" />
          </>
        )}
        {variant === "brand" && (
          <>
            <path className="catalog-icon__surface" d="M23 23h31l17 12-31 19-17-11V23Z" />
            <path className="catalog-icon__line" d="m23 23 17 12 31-12M40 35v19" />
            <circle className="catalog-icon__accent" cx="57" cy="23" r="13" />
            <path className="catalog-icon__check" d="M51 23h12M57 17v12" />
          </>
        )}
        {variant === "operations" && (
          <>
            <circle className="catalog-icon__surface" cx="46" cy="34" r="21" />
            <path className="catalog-icon__line" d="M46 22v12l9 6M26 34h-7M73 34h-7M46 13V7" />
            <path className="catalog-icon__accent" d="M66 15h12v12H66z" />
            <path className="catalog-icon__check" d="m69 21 3 3 5-7" />
          </>
        )}
      </svg>
    </span>
  );
}
