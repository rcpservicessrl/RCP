export async function boundedJson(message: Request | Response, maxBytes: number, timeoutMs = 2000): Promise<unknown> {
  if (!message.body) throw new Error('empty_body');
  const reader = message.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const read = async () => {
    const decoder = new TextDecoder();
    let size = 0;
    let body = '';
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) throw new Error('body_limit');
      body += decoder.decode(chunk.value, { stream: true });
    }
    return JSON.parse(body + decoder.decode());
  };
  try {
    return await Promise.race([read(), new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('body_timeout')), timeoutMs);
    })]);
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => undefined);
  }
}

export function pulsoJson(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}
