import fs from "fs";
import path from "path";

function readFromFsIfAvailable() {
  const filePath = path.resolve(process.cwd(), "..","portfolio_cli", "portfolio-data", "projects.json");
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }
  return null;
}

async function readViaRoute() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/portfolio-data/projects.json`, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

async function readProjects() {
  const fsData = readFromFsIfAvailable();
  if (fsData) return fsData;
  const routeData = await readViaRoute();
  return routeData || [];
}

export async function getProjects() {
  const parsed = await readProjects();
  return Array.isArray(parsed) ? parsed : Array.isArray(parsed?.projects) ? parsed.projects : [];
}

export async function getProjectBySlug(slug) {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getProjectSlugs() {
  const projects = await getProjects();
  return projects.map((p) => p.slug);
}

export async function getMeta() {
  const parsed = await readProjects();
  return Array.isArray(parsed) ? {} : parsed?.meta || {};
}


