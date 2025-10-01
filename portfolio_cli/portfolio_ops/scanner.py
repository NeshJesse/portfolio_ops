"""
Core scanning logic for Portfolio-OPs
"""

from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
import hashlib

from .detectors import LanguageDetector
from .readme_parser import ReadmeParser
from .asset_finder import AssetFinder
from .git_analyzer import GitAnalyzer


class PortfolioScanner:
    """Main scanner that orchestrates project detection"""
    
    def __init__(self, config):
        self.config = config
        self.ignore_dirs = set(config.ignore_dirs)
        
        # Initialize components
        self.language_detector = LanguageDetector()
        self.readme_parser = ReadmeParser()
        self.asset_finder = AssetFinder()
        self.git_analyzer = GitAnalyzer()
        
    def scan(self, root_path: Path, max_depth: int = 3, verbose: bool = False) -> List[Dict]:
        """
        Full scan of directory tree
        
        Args:
            root_path: Root directory to scan
            max_depth: Maximum depth to traverse
            verbose: Print detailed progress
            
        Returns:
            List of project dictionaries
        """
        print(f"Scanning: {root_path}")
        project_dirs = self._find_project_directories(root_path, max_depth, verbose)
        
        print(f"Found {len(project_dirs)} project directories")
        
        projects = []
        for idx, project_dir in enumerate(project_dirs, 1):
            if verbose:
                print(f"[{idx}/{len(project_dirs)}] Processing: {project_dir.name}")
                
            project = self._detect_project(project_dir, verbose)
            if project:
                projects.append(project)
                
        return projects
        
    def incremental_scan(self, root_path: Path, cache: Dict, verbose: bool = False) -> List[Dict]:
        """
        Incremental scan - only process changed projects
        
        Args:
            root_path: Root directory to scan
            cache: Previous scan cache
            verbose: Print detailed progress
            
        Returns:
            List of all projects (unchanged + updated)
        """
        print(f"Incremental scan: {root_path}")
        
        project_dirs = self._find_project_directories(root_path, self.config.max_depth, verbose)
        
        projects = []
        new_count = 0
        updated_count = 0
        unchanged_count = 0
        
        for project_dir in project_dirs:
            project_path = str(project_dir)
            
            # Check if project exists in cache
            if project_path in cache:
                cached_data = cache[project_path]
                current_mtime = self._get_directory_mtime(project_dir)
                
                # If unchanged, use cached data
                if current_mtime <= cached_data.get('last_modified'):
                    if verbose:
                        print(f"  Unchanged: {project_dir.name}")
                    # Load from cache
                    projects.append(cached_data.get('project_data'))
                    unchanged_count += 1
                    continue
                else:
                    if verbose:
                        print(f"  Updated: {project_dir.name}")
                    updated_count += 1
            else:
                if verbose:
                    print(f"  New: {project_dir.name}")
                new_count += 1
                
            # Scan project
            project = self._detect_project(project_dir, verbose)
            if project:
                projects.append(project)
                
        print(f"\nResults: {new_count} new, {updated_count} updated, {unchanged_count} unchanged")
        
        return projects
        
    def _find_project_directories(self, root_path: Path, max_depth: int, verbose: bool) -> List[Path]:
        """
        Recursively find all project directories
        
        A directory is considered a project if it contains known project files
        """
        project_dirs = []
        
        def traverse(current_path: Path, depth: int):
            if depth > max_depth:
                return
                
            try:
                for item in current_path.iterdir():
                    if not item.is_dir():
                        continue
                        
                    # Skip ignored directories
                    if item.name in self.ignore_dirs:
                        continue
                        
                    # Check if it's a project directory
                    if self._is_project_directory(item):
                        project_dirs.append(item)
                        if verbose:
                            print(f"  Found project: {item.name}")
                    else:
                        # Recurse deeper
                        traverse(item, depth + 1)
                        
            except PermissionError:
                if verbose:
                    print(f"  Permission denied: {current_path}")
                    
        traverse(root_path, 0)
        return project_dirs
        
    def _is_project_directory(self, directory: Path) -> bool:
        """Check if directory contains project marker files"""
        marker_files = [
            'package.json',      # JavaScript/Node
            'requirements.txt',  # Python
            'setup.py',          # Python
            'pyproject.toml',    # Python
            'pubspec.yaml',      # Dart/Flutter
            'Cargo.toml',        # Rust
            'go.mod',            # Go
            'pom.xml',           # Java/Maven
            'build.gradle',      # Java/Gradle
            'Gemfile',           # Ruby
            'composer.json',     # PHP
        ]
        
        for marker in marker_files:
            if (directory / marker).exists():
                return True
                
        # Also check for .csproj files (C#)
        for file in directory.glob('*.csproj'):
            return True
            
        return False
        
    def _detect_project(self, directory: Path, verbose: bool = False) -> Optional[Dict]:
        """
        Detect and extract all information about a project
        
        Returns:
            Complete project dictionary or None if detection fails
        """
        try:
            # 1. Detect language and framework
            detection = self.language_detector.detect(directory)
            
            if not detection:
                if verbose:
                    print(f"    Could not detect language for: {directory.name}")
                return None
                
            # 2. Parse README
            readme_data = self.readme_parser.parse(directory)
            
            # 3. Find assets (screenshots, logos)
            assets = self.asset_finder.find_assets(directory, self.config.output_dir)
            
            # 4. Extract git metadata
            git_data = self.git_analyzer.analyze(directory)
            
            # 5. Calculate stats
            stats = self._calculate_stats(directory)
            
            # 6. Build project object
            project = {
                'id': self._generate_id(directory),
                'name': self._get_project_name(directory, detection),
                'path': str(directory),
                'slug': self._generate_slug(directory.name),
                
                'metadata': {
                    'language': detection['language'],
                    'framework': detection['framework'],
                    'type': detection['type'],
                    'tags': detection['tags'],
                },
                
                'readme': readme_data,
                'assets': assets,
                'git': git_data,
                'stats': stats,
                
                'display': {
                    'featured': self._should_be_featured(git_data, stats),
                    'priority': 0,
                    'category': self._infer_category(detection),
                    'status': self._determine_status(git_data),
                    'visibility': 'public',
                    'custom_description': None,
                },
                
                'timestamps': {
                    'created': self._get_creation_date(directory, git_data),
                    'modified': self._get_directory_mtime(directory),
                    'last_scanned': datetime.now().isoformat(),
                }
            }
            
            return project
            
        except Exception as e:
            if verbose:
                print(f"    Error detecting project: {e}")
            return None
            
    def _generate_id(self, directory: Path) -> str:
        """Generate unique project ID"""
        path_str = str(directory.absolute())
        return hashlib.md5(path_str.encode()).hexdigest()[:12]
        
    def _generate_slug(self, name: str) -> str:
        """Generate URL-friendly slug"""
        slug = name.lower()
        slug = slug.replace(' ', '-')
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        return slug
        
    def _get_project_name(self, directory: Path, detection: Dict) -> str:
        """
        Extract project name from various sources
        Priority: package.json > directory name
        """
        # Try to get name from package.json
        package_json = directory / 'package.json'
        if package_json.exists():
            import json
            try:
                with open(package_json) as f:
                    data = json.load(f)
                    if 'name' in data:
                        return data['name'].replace('-', ' ').title()
            except:
                pass
                
        # Try to get from pubspec.yaml
        pubspec = directory / 'pubspec.yaml'
        if pubspec.exists():
            try:
                import yaml
                with open(pubspec) as f:
                    data = yaml.safe_load(f)
                    if data and 'name' in data:
                        return data['name'].replace('_', ' ').title()
            except:
                pass
                
        # Fallback to directory name
        return directory.name.replace('-', ' ').replace('_', ' ').title()
        
    def _calculate_stats(self, directory: Path) -> Dict:
        """Calculate project statistics"""
        stats = {
            'lines_of_code': 0,
            'file_count': 0,
            'has_tests': self._has_tests(directory),
            'test_coverage': None,
            'has_ci': self._has_ci(directory),
            'has_docs': self._has_docs(directory),
            'documentation_completeness': 0,
        }
        
        # Count files and lines of code (excluding common ignored dirs)
        code_extensions = {'.js', '.ts', '.py', '.dart', '.rs', '.go', '.java', '.php', '.rb'}
        
        for file_path in directory.rglob('*'):
            if file_path.is_file():
                # Skip ignored directories
                if any(ignored in file_path.parts for ignored in self.ignore_dirs):
                    continue
                    
                stats['file_count'] += 1
                
                if file_path.suffix in code_extensions:
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            stats['lines_of_code'] += len(f.readlines())
                    except:
                        pass
                        
        # Calculate documentation completeness (0-100)
        doc_score = 0
        if (directory / 'README.md').exists():
            doc_score += 50
        if stats['has_docs']:
            doc_score += 30
        if stats['has_tests']:
            doc_score += 20
            
        stats['documentation_completeness'] = doc_score
        
        return stats
        
    def _has_tests(self, directory: Path) -> bool:
        """Check if project has tests"""
        test_indicators = ['test', 'tests', '__tests__', 'spec', 'specs']
        
        for indicator in test_indicators:
            if (directory / indicator).exists():
                return True
                
        return False
        
    def _has_ci(self, directory: Path) -> bool:
        """Check if project has CI/CD configuration"""
        ci_files = [
            '.github/workflows',
            '.gitlab-ci.yml',
            '.travis.yml',
            'circle.yml',
            '.circleci',
        ]
        
        for ci_file in ci_files:
            if (directory / ci_file).exists():
                return True
                
        return False
        
    def _has_docs(self, directory: Path) -> bool:
        """Check if project has documentation"""
        doc_indicators = ['docs', 'documentation', 'doc']
        
        for indicator in doc_indicators:
            if (directory / indicator).exists():
                return True
                
        return False
        
    def _should_be_featured(self, git_data: Dict, stats: Dict) -> bool:
        """Determine if project should be auto-featured"""
        # Auto-feature if:
        # - Has 100+ commits
        # - Has CI/CD
        # - Has good documentation
        
        if git_data.get('total_commits', 0) >= 100:
            return True
            
        if stats.get('has_ci') and stats.get('documentation_completeness', 0) >= 80:
            return True
            
        return False
        
    def _infer_category(self, detection: Dict) -> str:
        """Infer project category from metadata"""
        proj_type = detection.get('type', '').lower()
        tags = detection.get('tags', [])
        
        if 'web' in proj_type or 'web' in tags:
            return 'Web Development'
        elif 'mobile' in proj_type or 'mobile' in tags:
            return 'Mobile Development'
        elif 'api' in proj_type or 'backend' in tags:
            return 'Backend & APIs'
        elif 'cli' in proj_type or 'cli' in tags:
            return 'CLI Tools'
        elif 'desktop' in proj_type or 'desktop' in tags:
            return 'Desktop Applications'
        elif 'game' in proj_type:
            return 'Games'
        elif 'library' in proj_type or 'package' in proj_type:
            return 'Libraries & Packages'
        else:
            return 'Other Projects'
            
    def _determine_status(self, git_data: Dict) -> str:
        """Determine project status (Active, Archived, etc.)"""
        if git_data.get('is_archived'):
            return 'Archived'
            
        last_commit = git_data.get('last_commit')
        if last_commit:
            try:
                from dateutil import parser
                commit_date = parser.parse(last_commit)
                days_since = (datetime.now() - commit_date).days
                
                if days_since < 30:
                    return 'Active'
                elif days_since < 180:
                    return 'Maintained'
                else:
                    return 'Inactive'
            except:
                pass
                
        return 'Unknown'
        
    def _get_creation_date(self, directory: Path, git_data: Dict) -> str:
        """Get project creation date"""
        # Try to get from git first commit
        # Fallback to directory creation time
        
        if git_data.get('first_commit'):
            return git_data['first_commit']
            
        try:
            stat = directory.stat()
            return datetime.fromtimestamp(stat.st_ctime).isoformat()
        except:
            return datetime.now().isoformat()
            
    def _get_directory_mtime(self, directory: Path) -> str:
        """Get directory last modification time"""
        try:
            stat = directory.stat()
            return datetime.fromtimestamp(stat.st_mtime).isoformat()
        except:
            return datetime.now().isoformat()