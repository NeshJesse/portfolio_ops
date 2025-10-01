"""
Asset discovery utilities.

Currently returns discovered asset paths in-place. Copying into the output
assets directory can be added later once slug/path conventions are finalized.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List


IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}


class AssetFinder:
    def find_assets(self, directory: Path, output_dir: str) -> Dict:
        screenshots = self.find_screenshots(directory)
        logo = self.find_logo(directory)
        thumbnail = self._choose_thumbnail(screenshots, logo)
        return {
            "screenshots": screenshots,
            "logo": logo,
            "thumbnail": thumbnail,
        }

    def find_screenshots(self, directory: Path) -> List[str]:
        candidates = [
            directory / "screenshots",
            directory / "docs" / "images",
            directory / "assets",
            directory / ".github" / "images",
        ]
        found: List[str] = []
        for base in candidates:
            if base.exists() and base.is_dir():
                for p in base.rglob("*"):
                    if p.is_file() and p.suffix.lower() in IMAGE_EXTS:
                        found.append(str(p))
        return found[:20]

    def find_logo(self, directory: Path) -> str | None:
        for name in ["logo.png", "logo.jpg", "logo.jpeg", "icon.png", "icon.svg", "logo.svg"]:
            p = directory / name
            if p.exists():
                return str(p)
        return None

    def _choose_thumbnail(self, screenshots: List[str], logo: str | None) -> str | None:
        if logo:
            return logo
        return screenshots[0] if screenshots else None


