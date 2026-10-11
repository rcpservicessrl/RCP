"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureInquiryCampaign } from "@/lib/commercial-intake";
export function InquiryCampaign() {
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => { captureInquiryCampaign(); }, [pathname, params]);
  return null;
}
