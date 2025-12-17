import { Project } from "@/types/project";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    'JavaScript': 'bg-yellow-100 text-yellow-800',
    'TypeScript': 'bg-blue-100 text-blue-800',
    'Python': 'bg-green-100 text-green-800',
    'Java': 'bg-orange-100 text-orange-800',
    'C++': 'bg-purple-100 text-purple-800',
    'C#': 'bg-indigo-100 text-indigo-800',
    'Go': 'bg-cyan-100 text-cyan-800',
    'Rust': 'bg-red-100 text-red-800',
    'Dart': 'bg-teal-100 text-teal-800',
    'Swift': 'bg-pink-100 text-pink-800',
    'Kotlin': 'bg-emerald-100 text-emerald-800',
    'PHP': 'bg-violet-100 text-violet-800',
    'Ruby': 'bg-rose-100 text-rose-800',
    'Scala': 'bg-amber-100 text-amber-800',
  };
  
  return colors[language] || 'bg-gray-100 text-gray-800';
}

export function getFrameworkColor(framework: string): string {
  const colors: Record<string, string> = {
    'React': 'bg-cyan-100 text-cyan-800',
    'Vue': 'bg-green-100 text-green-800',
    'Angular': 'bg-red-100 text-red-800',
    'Next.js': 'bg-black text-white',
    'Nuxt.js': 'bg-green-100 text-green-800',
    'Svelte': 'bg-orange-100 text-orange-800',
    'Flutter': 'bg-blue-100 text-blue-800',
    'Django': 'bg-green-100 text-green-800',
    'Flask': 'bg-gray-100 text-gray-800',
    'Express': 'bg-gray-100 text-gray-800',
    'FastAPI': 'bg-green-100 text-green-800',
    'Spring': 'bg-green-100 text-green-800',
    'Laravel': 'bg-red-100 text-red-800',
    'Rails': 'bg-red-100 text-red-800',
  };
  
  return colors[framework] || 'bg-gray-100 text-gray-800';
}

export function searchProjects(projects: Project[], query: string): Project[] {
  if (!query.trim()) return projects;
  
  const lowercaseQuery = query.toLowerCase();
  
  return projects.filter(project => 
    project.name.toLowerCase().includes(lowercaseQuery) ||
    project.readme.preview.toLowerCase().includes(lowercaseQuery) ||
    project.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    project.metadata.language.toLowerCase().includes(lowercaseQuery) ||
    project.metadata.framework.toLowerCase().includes(lowercaseQuery)
  );
}

export function sortProjects(projects: Project[], sortBy: 'name' | 'date' | 'priority' | 'commits'): Project[] {
  return [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.timestamps.modified).getTime() - new Date(a.timestamps.modified).getTime();
      case 'priority':
        return b.display.priority - a.display.priority;
      case 'commits':
        return b.git.total_commits - a.git.total_commits;
      default:
        return 0;
    }
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function getProjectStats(projects: Project[]) {
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(p => p.display.featured).length;
  const totalCommits = projects.reduce((sum, p) => sum + p.git.total_commits, 0);
  const totalLinesOfCode = projects.reduce((sum, p) => sum + p.stats.lines_of_code, 0);
  
  const languages = new Set(projects.map(p => p.metadata.language));
  const frameworks = new Set(projects.map(p => p.metadata.framework));
  const categories = new Set(projects.map(p => p.display.category));
  
  return {
    totalProjects,
    featuredProjects,
    totalCommits,
    totalLinesOfCode,
    uniqueLanguages: languages.size,
    uniqueFrameworks: frameworks.size,
    uniqueCategories: categories.size,
  };
}
