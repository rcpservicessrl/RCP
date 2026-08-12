import type { Metadata } from "next";
import { parseQuoteReferences, QuoteReview } from "@/components/quote-review";

export const metadata: Metadata = {
  title: "Request review",
  description: "Review inherited references and continue to the RCP 360 Diagnosis without automatic prices or payments.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ items?: string; services?: string }> }) {
  const params = await searchParams;
  return <QuoteReview locale="en" references={parseQuoteReferences(params.items ?? params.services)} />;
}
