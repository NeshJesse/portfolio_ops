"""
Language and framework detection utilities.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Optional


class LanguageDetector:
    def detect(self, directory: Path) -> Optional[Dict]:
        """Return a detection dictionary or None if not recognized.

        Expected keys: language, framework, type, tags
        """
        # JavaScript / Node
        pkg = directory / "package.json"
        if pkg.exists():
            try:
                data = json.loads(pkg.read_text(encoding="utf-8"))
            except Exception:
                data = {}
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
            deps_lower = {k.lower(): v for k, v in deps.items()}

            framework = "Node.js"
            proj_type = "Web App"
            tags: List[str] = ["javascript", "node"]

            if any(k in deps_lower for k in ["react", "next", "gatsby"]):
                framework = "React" if "next" not in deps_lower else "Next.js"
                tags += ["react"]
            elif any(k in deps_lower for k in ["vue", "nuxt"]):
                framework = "Vue"
                tags += ["vue"]
            elif any(k in deps_lower for k in ["svelte", "sveltekit"]):
                framework = "Svelte"
                tags += ["svelte"]

            # Heuristic for API/server projects
            if any(k in deps_lower for k in ["express", "koa", "fastify", "hapi"]):
                proj_type = "Backend/API"
                tags += ["api", "backend"]

            return {
                "language": "JavaScript",
                "framework": framework,
                "type": proj_type,
                "tags": list(sorted(set(tags))),
            }

        # Python
        if any((directory / f).exists() for f in ["requirements.txt", "setup.py", "pyproject.toml"]):
            framework = "Python"
            proj_type = "CLI Tool"
            tags: List[str] = ["python"]

            req = directory / "requirements.txt"
            req_text = req.read_text(encoding="utf-8", errors="ignore") if req.exists() else ""
            lower = req_text.lower()
            if "flask" in lower or "fastapi" in lower or "django" in lower:
                proj_type = "Backend/API"
                tags += ["api", "backend"]
                if "flask" in lower:
                    framework = "Flask"
                elif "fastapi" in lower:
                    framework = "FastAPI"
                elif "django" in lower:
                    framework = "Django"

            return {
                "language": "Python",
                "framework": framework,
                "type": proj_type,
                "tags": list(sorted(set(tags))),
            }

        # Flutter / Dart
        if (directory / "pubspec.yaml").exists():
            return {
                "language": "Dart",
                "framework": "Flutter",
                "type": "Mobile App",
                "tags": ["flutter", "dart", "mobile"],
            }

        # Rust
        if (directory / "Cargo.toml").exists():
            return {
                "language": "Rust",
                "framework": "Rust",
                "type": "CLI Tool",
                "tags": ["rust"],
            }

        # Go
        if (directory / "go.mod").exists():
            return {
                "language": "Go",
                "framework": "Go",
                "type": "CLI Tool",
                "tags": ["go"],
            }

        # Java
        if any((directory / f).exists() for f in ["pom.xml", "build.gradle"]):
            return {
                "language": "Java",
                "framework": "Java",
                "type": "Backend/API",
                "tags": ["java"],
            }

        # Ruby
        if (directory / "Gemfile").exists():
            return {
                "language": "Ruby",
                "framework": "Ruby",
                "type": "Web App",
                "tags": ["ruby"],
            }

        # PHP
        if (directory / "composer.json").exists():
            return {
                "language": "PHP",
                "framework": "PHP",
                "type": "Web App",
                "tags": ["php"],
            }

        # C#
        if list(directory.glob("*.csproj")):
            return {
                "language": "C#",
                "framework": ".NET",
                "type": "Desktop/App",
                "tags": ["csharp", ".net"],
            }

        return None


