## mi_portfolio (Next.js) – Frontend for Portfolio-OPs

This Next.js app renders projects discovered by the Python scanner in `../portfolio_ops`. It reads `projects.json` and assets produced by the scanner and provides:

- Project grid at `/`
- Project detail pages at `/projects/[slug]`
- README markdown rendering with code highlighting
- Direct access to screenshots/logos from the scanner output

### How it integrates with Portfolio-OPs

- The Python CLI (in `../portfolio_ops`) generates data into `../portfolio-data/`:
  - `../portfolio-data/projects.json`
  - `../portfolio-data/assets/`
- During development, this frontend serves those files directly via app routes:
  - `GET /portfolio-data/projects.json` → reads `../portfolio-data/projects.json`
  - `GET /portfolio-data/assets/*` → streams from `../portfolio-data/assets/*`
- No manual copy step is required for `npm run dev`.

### Development

Terminal 1 (scanner):
```bash
cd /home/jake/Desktop/portfolio_ops
python3 portfolio.py generate   # or: python3 portfolio.py update
```

Terminal 2 (frontend):
```bash
cd /home/jake/Desktop/portfolio_ops/mi_portfolio
npm run dev
# Open http://localhost:3000
```

As the scanner updates `../portfolio-data`, the frontend reads the latest JSON/assets on refresh.

### Key files

- `app/page.jsx` – Renders project grid using `getProjects()`
- `app/projects/[slug]/page.jsx` – Detail page (awaits dynamic params per Next.js 15)
- `app/portfolio-data/projects.json/route.js` – Serves scanner JSON in dev
- `app/portfolio-data/assets/[...path]/route.js` – Serves scanner assets in dev
- `components/ProjectCard.jsx`, `components/ProjectGrid.jsx` – UI components
- `lib/projects.jsx` – Data loader with FS-first, route fallback
- `lib/markdown.tsx` – Markdown renderer (GFM + Prism highlighting)
- `next.config.mjs` – `images.unoptimized = true` to keep static-friendly

### Data expectations

- `projects.json` can be either:
  - A root-level array: `[ { id, name, slug, metadata, readme, assets, git, ... } ]`
  - Or an object: `{ meta, projects: [ ... ] }`
- Assets referenced in JSON must exist under `../portfolio-data/assets/`.

### Production notes

- If deploying statically, copy `portfolio-data/` into `public/portfolio-data/` at build time, or keep the route-based approach and mount the data directory alongside the server.
- Optionally set `NEXT_PUBLIC_SITE_URL` if the app needs an absolute base URL when fetching its own routes.

### Troubleshooting

- Dynamic params warning: ensure `const { slug } = (await params) || {};` in `app/projects/[slug]/page.jsx`.
- Empty list: verify `../portfolio-data/projects.json` exists and open `/portfolio-data/projects.json` in browser.
- Broken images: open `/portfolio-data/assets/...` directly; ensure paths in JSON match files on disk.

### More docs

See `tech.md` in this folder for detailed architecture and maintenance guidance.
