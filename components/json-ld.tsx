type JsonLdProps = { data: unknown };

export function JsonLd({ data }: JsonLdProps) {
  const serialized = typeof data === "string" ? data : JSON.stringify(data);
  const safeSerialized = serialized.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeSerialized }} />;
}
