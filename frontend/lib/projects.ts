import { Project, ProjectsData } from "@/types/project";
import { promises as fs } from 'fs';
import path from 'path';

export async function getProjects(): Promise<Project[]> {
  try {
    // efficient: read directly from filesystem during SSG/SSR
    const filePath = path.join(process.cwd(), 'public', 'portfolio-data', 'projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');

    const data: any = JSON.parse(fileContents);
    // Handle both wrapped and raw array formats
    if (Array.isArray(data)) {
      return data as Project[];
    }
    return (data as ProjectsData).projects;
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter(p => p.display.featured);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter(p => p.display.category === category);
}

export async function getProjectsByLanguage(language: string): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter(p => p.metadata.language === language);
}

export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter(p => p.metadata.tags.includes(tag));
}

export async function getAllCategories(): Promise<string[]> {
  const projects = await getProjects();
  const categories = new Set(projects.map(p => p.display.category));
  return Array.from(categories).sort();
}

export async function getAllLanguages(): Promise<string[]> {
  const projects = await getProjects();
  const languages = new Set(projects.map(p => p.metadata.language));
  return Array.from(languages).sort();
}

export async function getAllTags(): Promise<string[]> {
  const projects = await getProjects();
  const tags = new Set(projects.flatMap(p => p.metadata.tags));
  return Array.from(tags).sort();
}
