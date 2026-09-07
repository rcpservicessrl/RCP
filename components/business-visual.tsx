import Image from "next/image";
import type { Locale } from "@/lib/types";
import { ProductArtwork } from "./product-artwork";
import type { ProductArtKind } from "@/lib/product-art";
import { BusinessRouteMap } from "./business-route-map";

export function ConnectionDrawing({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return <svg className="connection-drawing" viewBox="0 0 480 340" aria-hidden="true" focusable="false">
    <circle className="connection-ring" cx="240" cy="172" r="131" />
    <circle className="connection-ring" cx="240" cy="172" r="100" />
    <g className="connection-paths" fill="none" stroke="currentColor" strokeWidth="2"><path d="M105 80H160Q180 80 180 100V147H210M376 88H320Q300 88 300 108V147H268M110 264H162Q180 264 180 246V200H210M374 264H318Q300 264 300 244V200H270" /></g>
    <g className="connection-core"><rect x="185" y="132" width="110" height="80" rx="20" fill="#fcb53f" /><text x="240" y="168" textAnchor="middle" fill="#162019" fontSize="24" fontWeight="700">RCP</text><text x="240" y="191" textAnchor="middle" fill="#162019" fontSize="11">{es ? "Una dirección" : "One direction"}</text></g>
    {[[105,80,es?"Procesos":"Processes"],[376,88,es?"Personas":"People"],[110,264,es?"Tecnología":"Technology"],[374,264,es?"Tu negocio":"Your business"]].map(([x,y,label], i) => <g className={`connection-node connection-node--${i}`} key={label}><rect x={Number(x)-61} y={Number(y)-25} width="122" height="50" rx="12" fill="#f6f5ed" /><circle cx={Number(x)-43} cy={Number(y)} r="4" fill={i===3?"#fcb53f":"#8fa96e"} /><text x={Number(x)+5} y={Number(y)+4} textAnchor="middle" fill="#243126" fontSize="11" fontWeight="600">{label}</text></g>)}
  </svg>;
}

const artByPage: Record<string, ProductArtKind> = { technology: "pos", catalog: "print", renewal: "erp", consulting: "consulting", advertising: "print", customSoftware: "saas", electronicInvoicing: "tax", resources: "web" };
const photoByPage: Record<string, string> = { about: "team", careers: "team", application: "team", sectors: "commerce", contact: "hero", diagnosis: "hero", media: "print" };

export function BusinessVisual({ kind = "services", locale }: { kind?: string; locale: Locale }) {
  const photo = photoByPage[kind];
  const art = artByPage[kind];
  const es = locale === "es";
  if (!photo && !art) return <BusinessRouteMap locale={locale} compact />;
  return <div className={`business-visual ${photo ? "business-visual--photo" : "business-visual--art"}`}>
    <span className="business-visual__eyebrow">{es ? "Conectamos lo que importa" : "Connect what matters"}</span>
    {photo ? <Image loading="eager" className="business-visual__photo" src={`/assets/editorial-v32/${photo}.webp`} alt="" width={800} height={900} sizes="(max-width: 760px) 90vw, 460px" /> : art ? <><ConnectionDrawing locale={locale} /><ProductArtwork kind={art} large /></> : <ConnectionDrawing locale={locale} />}
    <span className="business-visual__note"><span aria-hidden="true">↗</span><span>{es ? "Tu negocio marca la ruta." : "Your business sets the direction."}<small>{es ? "Personas · Procesos · Herramientas" : "People · Processes · Tools"}</small></span></span>
  </div>;
}
