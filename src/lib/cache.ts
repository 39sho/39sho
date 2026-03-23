type CacheOptions = {
  ttlSeconds: number
}

export async function getCachedSvg(request: Request): Promise<Response | null> {
  const cache = (caches as CacheStorage & { default: Cache }).default
  const cached = await cache.match(request)
  return cached ?? null
}

export async function putCachedSvg(request: Request, response: Response, options: CacheOptions): Promise<void> {
  const cache = (caches as CacheStorage & { default: Cache }).default
  const headers = new Headers(response.headers)
  headers.set("Cache-Control", `public, max-age=${options.ttlSeconds}`)
  const cacheable = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
  await cache.put(request, cacheable)
}
