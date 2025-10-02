### Next.js Portfolio – Technical Documentation

#### Overview
This app renders projects discovered by your Python scanner. It reads `projects.json` and displays:
- A project grid on `/`
- Individual project pages at `/projects/[slug]`
- Markdown READMEs with code highlighting
- Screenshots and logos served directly from the scanner’s data folder

The app is designed to run with your existing CLI workflow and without copying data during development.

---

## Project Structure (key files)

- `app/page.jsx`: Homepage; renders the project grid.
- `app/projects/[slug]/page.jsx`: Project detail route with static params and README rendering.
- `app/portfolio-data/projects.json/route.js`: Serves `../portfolio_cli/portfolio-data/projects.json` during dev.
- `app/portfolio-data/assets/[...path]/route.js`: Streams files from `../portfolio_cli/portfolio-data/assets/*` during dev.
- `components/ProjectCard.jsx`: Card UI for a single project.
- `components/ProjectGrid.jsx`: Responsive grid rendering the card list.
- `lib/projects.jsx`: Data loader; reads JSON from filesystem or via route; provides helpers.
- `lib/markdown.tsx`: Markdown renderer with GFM + Prism syntax highlighting.
- `next.config.mjs`: Image optimization disabled for static assets (`unoptimized: true`).
- `jsconfig.json`: Path alias `@/*` → project root.

---

## Data Model and Source

- Expected input: `projects.json` from the scanner
  - Currently exported as a root-level JSON array of projects.
  - The loader also supports an object shape `{ meta, projects: [...] }`.
- Assets: `portfolio-data/assets/` holds `screenshots`, `logo`, `thumbnail`, etc.

During development (`npm run dev`), the frontend reads directly from your repository’s `../portfolio_cli/portfolio-data` folder via:
- `/portfolio-data/projects.json` → `app/portfolio-data/projects.json/route.js`
- `/portfolio-data/assets/*` → `app/portfolio-data/assets/[...path]/route.js`

This avoids any copy/sync step and mirrors your README workflow.

---

## Data Loading (`lib/projects.jsx`)

Exports:
- `getProjects()`: Returns an array of projects.
- `getProjectBySlug(slug)`: Returns a single project or `null`.
- `getProjectSlugs()`: Returns an array of slugs.
- `getMeta()`: Returns meta if present, otherwise `{}`.

Resolution strategy:
- During SSR/build: tries reading `../portfolio_cli/portfolio-data/projects.json` from disk.
- Fallback: fetches from `GET /portfolio-data/projects.json` (served by the app route).
- Handles both a root array and `{ meta, projects }`.

Environment:
- If you deploy and need cross-origin fetching, set `NEXT_PUBLIC_SITE_URL` so the route fetch uses an absolute base URL.

---

## Routes and Rendering

- Homepage (`app/page.jsx`)
  - Calls `getProjects()` server-side.
  - Renders `OfficialProjects` section if curated selection exists, and full `ProjectGrid`.
- Project detail (`app/projects/[slug]/page.jsx`)
  - `generateStaticParams()` uses `getProjectSlugs()` for static params.
  - Uses async `params` per Next.js 15: destructures `slug` from `await params`.
  - Loads the project and renders:
    - Basic metadata (framework/language)
    - Screenshot gallery if available
    - README markdown via `MarkdownRenderer`

Notes for Next.js 15:
- Dynamic route params must be awaited: `const { slug } = (await params) || {};`
- This change removes the “params should be awaited” warning.

---

## Markdown Rendering (`lib/markdown.tsx`)

- Uses `react-markdown` with `remark-gfm` for GitHub-flavored markdown.
- Uses Prism via `react-syntax-highlighter` with the `oneDark` theme for fenced code blocks.
- Inline code renders with a simple `<code>`.

If your README contains raw HTML you want to render, add `rehype-raw` and wire it in (opt-in, security-sensitive).

---

## Components

- `ProjectCard.jsx`
  - Displays name, featured badge, framework/language, preview text, updated date, and first available image (`thumbnail` → `logo` → first screenshot).
  - Links to `/projects/[slug]`.

