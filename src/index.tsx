/** @jsxImportSource hono/jsx */
import { Hono } from "hono"
import { renderToString } from "hono/jsx/dom/server"
import { config } from "./config"
import { getCachedSvg, putCachedSvg } from "./lib/cache"
import { fetchGitHubCardData } from "./providers/github"
import { Card } from "./render/Card"
import type { CardLayout, CardThemeName } from "./render/types"

type Bindings = {
  GITHUB_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get("/", (c) => c.redirect("/card.svg", 302))

app.get("/card.svg", async (c) => {
  const token = c.env.GITHUB_TOKEN
  if (!token) {
    return c.text("Missing GITHUB_TOKEN secret", 500)
  }

  const request = c.req.raw
  const cached = await getCachedSvg(request)
  if (cached) {
    return cached
  }

  const layoutParam = c.req.query(config.card.layoutParam)
  const userAgent = c.req.header("user-agent") ?? ""
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|BlackBerry|Opera Mini|IEMobile/i.test(userAgent)
  const layout: CardLayout =
    layoutParam === "compact" ? "compact" : layoutParam === "default" ? "default" : isMobile ? "compact" : "default"
  const themeParam = c.req.query(config.card.themeParam)
  const themeName: CardThemeName = themeParam === "dark" ? "dark" : "light"

  try {
    const data = await fetchGitHubCardData(token)
    const svg = renderToString(<Card data={data} layout={layout} themeName={themeName} />)
    const response = new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": `public, max-age=${config.cache.ttlSeconds}`
      }
    })

    c.executionCtx.waitUntil(putCachedSvg(request, response.clone(), { ttlSeconds: config.cache.ttlSeconds }))
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const fallbackSvg = renderToString(
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
        <rect width="1200" height="720" fill="#10213a" />
        <text x="80" y="140" fill="#f6f7fb" font-size="44" font-family="sans-serif" font-weight="700">
          GitHub Card
        </text>
        <text x="80" y="210" fill="#dce4f2" font-size="24" font-family="sans-serif">
          Failed to load data
        </text>
        <text x="80" y="260" fill="#a9b8d0" font-size="18" font-family="monospace">
          {message}
        </text>
      </svg>
    )
    return new Response(fallbackSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store"
      }
    })
  }
})

export default app
