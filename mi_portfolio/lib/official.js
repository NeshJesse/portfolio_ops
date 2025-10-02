import fs from "fs";
import path from "path";
import { getProjects } from "@/lib/projects";

function getOfficialFilePath() {
  return path.resolve(process.cwd(), "..", "portfolio_cli", "portfolio-data", "official-projects.json");
}

export async function getOfficialSlugs() {
  const filePath = getOfficialFilePath();
  try {
    const raw = await fs.promises.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.slugs) ? parsed.slugs : [];
  } catch (_) {
    // Fallback to route if FS missing
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const res = await fetch(`${base}/official-projects`, { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json?.slugs) ? json.slugs : [];
    } catch (_) {
      return [];
    }
  }
}

export async function getOfficialProjects() {
  const [projects, slugs] = await Promise.all([getProjects(), getOfficialSlugs()]);
  const set = new Set(slugs);
  return projects.filter((p) => set.has(p.slug));
}


