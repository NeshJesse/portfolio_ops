## Portfolio-OPs – Implementation Status

### Version
- Date: 2025-09-30
- Scope: Initial implementation of core modules to enable scanning, metadata extraction, and data export.

### Overview
This document summarizes the technical implementation added to complete the core functionality described in the README. The following Python modules and files were implemented or updated:

- `portfolio_ops/config.py`
- `portfolio_ops/data_manager.py`
- `portfolio_ops/detectors.py`
- `portfolio_ops/readme_parser.py`
- `portfolio_ops/asset_finder.py`
- `portfolio_ops/git_analyzer.py`
- `requirements.txt`

The existing `portfolio.py` (CLI) and `portfolio_ops/scanner.py` were used as-is; the new modules integrate with their expected interfaces.

### High-Level Data Flow
1. CLI (`portfolio.py`) invokes full or incremental scanning.
2. `PortfolioScanner` discovers project directories and orchestrates per-project extraction:
   - `LanguageDetector.detect` (language/framework/type/tags)
   - `ReadmeParser.parse` (content, preview, headings, demo link)
   - `AssetFinder.find_assets` (screenshots/logo/thumbnail)
   - `GitAnalyzer.analyze` (repo metadata)
   - Internal stats calculation and display metadata
3. `DataManager` writes `projects.json` and persists `cache.json` for incremental updates.

### Module Details

#### Config (`portfolio_ops/config.py`)
- Responsibilities:
  - Provide defaults matching README (root path, ignored dirs, output settings, etc.)
  - Load optional overrides from `portfolio-config.yaml`
  - Expose resolved attributes: `root_path`, `max_depth`, `ignore_dirs`, `file_patterns`, `output_dir`, `copy_assets`, `max_asset_size_mb`, `screenshot_dirs`, `auto_feature_threshold`, `default_category`, `visibility_rules`
  - `save_default_config(path)` writes a default YAML to bootstrap local configuration.
- Notable defaults:
  - `scanner.root_path`: `~/Desktop`
  - `output.data_dir`: `./portfolio-data`
  - Common ignore dirs: `node_modules`, `venv`, `.git`, `build`, `dist`, `__pycache__`

#### Data Manager (`portfolio_ops/data_manager.py`)
- Files:
  - `projects.json`: a JSON array of project objects (backward-compatible with a future `{ meta, projects }` envelope)
  - `cache.json`: object with a `projects` map keyed by absolute project path
- API:
  - `export_projects(projects)` / `save_projects(projects)`
  - `load_projects()` → `List[Dict]`
  - `load_cache()` → `Dict[path, { last_modified, last_scanned, project_data }]`
  - `save_cache(projects)` builds the above map from the latest scan
- Notes:
  - Ensures `output_dir` and `assets/` exist
  - Uses UTF-8, pretty-printed JSON

#### Detectors (`portfolio_ops/detectors.py`)
- Implements `LanguageDetector.detect(directory) → Optional[Dict]` returning:
  - `language`, `framework`, `type`, `tags`
- Heuristics:
  - JavaScript/Node via `package.json` and dependency checks for React/Next, Vue, Svelte; Express/Koa/Fastify imply API
  - Python via presence of `requirements.txt`/`setup.py`/`pyproject.toml` and optional framework detection (Flask/FastAPI/Django)
  - Flutter (`pubspec.yaml`), Rust (`Cargo.toml`), Go (`go.mod`), Java (`pom.xml`/`build.gradle`), Ruby (`Gemfile`), PHP (`composer.json`), C# (`*.csproj`)
- Conservative fallbacks when parsing fails

#### README Parser (`portfolio_ops/readme_parser.py`)
- `parse(directory)` returns a structure with:
  - `exists`, `path`, `content`, `preview` (first non-heading paragraph), `headings` (up to 20), `has_demo`, `demo_url`, `word_count`
- Finds common README filename variants
- Extracts demo URL via simple regex heuristics (e.g., lines mentioning demo/live/preview or badge links)

#### Asset Finder (`portfolio_ops/asset_finder.py`)
- `find_assets(directory, output_dir)` returns:
  - `screenshots`: first 20 images found under: `screenshots/`, `docs/images/`, `assets/`, `.github/images/`
  - `logo`: common names like `logo.png`, `icon.svg`, etc.
  - `thumbnail`: picks `logo` if available, else first screenshot
- Note: Currently returns source file paths. Copying into `output_dir/assets/<slug>/` can be added where needed.

#### Git Analyzer (`portfolio_ops/git_analyzer.py`)
- Uses GitPython when available, otherwise returns `is_repo=False` safely
- Returns:
  - `is_repo`, `remote_url`, `last_commit` ISO, `first_commit` ISO, `total_commits`, `branch`, `is_archived` (placeholder `False`)
- Handles detached HEAD and repositories without remotes

### Scanner Integration Notes
- `PortfolioScanner._detect_project` composes detection results with README/assets/git data and internal stats
- `timestamps.modified` uses directory mtime; `timestamps.last_scanned` uses `datetime.now().isoformat()`
- `DataManager.save_cache` stores `last_modified` as the same ISO string; incremental scanning compares ISO strings for equality/ordering (consistent format assumed)

### Cache Schema
```
cache.json
- last_scan: null | ISO string (reserved)
- projects: {
    "/abs/path/to/project": {
      "last_modified": "2025-09-30T10:30:00.000000",
      "last_scanned": "2025-09-30T10:31:00.000000",
      "project_data": { ... full project object ... }
    },
    ...
  }
```

### Project Schema (summary)
- Matches what `PortfolioScanner` constructs and what the README documents:
  - `id`, `name`, `path`, `slug`
  - `metadata`: `language`, `framework`, `type`, `tags`
  - `readme`: content, preview, headings, demo
  - `assets`: screenshots, logo, thumbnail
  - `git`: repo metadata
  - `stats`: lines of code, files, tests/docs/ci flags, doc completeness
  - `display`: featured, priority, category, status, visibility
  - `timestamps`: created, modified, last_scanned

### Requirements
Installed via `requirements.txt`:
- `GitPython`, `PyYAML`, `markdown`, `python-frontmatter`, `Pillow`, `python-dateutil`

### Usage (Quick Test)
```bash
cd /home/jake/Desktop/portfolio_ops
pip3 install -r requirements.txt

# Initialize data dir and default config
python3 portfolio.py init

# Full scan (uses ~/Desktop by default; override with --path)
python3 portfolio.py generate --verbose

# Incremental update
python3 portfolio.py update -v

# Inspect results
python3 portfolio.py list
python3 portfolio.py show <project-name-or-slug>
```

### Known Limitations / Next Steps
- Asset copying to `public/portfolio-data/assets/<slug>/` is not yet performed (only discovery returns source paths)
- `display.visibility` rules are not enforced during scan; can be applied as a post-process
- Optional CLI extras (`validate`, `watch`, `archive`, `hide`, `build`) are not yet implemented
- Incremental comparison assumes consistent ISO timestamps for directory mtime; consider using numeric epoch seconds for robustness


