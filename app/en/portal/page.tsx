import type { Metadata } from "next";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";

export const metadata: Metadata = { title: "RCP private area", robots: { index: false, follow: false, nocache: true } };

export default function EnglishPortalPage() {
  return (
    <InteriorShell locale="en">
      <section className="portal-placeholder"><div className="container portal-placeholder__card"><Pulso scene="idle" size="medium" label="Pulso accompanies the private access notice" /><div><p className="section-eyebrow">Private area</p><h1>External access is not enabled yet.</h1><p>RCP is not creating client or specialist accounts from this page. Once the private environment completes its security, backup and invitation-only access reviews, each authorized person will receive direct instructions.</p><span className="status-chip">Invitation only · Coming later</span></div></div></section>
    </InteriorShell>
  );
}