- `ProjectGrid.jsx`
  - Renders responsive grid of `ProjectCard`.
  - Gracefully handles empty lists.

You can add a `FilterBar` later to enable search/filter/sort (tags, language, type, date, priority).

---

## Assets Handling

- The project page and cards reference asset paths as they appear in `projects.json` (e.g. `assets/...`).
- Dev routes map these to the repo’s `../portfolio_cli/portfolio-data/assets/*` so `<img src={`/${src}`}>` works without copying.
- `next.config.mjs` sets `images.unoptimized = true`, which is friendlier for static assets or if you later switch to `next/image`.

Production note:
- For a static deploy, you’ll either:
  - Copy `portfolio-data` into `public/portfolio-data` during your CI build, or
  - Keep the route-based serving if the server can mount the data directory in production.

---

## Configuration

- `next.config.mjs`
  - `images.unoptimized: true` to avoid Next’s image optimizer for local dev/static export scenarios.

- `jsconfig.json`
  - Path alias: `@/*` simplifies imports like `@/lib/projects`.

Optional environment variable:
- `NEXT_PUBLIC_SITE_URL` to set the absolute base when reading via route in non-local environments.

---

## Development Workflow

Terminal 1 (scanner):
- `python3 portfolio.py generate` or `python3 portfolio.py update`
  - This writes `portfolio_cli/portfolio-data/projects.json` and asset files inside the `portfolio_cli` folder.

Terminal 2 (frontend):
- `cd /home/jake/Desktop/portfolio_ops/mi_portfolio`
- `npm run dev`
- Visit `/` to see projects; click through to `/projects/[slug]`.

The dev server watches your Next.js code; the API routes read fresh JSON and files from `../portfolio-data` when your scanner updates them.

---

## Common Maintenance Tasks

- Add fields to UI:
  - Update `ProjectCard.jsx` and/or `app/projects/[slug]/page.jsx` to render additional fields (e.g., commit count, category).
- Change data shape:
  - `lib/projects.jsx` is the only place to adjust parsing for different JSON structures.
  
- Curation workflow:
  - `app/curate/page.jsx` provides a UI to select official projects.
  - `app/official-projects/route.js` persists selections to `../portfolio_cli/portfolio-data/official-projects.json`.
  - `lib/official.js` provides `getOfficialSlugs()` and `getOfficialProjects()`.
  - `components/OfficialProjects.jsx` renders curated projects on the homepage.
- Add filtering/sorting:
  - Create `components/FilterBar.jsx` (client component) and apply filters to the list before passing to `ProjectGrid`.
- Improve SEO:
  - Update `app/layout.jsx` `metadata`, add per-project `generateMetadata` in `[slug]/page.jsx`.
- Production build:
  - If using static hosting, add a CI step to copy `portfolio-data` into `public/portfolio-data` before `next build`, or keep server routes and mount the data.

---

## Troubleshooting

- “params should be awaited” warning on dynamic route:
  - Ensure `const { slug } = (await params) || {};` in `app/projects/[slug]/page.jsx`.

- Projects list empty:
  - Verify `portfolio-data/projects.json` exists and is valid JSON.
  - Visit `/portfolio-data/projects.json` directly; should return your projects array.

- Images not loading:
  - Hit `/portfolio-data/assets/...` in the browser; verify it returns the file.
  - Check `projects.json` asset paths match files within `portfolio-data/assets`.

- Syntax highlighting not applied:
  - Ensure code blocks in README use fenced syntax with language tags (e.g. ```js).

---

## Extension Points

- Search and filters: tags, language, type, last commit date, featured.
- Image gallery: lightbox, larger previews, on-demand loading.
- Pagination or infinite scroll for many projects.
- Badges: `has_tests`, `has_ci`, `documentation_completeness`.
- External links: `git.remote_url`, live demos, etc.
- Static export: set `output: 'export'` if you move to a purely static site and ensure assets are under `public/`.

---

## Dependencies

- Required: `react-markdown`, `remark-gfm`, `react-syntax-highlighter`
- Optional: `rehype-raw` (render raw HTML), `date-fns` (date formatting), `fuse.js` (search)


