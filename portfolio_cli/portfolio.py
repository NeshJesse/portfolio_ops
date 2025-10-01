#!/usr/bin/env python3
"""
Portfolio-OPs: Automated Portfolio Generator
Main CLI entry point
"""

import argparse
import sys
import json
from pathlib import Path
from datetime import datetime
from portfolio_ops.scanner import PortfolioScanner
from portfolio_ops.data_manager import DataManager
from portfolio_ops.config import Config

class PortfolioCLI:
    def __init__(self):
        self.config = Config()
        self.scanner = PortfolioScanner(self.config)
        self.data_manager = DataManager(self.config)
        
    def init(self, args):
        """Initialize portfolio-ops in current directory"""
        print("🚀 Initializing Portfolio-OPs...")
        
        # Create data directory
        data_dir = Path(self.config.output_dir)
        data_dir.mkdir(exist_ok=True)
        (data_dir / "assets").mkdir(exist_ok=True)
        
        # Create config file
        config_path = Path("portfolio-config.yaml")
        if not config_path.exists():
            self.config.save_default_config(config_path)
            print(f"✓ Created config file: {config_path}")
        
        print(f"✓ Created data directory: {data_dir}")
        print("\n✨ Portfolio-OPs is ready!")
        print("\nNext steps:")
        print("  1. Run: python3 portfolio.py generate")
        print("  2. Check: portfolio-data/projects.json")
        
    def generate(self, args):
        """Full scan of all projects"""
        print("🔍 Scanning for projects...")
        
        root_path = Path(args.path).expanduser() if args.path else Path(self.config.root_path).expanduser()
        
        if not root_path.exists():
            print(f"❌ Error: Directory does not exist: {root_path}")
            sys.exit(1)
            
        # Perform scan
        projects = self.scanner.scan(
            root_path,
            max_depth=args.depth or self.config.max_depth,
            verbose=args.verbose
        )
        
        print(f"\n✓ Found {len(projects)} projects")
        
        # Export data
        if not args.dry_run:
            self.data_manager.export_projects(projects)
            self.data_manager.save_cache(projects)
            print(f"✓ Exported to {self.config.output_dir}/projects.json")
            
        # Print summary
        self._print_summary(projects)
        
    def update(self, args):
        """Incremental update - only scan changed projects"""
        print("🔄 Updating portfolio (incremental scan)...")
        
        root_path = Path(args.path).expanduser() if args.path else Path(self.config.root_path).expanduser()
        
        # Load cache
        cache = self.data_manager.load_cache()
        
        # Perform incremental scan
        projects = self.scanner.incremental_scan(
            root_path,
            cache,
            verbose=args.verbose
        )
        
        print(f"\n✓ Processed {len(projects)} projects")
        
        # Export data
        self.data_manager.export_projects(projects)
        self.data_manager.save_cache(projects)
        
        print(f"✓ Updated {self.config.output_dir}/projects.json")
        
    def list_projects(self, args):
        """List all detected projects"""
        projects_data = self.data_manager.load_projects()
        
        if not projects_data:
            print("No projects found. Run 'generate' first.")
            return
            
        print(f"\n📁 Found {len(projects_data)} projects:\n")
        
        for project in projects_data:
            featured = "⭐" if project.get('display', {}).get('featured') else "  "
            name = project['name']
            framework = project['metadata']['framework']
            type_info = project['metadata']['type']
            
            print(f"{featured} {name}")
            print(f"   {framework} • {type_info}")
            print(f"   {project['path']}\n")
            
    def show(self, args):
        """Show detailed info about a specific project"""
        projects_data = self.data_manager.load_projects()
        
        # Find project by name or slug
        project = None
        for p in projects_data:
            if p['name'].lower() == args.name.lower() or p['slug'] == args.name:
                project = p
                break
                
        if not project:
            print(f"❌ Project not found: {args.name}")
            return
            
        # Pretty print project details
        print(f"\n{'='*60}")
        print(f"📦 {project['name']}")
        print(f"{'='*60}\n")
        
        print(f"Language:  {project['metadata']['language']}")
        print(f"Framework: {project['metadata']['framework']}")
        print(f"Type:      {project['metadata']['type']}")
        print(f"Tags:      {', '.join(project['metadata']['tags'])}")
        
        if project.get('git', {}).get('is_repo'):
            print(f"\nGit:")
            print(f"  Remote:       {project['git'].get('remote_url', 'N/A')}")
            print(f"  Last Commit:  {project['git'].get('last_commit', 'N/A')}")
            print(f"  Total Commits: {project['git'].get('total_commits', 0)}")
            
        if project.get('readme', {}).get('exists'):
            print(f"\nREADME:")
            print(f"  Preview: {project['readme']['preview'][:100]}...")
            print(f"  Headings: {', '.join(project['readme']['headings'][:3])}")
            
        print(f"\nPath: {project['path']}")
        
    def feature(self, args):
        """Mark a project as featured"""
        projects_data = self.data_manager.load_projects()
        
        for project in projects_data:
            if project['name'].lower() == args.name.lower():
                project['display']['featured'] = True
                self.data_manager.save_projects(projects_data)
                print(f"⭐ Featured: {project['name']}")
                return
                
        print(f"❌ Project not found: {args.name}")
        
    def categorize(self, args):
        """Set project category"""
        projects_data = self.data_manager.load_projects()
        
        for project in projects_data:
            if project['name'].lower() == args.name.lower():
                project['display']['category'] = args.category
                self.data_manager.save_projects(projects_data)
                print(f"✓ Categorized '{project['name']}' as '{args.category}'")
                return
                
        print(f"❌ Project not found: {args.name}")
        
    def clean(self, args):
        """Clean cache and temporary files"""
        cache_file = Path(self.config.output_dir) / "cache.json"
        if cache_file.exists():
            cache_file.unlink()
            print("✓ Cleared cache")
        print("✓ Clean complete")
        
    def _print_summary(self, projects):
        """Print scan summary"""
        print("\n" + "="*50)
        print("SUMMARY")
        print("="*50)
        
        # Count by language
        languages = {}
        types = {}
        featured_count = 0
        
        for p in projects:
            lang = p['metadata']['language']
            proj_type = p['metadata']['type']
            languages[lang] = languages.get(lang, 0) + 1
            types[proj_type] = types.get(proj_type, 0) + 1
            if p['display'].get('featured'):
                featured_count += 1
                
        print(f"\nTotal Projects: {len(projects)}")
        print(f"Featured: {featured_count}")
        
        print("\nBy Language:")
        for lang, count in sorted(languages.items(), key=lambda x: -x[1]):
            print(f"  {lang}: {count}")
            
        print("\nBy Type:")
        for ptype, count in sorted(types.items(), key=lambda x: -x[1]):
            print(f"  {ptype}: {count}")

