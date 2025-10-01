"""
README parsing utilities.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, Any


class ReadmeParser:
    def parse(self, directory: Path) -> Dict[str, Any]:
        readme_path = self._find_readme(directory)
        if not readme_path:
            return {
                "exists": False,
                "path": None,
                "content": "",
                "preview": "",
                "headings": [],
                "has_demo": False,
                "demo_url": None,
                "word_count": 0,
            }

        content = readme_path.read_text(encoding="utf-8", errors="ignore")
        preview = self._extract_preview(content)
        headings = self._extract_headings(content)
        demo_url = self._extract_demo_url(content)
        words = len(re.findall(r"\b\w+\b", content))

        return {
            "exists": True,
            "path": str(readme_path.name),
            "content": content,
            "preview": preview,
            "headings": headings,
            "has_demo": bool(demo_url),
            "demo_url": demo_url,
            "word_count": words,
        }

    def _find_readme(self, directory: Path) -> Path | None:
        for name in ["README.md", "readme.md", "Readme.md", "README.MD"]:
            p = directory / name
            if p.exists():
                return p
        return None

    def _extract_preview(self, content: str) -> str:
        # First non-empty paragraph
        for block in content.split("\n\n"):
            text = block.strip()
            if text and not text.startswith("#"):
                # Collapse whitespace
                return re.sub(r"\s+", " ", text)[:300]
        return ""

    def _extract_headings(self, content: str) -> list[str]:
        headings: list[str] = []
        for line in content.splitlines():
            if line.lstrip().startswith("#"):
                title = line.lstrip("# ").strip()
                if title:
                    headings.append(title)
        return headings[:20]

    def _extract_demo_url(self, content: str) -> str | None:
        # Look for lines containing demo/live/preview and a URL
        demo_patterns = [
            r"(?i)(demo|live|preview)[^\n]*?(https?://\S+)",
        ]
        for pat in demo_patterns:
            m = re.search(pat, content)
            if m:
                return m.group(2)
        # Fallback: detect a likely demo badge link
        m = re.search(r"\[!\[[^\]]*\]\([^)]*\)\]\((https?://\S+)\)", content)
        if m:
            return m.group(1)
        return None


