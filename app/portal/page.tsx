import type { Metadata } from "next";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";

export const metadata: Metadata = {
  title: "Área privada RCP",
  description: "Acceso separado para clientes y especialistas de RCP Services.",
  robots: { index: false, follow: false, nocache: true },
};

export default function PortalPage() {
  return (
    <InteriorShell locale="es">
      <section className="portal-placeholder"><div className="container portal-placeholder__card"><Pulso scene="idle" size="medium" label="Pulso acompaña el aviso de acceso privado" /><div><p className="section-eyebrow">Área privada</p><h1>El acceso externo todavía no está habilitado.</h1><p>RCP no está creando cuentas de clientes ni especialistas desde esta página. Cuando el entorno privado complete sus revisiones de seguridad, respaldo y acceso por invitación, cada persona autorizada recibirá instrucciones directas.</p><span className="status-chip">Acceso solo por invitación · Próximamente</span></div></div></section>
    </InteriorShell>
  );
}
