"""
Data management for Portfolio-OPs

Handles reading/writing projects.json and cache.json in the configured output
directory. The projects file is stored as a simple JSON array of project
objects to match how the current CLI reads it.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Any


class DataManager:
    def __init__(self, config) -> None:
        self.config = config
        self.output_dir = Path(self.config.output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / "assets").mkdir(parents=True, exist_ok=True)

        self.projects_file = self.output_dir / "projects.json"
        self.cache_file = self.output_dir / "cache.json"

    # ----- Projects -----
    def export_projects(self, projects: List[Dict[str, Any]]) -> None:
        """Write the full projects list to projects.json."""
        self._write_json(self.projects_file, projects)

    def load_projects(self) -> List[Dict[str, Any]]:
        if not self.projects_file.exists():
            return []
        try:
            data = json.loads(self.projects_file.read_text(encoding="utf-8"))
            if isinstance(data, dict) and "projects" in data:
                # Allow future schema with meta wrapper
                return list(data.get("projects", []))
            if isinstance(data, list):
                return data
            return []
        except Exception:
            return []

    def save_projects(self, projects: List[Dict[str, Any]]) -> None:
        self._write_json(self.projects_file, projects)

    # ----- Cache -----
    def load_cache(self) -> Dict[str, Any]:
        if not self.cache_file.exists():
            return {}
        try:
            data = json.loads(self.cache_file.read_text(encoding="utf-8"))
            # Backward/forward compatibility: accept either dict or object with projects map
            if isinstance(data, dict) and "projects" in data:
                return data.get("projects", {})
            if isinstance(data, dict):
                return data
            return {}
        except Exception:
            return {}

    def save_cache(self, projects: List[Dict[str, Any]]) -> None:
        cache_map: Dict[str, Any] = {}
        for proj in projects:
            path = proj.get("path")
            modified = proj.get("timestamps", {}).get("modified")
            last_scanned = proj.get("timestamps", {}).get("last_scanned")
            if not path:
                continue
            cache_map[path] = {
                "last_modified": modified,
                "last_scanned": last_scanned,
                "project_data": proj,
            }

        payload = {
            "last_scan": None,
            "projects": cache_map,
        }
        self._write_json(self.cache_file, payload)

    # ----- Internal helpers -----
    def _write_json(self, path: Path, obj: Any) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding="utf-8")


