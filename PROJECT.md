# Profile Card Worker

Cloudflare Workers + Hono JSX で、GitHubプロフィール向けの SVG カードを返す小さなプロジェクトです。

## Setup

```bash
npm install
cp .dev.vars.example .dev.vars
# .dev.vars の GITHUB_TOKEN を設定
```

`src/config.ts` の `github.username` を自分のユーザー名に変更してください。

## Run

```bash
npm run dev
```

- `http://127.0.0.1:8787/card.svg`
- `http://127.0.0.1:8787/card.svg?layout=compact&theme=dark`

## Deploy

```bash
npx wrangler secret put GITHUB_TOKEN
npm run deploy
```
