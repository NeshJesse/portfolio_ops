'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Project, AboutData, SkillsData, ExperienceData } from '@/types/project';

const PROJECTS_FILE_PATH = path.join(process.cwd(), 'public/portfolio-data/projects.json');

/**
 * Reads all projects from the JSON file.
 */
export async function getProjects(): Promise<Project[]> {
    try {
        const data = await fs.readFile(PROJECTS_FILE_PATH, 'utf-8');
        const projects = JSON.parse(data);
        return projects;
    } catch (error) {
        console.error('Error reading projects:', error);
        return [];
    }
}

/**
 * Toggles the 'featured' status of a project.
 */
export async function toggleProjectFeatured(projectId: string, isFeatured: boolean) {
    try {
        const data = await fs.readFile(PROJECTS_FILE_PATH, 'utf-8');
        const projects: Project[] = JSON.parse(data);

        const projectIndex = projects.findIndex((p) => p.id === projectId);
        if (projectIndex === -1) {
            throw new Error(`Project with ID ${projectId} not found`);
        }

        projects[projectIndex].display.featured = isFeatured;

        await fs.writeFile(PROJECTS_FILE_PATH, JSON.stringify(projects, null, 2), 'utf-8');

        // Revalidate the curation page and potentially the home page or projects page
        revalidatePath('/home/curate');
        revalidatePath('/projects');
        revalidatePath('/');

        return { success: true };
    } catch (error) {
        console.error('Error updating project:', error);
        return { success: false, error: 'Failed to update project' };
    }
}

// --- Generic File Handlers ---

async function readJsonFile<T>(filename: string): Promise<T | null> {
    try {
        const filePath = path.join(process.cwd(), 'public/portfolio-data', filename);
        const data = await fs.readFile(filePath, 'utf-8');
        if (!data.trim()) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<boolean> {
    try {
        const filePath = path.join(process.cwd(), 'public/portfolio-data', filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// --- About ---

export async function getAboutData(): Promise<AboutData | null> {
    return readJsonFile<AboutData>('about.json');
}

export async function updateAboutData(data: AboutData) {
    const success = await writeJsonFile('about.json', data);
    if (success) {
        revalidatePath('/home/about');
        revalidatePath('/about'); // Public page
    }
    return { success };
}

// --- Skills ---

export async function getSkillsData(): Promise<SkillsData | null> {
    return readJsonFile<SkillsData>('skills.json');
}

export async function updateSkillsData(data: SkillsData) {
    const success = await writeJsonFile('skills.json', data);
    if (success) {
        revalidatePath('/home/skills');
        revalidatePath('/skills');
    }
    return { success };
}

// --- Experience ---

export async function getExperienceData(): Promise<ExperienceData[] | null> {
    return readJsonFile<ExperienceData[]>('experience.json');
}

export async function updateExperienceData(data: ExperienceData[]) {
    const success = await writeJsonFile('experience.json', data);
    if (success) {
        revalidatePath('/home/experience');
        revalidatePath('/experience');
    }
    return { success };
}
