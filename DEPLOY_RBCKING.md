# Deploy rbcking.dpdns.org - Ready

Dist built with root base `/` for custom domain (vite.config.ts:7 GH_PAGES logic).

## Option 1: Cloudflare Pages (Free, Recommended for static)
1. https://dash.cloudflare.com -> Pages -> Create -> Upload `dist/` or Connect Git `europass-cv-editor`
   Build: `npm run build` (no GH_PAGES env)
   Output: `dist`
2. Pages -> Custom domain -> Add `rbcking.dpdns.org`
   Cloudflare shows target: e.g. `rbcking.pages.dev` or `abc.pages.dev`
3. DigitalPlat: https://dashboard.digitalplat.org/domains/rbcking.dpdns.org -> DNS -> Add:
   Type: CNAME | Host: @ or rbcking | Value: `<your>.pages.dev` | TTL 300
   Or if Cloudflare gives you `CNAME` flattening, use as instructed.
4. Wait 5 min, verify: `dig rbcking.dpdns.org +short` should return Cloudflare IP / CNAME

CLI alt:
```
npx wrangler pages deploy dist --project-name=rbcking
```

## Option 2: Vercel (Full-stack with server/research.mjs)
1. `npm i -g vercel && vercel --prod` (choose dist)
   Or Vercel Dashboard -> Add New Project -> Import Git
2. Vercel -> Settings -> Domains -> Add `rbcking.dpdns.org` -> shows `cname.vercel-dns.com`
3. DigitalPlat DNS: CNAME `rbcking` -> `cname.vercel-dns.com`
   Vercel auto-provisions HTTPS.

## For GitHub Pages custom domain (static only, no API)
1. GitHub repo Settings -> Pages -> Custom domain: `rbcking.dpdns.org`
   Creates `dist/CNAME` automatically (alternative: echo "rbcking.dpdns.org" > dist/CNAME)
2. Build with GH_PAGES=true: already fixed in .github/workflows/deploy-pages.yml:31
3. DigitalPlat DNS:
   Option A (CNAME): `CNAME @ -> <username>.github.io`  (if apex allowed)
   Option B (A): `A @ -> 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153`

## Verify
```
dig rbcking.dpdns.org +short
curl -I https://rbcking.dpdns.org
```

Current dist is ready at `dist/` with `/assets/...` (root). Push to Git or upload.

Note: `server/research.mjs` API needs Node hosting. For full research feature, use Vercel Functions or host server on Render/Fly and set `VITE_API_URL=https://api.rbcking.dpdns.org`
