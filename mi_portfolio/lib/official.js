import fs from "fs";
import path from "path";
import { getProjects } from "@/lib/projects";

function getOfficialFilePath() {
  return path.resolve(process.cwd(), "..", "portfolio_cli", "portfolio-data", "official-projects.json");
}

function buildProjectKey(project) {
  const preferred =
    project?.path ||
    project?.dir ||
    project?.root ||
    project?.location ||
    project?.project_dir ||
    project?.git?.remote_url ||
    project?.id;
  if (preferred) return `${project.slug}::${preferred}`;
  return `slug::${project.slug}`;
}

async function readOfficialPayload() {
  const filePath = getOfficialFilePath();
  try {
    const raw = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (_) {
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const res = await fetch(`${base}/official-projects`, { cache: "no-store" });
      if (!res.ok) return {};
      return await res.json();
    } catch (_) {
      return {};
    }
  }
}

export async function getOfficialProjects() {
  const [projects, official] = await Promise.all([getProjects(), readOfficialPayload()]);
  const keys = Array.isArray(official?.keys) ? official.keys : null;
  const slugs = !keys && Array.isArray(official?.slugs) ? official.slugs : null;
  const embedded = Array.isArray(official?.projects) ? official.projects : null;

  if (embedded && embedded.length) {
    // Ensure latest data by merging with current projects when possible (match by slug)
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    return embedded.map((p) => bySlug.get(p.slug) || p);
  }

  if (keys) {
    const set = new Set(keys);
    return projects.filter((p) => set.has(buildProjectKey(p)));
  }

  if (slugs) {
    const set = new Set(slugs);
    return projects.filter((p) => set.has(p.slug));
  }

  return [];
}


