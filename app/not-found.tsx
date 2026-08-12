import Link from "next/link";
import { Pulso } from "@/components/pulso";

export default function NotFound() {
  return (
    <main className="not-found"><div><Pulso scene="consider" size="medium" /><p className="section-eyebrow">Ruta no encontrada</p><h1>Esta página no forma parte del recorrido actual.</h1><p>Pulso puede ayudarte a encontrar un servicio, capacidad o acceso vigente.</p><Link className="button button--primary" href="/">Volver al inicio</Link></div></main>
  );
}
