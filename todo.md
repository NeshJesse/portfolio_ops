 GET / 200 in 2.3s (compile: 2.2s, render: 157ms)
 GET / 200 in 549ms (compile: 298ms, render: 251ms)
 ○ Compiling /about ...
Error loading JSON file about.json: SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at getJson (lib/content.ts:30:19)
    at async getAbout (lib/content.ts:58:10)
    at async AboutPage (app/about/page.tsx:5:21)
  28 |       const path = (await import("path")).join(process.cwd(), "public", "portfolio-data", file);
  29 |       const raw = await readFile(path, "utf8");
> 30 |       return JSON.parse(raw) as T;
     |                   ^
  31 |     }
  32 |
  33 |     const response = await fetch(`/portfolio-data/${file}`);
 GET /about 200 in 7.2s (compile: 4.1s, render: 3.1s)

//error message 1 goes away

and 2 make the source of the projects the same as mi_portfolio:import fs from "fs";
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

