# Portfolio-OPs


### 🚀 Portfolio-OPs — Automated Developer Portfolio Engine

**Portfolio-OPs** is a zero-configuration Python CLI that automatically turns your local coding projects into a structured, production-ready portfolio.

Instead of manually curating projects, screenshots, and descriptions, Portfolio-OPs scans your machine, understands your work, and generates clean data that powers a modern **Next.js portfolio website**.

---

### 🎯 Problem It Solves

Developers often:

* Forget to update their portfolio
* Have dozens of unfinished or hidden projects
* Duplicate effort between GitHub, READMEs, and portfolio sites

**Portfolio-OPs solves this by making your portfolio a by-product of your daily coding work.**

---

### ✨ Key Capabilities

* **Zero Configuration** – Works out of the box
* **Automatic Project Detection** – React, Python, Flutter, CLI tools, and more
* **Markdown-First** – Uses your existing README files as project descriptions
* **Git-Aware** – Tracks activity, commit counts, and last updates
* **Incremental Updates** – Re-scans only changed projects (fast)
* **Frontend-Ready Output** – Generates structured JSON consumed by a Next.js site

---

### 🧠 How It Works (High Level)

1. Scans your Desktop (or Projects folder)
2. Detects valid software projects
3. Extracts:

   * Tech stack
   * README content
   * Screenshots & assets
   * Git metadata
4. Outputs a clean `projects.json`
5. Next.js frontend renders everything automatically

Your portfolio updates in seconds — no manual editing.

---

### 🧱 Tech Stack

* **Backend / CLI**: Python 3.8+
* **Frontend**: Next.js (App Router) + Tailwind CSS
* **Data Format**: JSON + Markdown
* **Git Integration**: GitPython

---

### 📸 Example Output

Each project includes:

* Description (from README)
* Screenshots & gallery
* Tech stack & tags
* GitHub link
* Last updated date
* Project status (Active / Archived)

---

### 🧩 Why This Matters

This project demonstrates:

* Systems thinking
* Automation-first mindset
* Developer Experience (DX) focus
* Clean separation between data and UI
* Real-world tooling, not toy examples

---

### 🔗 Usage Snapshot

```bash
python3 portfolio.py init
python3 portfolio.py update
```

Your portfolio is now up to date.

---

### 📌 Ideal For

* Software engineers
* Frontend developers
* Developer advocates
* Anyone tired of manually maintaining portfolios

---

### 📄 License

MIT

---

## VERSION 2: Developer-Friendly README

### ⚙️ Portfolio-OPs — Portfolio Operations CLI

Portfolio-OPs is a **Python-based project scanner and data pipeline** that converts local development folders into structured portfolio data.

It is designed to be:

* Zero-config
* Incremental
* Git-aware
* Frontend-agnostic

---

### 🗂 Core Workflow

```text
Local Projects → Scanner → Metadata + README + Assets → JSON → Frontend
```

---

### 🛠 Features

* Recursive project scanning
* Language & framework detection
* README parsing (Markdown-first)
* Screenshot & asset discovery
* Git metadata extraction
* Incremental updates using cache
* CLI-based curation (feature, hide, categorize)

---

### 📁 Project Structure

```text
portfolio-ops/
├── portfolio.py            # CLI entry point
├── portfolio_ops/
│   ├── scanner.py
│   ├── detectors.py
│   ├── readme_parser.py
│   ├── asset_finder.py
│   ├── git_analyzer.py
│   ├── data_manager.py
│   └── config.py
├── portfolio-data/
│   ├── projects.json
│   ├── cache.json
│   └── assets/
└── requirements.txt
```

---

### 🧪 Incremental Scan Logic

```python
if project_unchanged:
    skip()
else:
    rescan()
```

Only modified projects are reprocessed, keeping updates fast even with many repositories.

---

### 📄 CLI Commands

```bash
python3 portfolio.py init
python3 portfolio.py generate
python3 portfolio.py update
python3 portfolio.py list
python3 portfolio.py show <project>
python3 portfolio.py feature <project>
python3 portfolio.py categorize <project> "Web Development"
```

---

### 📦 Output Schema (Simplified)

```json
{
  "projects": [
    {
      "name": "My Project",
      "metadata": { "language": "Python" },
      "readme": { "content": "..." },
      "git": { "remote_url": "..." },
      "assets": { "screenshots": [] }
    }
  ]
}
```

---

### 🌐 Frontend Integration

Portfolio-OPs outputs static JSON and assets designed to be consumed by:

* Next.js
* Astro
* Remix
* Any static site generator

No backend required.

---

### 🧩 Design Principles

* Configuration should be optional
* README is the source of truth
* Git activity signals project quality
* Data > presentation
* Fast feedback loops

---

### 🚧 Roadmap

* GitHub API enrichment (stars, forks)
* AI-generated descriptions for missing READMEs
* Auto-screenshots for web projects
* Plugin system for new detectors

---

### 🤝 Contributing

PRs welcome. Focus areas:

* New language detectors
* Performance improvements
* Schema evolution

---

### 📄 License

MIT
