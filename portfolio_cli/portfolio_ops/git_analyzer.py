"""
Git metadata extraction using GitPython when available.
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Dict, Any

try:
    from git import Repo  # type: ignore
except Exception:  # pragma: no cover
    Repo = None  # type: ignore


class GitAnalyzer:
    def analyze(self, directory: Path) -> Dict[str, Any]:
        if not (directory / ".git").exists() or Repo is None:
            return {
                "is_repo": False,
                "remote_url": None,
                "last_commit": None,
                "first_commit": None,
                "total_commits": 0,
                "branch": None,
                "is_archived": False,
            }

        try:
            repo = Repo(str(directory))
            remote_url = None
            if repo.remotes:
                try:
                    remote_url = next(iter(repo.remotes)).url
                except Exception:
                    remote_url = None

            commits = list(repo.iter_commits())
            total = len(commits)
            last_commit_dt = commits[0].committed_datetime if commits else None
            first_commit_dt = commits[-1].committed_datetime if commits else None

            branch = None
            try:
                branch = repo.active_branch.name
            except Exception:
                branch = None

            return {
                "is_repo": True,
                "remote_url": remote_url,
                "last_commit": last_commit_dt.isoformat() if last_commit_dt else None,
                "first_commit": first_commit_dt.isoformat() if first_commit_dt else None,
                "total_commits": total,
                "branch": branch,
                "is_archived": False,
            }
        except Exception:
            return {
                "is_repo": False,
                "remote_url": None,
                "last_commit": None,
                "first_commit": None,
                "total_commits": 0,
                "branch": None,
                "is_archived": False,
            }


