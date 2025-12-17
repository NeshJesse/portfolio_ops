# Portfolio-OPs Technical Documentation

**Version:** 1.0.0  
**Last Updated:** September 30, 2025

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [CLI Commands](#cli-commands)
4. [Python Scanner](#python-scanner)
5. [Data Schema](#data-schema)
6. [Next.js Portfolio](#nextjs-portfolio)
7. [Workflows](#workflows)
8. [Installation](#installation)

---

## Overview

**Portfolio-OPs** is a command-line tool that automates portfolio creation and maintenance by:
- Scanning your Desktop for code projects
- Extracting metadata, READMEs, and assets
- Generating structured JSON data
- Powering a Next.js portfolio website

### Design Philosophy
- **Zero Configuration:** Works out of the box
- **Smart Detection:** Automatically identifies project types
- **Markdown-First:** READMEs become your project descriptions
- **Git-Aware:** Tracks project activity and status
- **Incremental Updates:** Only processes changed projects

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Desktop                               │
│  ~/Desktop/                                                  │
│    ├── project-react/                                       │
│    ├── python-api/                                          │
│    └── flutter-app/                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   portfolio.py (Scanner)                     │
│  • Detects projects                                          │
│  • Extracts metadata                                         │
│  • Reads READMEs                                            │
│  • Finds assets                                              │
│  • Collects git info                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              portfolio-data/ (Data Layer)                    │
│  ├── projects.json          (Main data file)                │
│  ├── cache.json             (Scan cache)                    │
│  └── assets/                (Copied screenshots)            │
│      ├── project-1/                                          │
│      └── project-2/                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Portfolio (Frontend)                    │
│  • Reads projects.json                                       │
│  • Renders markdown READMEs                                  │
│  • Displays project cards                                    │
│  • Provides search/filter                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## CLI Commands

### Basic Usage

```bash
# Navigate to your Desktop
cd ~/Desktop

# First time setup
python3 portfolio.py init

# Scan all projects (full scan)
python3 portfolio.py generate

# Update only changed projects (fast)
python3 portfolio.py update

# List all detected projects
python3 portfolio.py list

# Show specific project details
python3 portfolio.py show project-name

# Rebuild portfolio frontend
python3 portfolio.py build

# Clean cache and start fresh
python3 portfolio.py clean
```

### Advanced Commands

```bash
# Scan specific directory
python3 portfolio.py generate --path ~/Projects

# Export to custom location
python3 portfolio.py generate --output ./my-portfolio-data

# Exclude certain directories
python3 portfolio.py generate --ignore node_modules,venv,build

# Set scan depth
python3 portfolio.py generate --depth 3

# Generate with verbose output
python3 portfolio.py generate --verbose

# Preview without saving
python3 portfolio.py generate --dry-run

# Mark project as featured
python3 portfolio.py feature project-name

# Set project category
python3 portfolio.py categorize project-name "Web Development"

# Archive old project
python3 portfolio.py archive project-name
```

---

## Python Scanner

### Project Structure

```
~/Desktop/
├── portfolio.py                 # Main CLI script
├── portfolio_ops/               # Package directory
│   ├── __init__.py
│   ├── scanner.py              # Core scanning logic
│   ├── detectors.py            # Language/framework detectors
│   ├── readme_parser.py        # README extraction
│   ├── asset_finder.py         # Screenshot/asset detection
│   ├── git_analyzer.py         # Git metadata extraction
│   ├── data_manager.py         # JSON export/import
│   └── config.py               # Configuration
├── data/              # Generated data
│   ├── projects.json
│   ├── cache.json
│   └── assets/
└── requirements.txt
```

### Core Modules

#### 1. **scanner.py** - Main Scanner
```python
class PortfolioScanner:
    def scan(self, root_path: str) -> List[Project]:
        """
        Scans directory tree for projects
        Returns list of detected projects
        """
    
    def detect_project(self, dir_path: str) -> Optional[Project]:
        """
        Determines if directory is a project
        Extracts all metadata
        """
```

#### 2. **detectors.py** - Language/Framework Detection
```python
def detect_javascript(dir_path: str) -> Optional[ProjectInfo]:
    """Checks package.json, detects React/Vue/Node"""

def detect_python(dir_path: str) -> Optional[ProjectInfo]:
    """Checks requirements.txt, detects Flask/Django"""

def detect_flutter(dir_path: str) -> Optional[ProjectInfo]:
    """Checks pubspec.yaml"""
```

#### 3. **readme_parser.py** - README Extraction
```python
class ReadmeParser:
    def parse(self, readme_path: str) -> ReadmeData:
        """
        Extracts:
        - Full markdown content
        - First paragraph (preview)
        - Headings structure
        - Demo links
        - Badges
        """
```

#### 4. **asset_finder.py** - Asset Detection
```python
class AssetFinder:
    def find_screenshots(self, dir_path: str) -> List[str]:
        """Looks in docs/, screenshots/, assets/ folders"""
    
    def find_logo(self, dir_path: str) -> Optional[str]:
        """Finds logo.png, icon.svg, etc."""
```

#### 5. **git_analyzer.py** - Git Metadata
```python
class GitAnalyzer:
    def get_remote_url(self, dir_path: str) -> Optional[str]:
        """Extracts GitHub/GitLab URL"""
    
    def get_last_commit(self, dir_path: str) -> datetime:
        """Gets last commit timestamp"""
    
    def get_commit_count(self, dir_path: str) -> int:
        """Counts total commits"""
```

#### 6. **data_manager.py** - Data Export
```python
class DataManager:
    def export_json(self, projects: List[Project], output_path: str):
        """Exports to projects.json"""
    
    def load_cache(self) -> Dict:
        """Loads previous scan for comparison"""
    
    def save_cache(self, projects: List[Project]):
        """Saves current scan state"""
```

---

## Data Schema

### projects.json Structure

```json
{
  "meta": {
    "generated_at": "2025-09-30T10:30:00Z",
    "scan_type": "full",
    "total_projects": 12,
    "scanner_version": "1.0.0"
  },
  "projects": [
    {
      "id": "ecommerce-react-2024",
      "name": "E-Commerce Platform",
      "path": "/Users/you/Desktop/ecommerce-react",
      "slug": "ecommerce-react-2024",
      
      "metadata": {
        "language": "JavaScript",
        "framework": "React",
        "type": "Web App",
        "tags": ["react", "typescript", "ecommerce", "web"]
      },
      
      "readme": {
        "exists": true,
        "path": "README.md",
        "content": "# E-Commerce Platform\n\nFull markdown content...",
        "preview": "A modern e-commerce platform built with React and TypeScript...",
        "headings": [
          "Features",
          "Tech Stack",
          "Installation",
          "Screenshots"
        ],
        "has_demo": true,
        "demo_url": "https://demo.example.com",
        "word_count": 450
      },
      
      "assets": {
        "screenshots": [
          "portfolio-data/assets/ecommerce-react-2024/screenshot-1.png",
          "portfolio-data/assets/ecommerce-react-2024/screenshot-2.png"
        ],
        "logo": "portfolio-data/assets/ecommerce-react-2024/logo.svg",
        "thumbnail": "portfolio-data/assets/ecommerce-react-2024/thumbnail.jpg"
      },
      
      "git": {
        "is_repo": true,
        "remote_url": "https://github.com/username/ecommerce-react",
        "last_commit": "2025-09-28T14:22:00Z",
        "total_commits": 234,
        "branch": "main",
        "is_archived": false
      },
      
      "stats": {
        "lines_of_code": 8543,
        "file_count": 127,
        "has_tests": true,
        "test_coverage": 78.5,
        "has_ci": true,
        "has_docs": true,
        "documentation_completeness": 85
      },
      
      "display": {
        "featured": true,
        "priority": 1,
        "category": "Web Development",
        "status": "Active",
        "visibility": "public",
        "custom_description": null
      },
      
      "timestamps": {
        "created": "2024-01-15T09:00:00Z",
        "modified": "2025-09-28T14:22:00Z",
        "last_scanned": "2025-09-30T10:30:00Z"
      }
    }
  ]
}
```

### cache.json Structure

```json
{
  "last_scan": "2025-09-30T10:30:00Z",
  "projects": {
    "/Users/you/Desktop/project-1": {
      "last_modified": "2025-09-28T14:22:00Z",
      "checksum": "a1b2c3d4e5f6",
      "last_scanned": "2025-09-30T10:30:00Z"
    }
  }
}
```

---

## Next.js Portfolio

### Project Structure

```
portfolio-website/
├── public/
│   └── portfolio-data/          # Copied from scanner output
│       ├── projects.json
│       └── assets/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Homepage with project grid
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Individual project page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ProjectCard.tsx     # Project preview card
│   │   ├── ProjectGrid.tsx     # Grid layout
│   │   ├── MarkdownRenderer.tsx # README renderer
│   │   ├── ImageGallery.tsx    # Screenshot gallery
│   │   └── FilterBar.tsx       # Search/filter UI
│   ├── lib/
│   │   ├── projects.jsx         # Load/parse projects.json
│   │   └── markdown.jsx         # Markdown utilities
│   └── types/
│       └── project.ts          # TypeScript types
├── next.config.js
├── package.json
└── tailwind.config.js
```

### Key Features

#### 1. **Static Generation**
```typescript
// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(p => ({ slug: p.slug }));
}
```

#### 2. **README Rendering**
```typescript
// components/MarkdownRenderer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          // Syntax highlighting for code blocks
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

#### 3. **Search & Filter**
```typescript
// components/FilterBar.tsx
- Filter by language (JavaScript, Python, Dart)
- Filter by type (Web App, Mobile App, CLI Tool)
- Filter by tags
- Sort by date, name, priority
- Text search in names and descriptions
```

---

## Workflows

### First-Time Setup

```bash
# 1. Clone or create portfolio-ops
cd ~/Desktop
git clone https://github.com/yourusername/portfolio-ops.git
cd portfolio-ops

# 2. Install Python dependencies
pip3 install -r requirements.txt

# 3. Initialize
python3 portfolio.py init

# Output:
# ✓ Created portfolio-data directory
# ✓ Created config file
# ✓ Ready to scan!
```

### Daily Workflow

```bash
# Morning: Work on projects
cd ~/Desktop/my-new-project
# ... code, commit, push ...

# Afternoon: Update portfolio
cd ~/Desktop
python3 portfolio.py update

# Output:
# Scanning ~/Desktop...
# ✓ Found 3 new projects
# ✓ Updated 2 existing projects
# ✓ Exported to portfolio-data/projects.json
# ✓ Copied 5 screenshots
# 
# Summary:
#   Total Projects: 15
#   Featured: 5
#   Categories: Web (8), Mobile (3), CLI (4)

# If you have the Next.js dev server running, it auto-reloads!
```

### Publishing Workflow

```bash
# 1. Scan projects
python3 portfolio.py generate

# 2. Navigate to portfolio website
cd ~/Desktop/portfolio-website

# 3. Copy data (or use symlink)
cp -r ../portfolio-data ./public/

# 4. Build and deploy
npm run build
vercel deploy --prod

# Done! Portfolio live at: https://yourname.vercel.app
```

### Incremental Update Logic

```python
# portfolio.py update command does:

1. Load cache.json
2. For each project directory:
   - Check if it exists in cache
   - Compare last modified timestamp
   - If unchanged → Skip (fast!)
   - If changed → Re-scan metadata
   - If new → Full scan
3. Only process changed projects
4. Update cache.json
5. Export new projects.json

# Result: Update takes 2-5 seconds instead of 30+ seconds
```

---

## Installation

### Prerequisites

```bash
- Python 3.8+
- Node.js 18+
- Git (for git metadata extraction)
```

### Python Setup

```bash
# Install dependencies
pip3 install -r requirements.txt

# requirements.txt:
# GitPython==3.1.40
# PyYAML==6.0.1
# markdown==3.5.1
# python-frontmatter==1.0.0
# Pillow==10.1.0  # For image processing
```

### Next.js Setup

```bash
# Create Next.js app
npx create-next-app@latest portfolio-website --typescript --tailwind --app

# Install dependencies
cd portfolio-website
npm install react-markdown remark-gfm rehype-highlight
npm install react-syntax-highlighter
npm install @types/react-syntax-highlighter --save-dev
```

### Development Environment

```bash
# Terminal 1: Watch for project changes
cd ~/Desktop
python3 portfolio.py watch  # Auto-runs update on file changes

# Terminal 2: Next.js dev server
cd ~/Desktop/portfolio-website
npm run dev

# Open: http://localhost:3000
# Changes to projects instantly reflect!
```

---

## Configuration

### portfolio-config.yaml

```yaml
scanner:
  root_path: "~/Desktop"
  max_depth: 3
  ignore_dirs:
    - node_modules
    - venv
    - .git
    - build
    - dist
    - __pycache__
  
  file_patterns:
    javascript: ["package.json"]
    python: ["requirements.txt", "setup.py", "pyproject.toml"]
    flutter: ["pubspec.yaml"]
    rust: ["Cargo.toml"]
    go: ["go.mod"]

output:
  data_dir: "./portfolio-data"
  copy_assets: true
  max_asset_size_mb: 5
  
  screenshot_dirs:
    - screenshots
    - docs/images
    - assets
    - .github/images

display:
  auto_feature_threshold: 100  # Projects with 100+ commits auto-featured
  default_category: "Uncategorized"
  
  visibility_rules:
    - pattern: "test-*"
      visibility: hidden
    - pattern: "draft-*"
      visibility: draft
```

---

## Best Practices

### Project Organization

1. **README Guidelines**: Every project should have a README.md with:
   - Project description
   - Screenshots section
   - Tech stack
   - Features list

2. **Screenshots**: Place in `screenshots/` or `docs/images/`

3. **Git Commits**: Regular commits improve "last updated" display

### Portfolio Curation

```bash
# Mark best projects as featured
python3 portfolio.py feature awesome-project

# Set categories for organization
python3 portfolio.py categorize web-app "Web Development"

# Hide incomplete projects
python3 portfolio.py hide draft-project
```

### Performance Tips

1. Use `update` instead of `generate` for daily scans
2. Keep screenshot sizes under 2MB
3. Use `.portfolioignore` file to skip certain directories
4. Run `clean` monthly to remove stale cache

---

## Future Enhancements

- **Watch Mode**: Auto-update on file changes
- **GitHub Integration**: Pull stars, forks, issues count
- **AI Descriptions**: Generate descriptions if README missing
- **Screenshot Capture**: Auto-screenshot web apps
- **Analytics**: Track which projects get most views
- **Blog Integration**: Pull dev.to or Medium articles

---

## Troubleshooting

### Scanner Issues

**Problem**: Projects not detected
```bash
# Check if directory has project markers
python3 portfolio.py validate ~/Desktop/project-name

# Increase scan depth
python3 portfolio.py generate --depth 5
```

**Problem**: Slow scans
```bash
# Use update instead
python3 portfolio.py update

# Or ignore large directories
python3 portfolio.py generate --ignore node_modules,venv
```

### Next.js Issues

**Problem**: Images not loading
- Ensure assets copied to `public/portfolio-data/assets/`
- Check Next.js `next.config.js` allows external images

**Problem**: Markdown not rendering
- Verify `projects.json` has full markdown content
- Check ReactMarkdown configuration

---

## Support

For issues, suggestions, or contributions:
- GitHub: https://github.com/yourusername/portfolio-ops
- Email: your@email.com

---
