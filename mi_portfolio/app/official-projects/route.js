import fs from "fs";
import path from "path";

function getOfficialFilePath() {
  return path.resolve(process.cwd(), "..", "portfolio_cli", "portfolio-data", "official-projects.json");
}

export async function GET() {
  const filePath = getOfficialFilePath();
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return new Response(data, {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (_) {
    return new Response(JSON.stringify({ slugs: [], keys: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const keys = Array.isArray(body?.keys) ? body.keys.filter((s) => typeof s === "string") : [];
    // Backward compatibility: accept slugs too, but prefer keys.
    const slugs = Array.isArray(body?.slugs) ? body.slugs.filter((s) => typeof s === "string") : [];
    const projects = Array.isArray(body?.projects) ? body.projects : [];
    const payload = JSON.stringify({ keys, slugs, projects }, null, 2);
    const filePath = getOfficialFilePath();
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, payload, "utf-8");
    return new Response(payload, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}


