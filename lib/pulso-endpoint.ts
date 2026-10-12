export function safePulsoEndpoint(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.workers.dev') || url.port || url.username || url.password || url.pathname !== '/answer' || url.search || url.hash) return null;
    return url.href;
  } catch { return null; }
}
