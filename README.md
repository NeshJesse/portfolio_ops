## Portfolio-OPs + mi_portfolio

Build a living, auto-updating developer portfolio with zero manual data entry.

### What it is
- **Portfolio-OPs (Python CLI)** scans your Desktop (or any path), detects real projects, extracts metadata/README/screenshots/git stats, and exports a clean `projects.json` + assets.
- **mi_portfolio (Next.js app)** renders that data into a fast, modern portfolio site: project grid, detail pages, markdown README, and screenshots.

Together, they turn your actual work into a polished, always-current portfolio.

### Why you’ll love it
- **Zero copy-paste**: Your READMEs become project descriptions automatically.
- **Always up-to-date**: One command refreshes data; the site reflects changes instantly in dev.
- **Real signals**: Git activity, tags, categories, screenshots—no fluff.
- **Own your data**: Plain JSON + local assets. Portable, inspectable, versionable.

### How it works (concept)
1) You code as usual in your local projects.
2) Portfolio-OPs scans and exports data to `portfolio-data/`:
   - `portfolio-data/projects.json`
   - `portfolio-data/assets/` (screenshots, logos, thumbnails)
3) mi_portfolio reads this data and renders your site:
   - `/` → Project grid
   - `/projects/[slug]` → Detail page with README and gallery

### Quick start
```bash
# 1) Install Python deps
pip3 install -r requirements.txt

# 2) First-time setup
python3 portfolio.py init

# 3) Generate data
python3 portfolio.py generate      # or: python3 portfolio.py update

# 4) Run the frontend
cd mi_portfolio
npm install
npm run dev
# Open http://localhost:3000
```

In development, the frontend reads directly from `portfolio-data/` (no copy step).

### Daily workflow
```bash
# Work on projects as usual, commit, push...

# Refresh portfolio data
python3 portfolio.py update

# Frontend is already running at http://localhost:3000
# Refresh the browser to see changes
```

### Features at a glance
- Auto-detection of project types (JS/Python/etc.)
- README → Markdown rendering with code highlighting
- Screenshots and logos gallery
- Git stats: last commit, commit count, branch
- Featured flags, categories, tags
- Extensible UI (filters, search, badges)

### Production options
- Copy `portfolio-data/` into `mi_portfolio/public/portfolio-data/` during CI
- Or keep server routes that read from a mounted `portfolio-data/` directory

### Customize
- Update cards and detail UI in `mi_portfolio/components/` and `app/`
- Adjust data parsing in `mi_portfolio/lib/projects.jsx`
- Add filters/search, badges, and layout to fit your brand

### Where to look next
- `portfolio_ops/` → Scanner logic, detectors, README parsing, git analysis
- `portfolio-data/` → Output JSON + assets
- `mi_portfolio/tech.md` → Deep technical docs for the frontend

Build once, keep shipping—your portfolio stays fresh.

**Happy Portfolio Building! 🚀**