def main():
    parser = argparse.ArgumentParser(
        description="Portfolio-OPs: Automated Portfolio Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 portfolio.py init                    # First-time setup
  python3 portfolio.py generate                # Full scan
  python3 portfolio.py update                  # Quick update
  python3 portfolio.py list                    # List all projects
  python3 portfolio.py show my-project         # Show project details
  python3 portfolio.py feature awesome-app     # Mark as featured
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Init command
    subparsers.add_parser('init', help='Initialize portfolio-ops')
    
    # Generate command
    generate_parser = subparsers.add_parser('generate', help='Full scan of all projects')
    generate_parser.add_argument('--path', help='Root path to scan')
    generate_parser.add_argument('--depth', type=int, help='Max scan depth')
    generate_parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    generate_parser.add_argument('--dry-run', action='store_true', help='Preview without saving')
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Incremental update')
    update_parser.add_argument('--path', help='Root path to scan')
    update_parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    
    # List command
    subparsers.add_parser('list', help='List all projects')
    
    # Show command
    show_parser = subparsers.add_parser('show', help='Show project details')
    show_parser.add_argument('name', help='Project name or slug')
    
    # Feature command
    feature_parser = subparsers.add_parser('feature', help='Mark project as featured')
    feature_parser.add_argument('name', help='Project name')
    
    # Categorize command
    cat_parser = subparsers.add_parser('categorize', help='Set project category')
    cat_parser.add_argument('name', help='Project name')
    cat_parser.add_argument('category', help='Category name')
    
    # Clean command
    subparsers.add_parser('clean', help='Clean cache')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
        
    cli = PortfolioCLI()
    
    # Route to appropriate command
    command_map = {
        'init': cli.init,
        'generate': cli.generate,
        'update': cli.update,
        'list': cli.list_projects,
        'show': cli.show,
        'feature': cli.feature,
        'categorize': cli.categorize,
        'clean': cli.clean,
    }
    
    command_map[args.command](args)

if __name__ == '__main__':
    main()