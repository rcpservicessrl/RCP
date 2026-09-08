import { headers } from "next/headers";

type JsonLdProps = { data: unknown };

export async function JsonLd({ data }: JsonLdProps) {
  const nonce = (await headers()).get("x-csp-nonce") ?? undefined;
  const serialized = typeof data === "string" ? data : JSON.stringify(data);
  const safeSerialized = serialized.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: safeSerialized }} />;
}
