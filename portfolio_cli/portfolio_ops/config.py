"""
Configuration management for Portfolio-OPs

Responsibilities:
- Provide sensible defaults that match the README
- Load overrides from a local YAML file (portfolio-config.yaml)
- Expose simple attributes used by other modules
- Write a default YAML on first init
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional

import os

try:
    import yaml  # type: ignore
except Exception:  # pragma: no cover
    yaml = None  # Will fail later with a helpful message if used without install


_DEFAULT_YAML = """scanner:
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
  auto_feature_threshold: 100
  default_category: "Uncategorized"

  visibility_rules:
    - pattern: "test-*"
      visibility: hidden
    - pattern: "draft-*"
      visibility: draft
"""


class Config:
    """Loads and exposes configuration for the application.

    Priority: local YAML overrides defaults. Missing keys fall back to defaults.
    """

    def __init__(self, config_path: Optional[Path] = None) -> None:
        self._config_path = Path(config_path) if config_path else Path("portfolio-config.yaml")
        self._defaults = self._load_defaults()
        self._data = self._load_yaml(self._config_path) if self._config_path.exists() else {}

        # Public attributes consumed across the codebase
        scanner_cfg = self._get_section("scanner")
        output_cfg = self._get_section("output")

        # Scanner
        self.root_path: str = os.path.expanduser(str(scanner_cfg.get("root_path", self._defaults["scanner"]["root_path"])))
        self.max_depth: int = int(scanner_cfg.get("max_depth", self._defaults["scanner"]["max_depth"]))
        self.ignore_dirs: List[str] = list(scanner_cfg.get("ignore_dirs", self._defaults["scanner"]["ignore_dirs"]))
        self.file_patterns: Dict[str, List[str]] = dict(scanner_cfg.get("file_patterns", self._defaults["scanner"]["file_patterns"]))

        # Output
        self.output_dir: str = str(output_cfg.get("data_dir", self._defaults["output"]["data_dir"]))
        self.copy_assets: bool = bool(output_cfg.get("copy_assets", self._defaults["output"]["copy_assets"]))
        self.max_asset_size_mb: int = int(output_cfg.get("max_asset_size_mb", self._defaults["output"]["max_asset_size_mb"]))
        self.screenshot_dirs: List[str] = list(output_cfg.get("screenshot_dirs", self._defaults["output"]["screenshot_dirs"]))

        # Display
        display_cfg = self._get_section("display")
        self.auto_feature_threshold: int = int(display_cfg.get("auto_feature_threshold", self._defaults["display"]["auto_feature_threshold"]))
        self.default_category: str = str(display_cfg.get("default_category", self._defaults["display"]["default_category"]))
        self.visibility_rules: List[Dict[str, Any]] = list(display_cfg.get("visibility_rules", self._defaults["display"]["visibility_rules"]))

    def save_default_config(self, path: Path) -> None:
        """Write default YAML configuration to the given path.

        Does not overwrite existing files (the caller already checks).
        """
        path.write_text(_DEFAULT_YAML, encoding="utf-8")

    # ----- Internal helpers -----
    def _load_defaults(self) -> Dict[str, Any]:
        if yaml is None:
            # Still allow defaults without YAML installed (only needed to parse user file)
            pass

        # Parse the embedded default YAML so we keep a single source of truth
        parsed = self._safe_yaml_load(_DEFAULT_YAML)
        return parsed  # type: ignore[return-value]

    def _get_section(self, name: str) -> Dict[str, Any]:
        return dict(self._data.get(name, {})) if name in self._data else dict(self._defaults.get(name, {}))

    def _load_yaml(self, path: Path) -> Dict[str, Any]:
        text = path.read_text(encoding="utf-8")
        return self._safe_yaml_load(text)

    def _safe_yaml_load(self, text: str) -> Dict[str, Any]:
        if yaml is None:
            raise RuntimeError(
                "PyYAML is required to load configuration. Please install dependencies from requirements.txt."
            )
        data = yaml.safe_load(text) or {}
        if not isinstance(data, dict):
            raise ValueError("Configuration file must contain a YAML mapping (object) at the root")
        return data


