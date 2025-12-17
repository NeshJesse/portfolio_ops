import { SkillsData, ExperienceData, ContactData, AboutData } from "@/types/project";

export async function getMarkdown(file: string): Promise<string> {
  try {
    // Server: read from filesystem (public/portfolio-data)
    if (typeof window === "undefined") {
      const { readFile } = await import("fs/promises");
      const path = (await import("path")).join(process.cwd(), "public", "portfolio-data", file);
      return await readFile(path, "utf8");
    }

    // Client: fetch from public path
    const response = await fetch(`/portfolio-data/${file}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${file}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading markdown file ${file}:`, error);
    return "";
  }
}

export async function getJson<T>(file: string): Promise<T | null> {
  try {
    if (typeof window === "undefined") {
      const { readFile } = await import("fs/promises");
      const path = (await import("path")).join(process.cwd(), "public", "portfolio-data", file);
      const raw = await readFile(path, "utf8");
      return JSON.parse(raw) as T;
    }

    const response = await fetch(`/portfolio-data/${file}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${file}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading JSON file ${file}:`, error);
    return null;
  }
}

export async function getSkills(): Promise<SkillsData | null> {
  return await getJson<SkillsData>("skills.json");
}

export async function getExperience(): Promise<ExperienceData[]> {
  const data = await getJson<ExperienceData[]>("experience.json");
  return data || [];
}

export async function getContact(): Promise<ContactData | null> {
  return await getJson<ContactData>("contact.json");
}

export async function getAbout(): Promise<AboutData | null> {
  return await getJson<AboutData>("about.json");
}
