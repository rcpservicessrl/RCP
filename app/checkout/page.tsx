import type { Metadata } from "next";
import { parseQuoteReferences, QuoteReview } from "@/components/quote-review";

export const metadata: Metadata = {
  title: "Revisión de solicitud",
  description: "Revisa referencias heredadas y continúa al Diagnóstico RCP 360 sin precios ni pagos automáticos.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ items?: string; servicios?: string }> }) {
  const params = await searchParams;
  return <QuoteReview locale="es" references={parseQuoteReferences(params.items ?? params.servicios)} />;
}
