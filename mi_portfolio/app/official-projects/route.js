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
    return new Response(JSON.stringify({ slugs: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const slugs = Array.isArray(body?.slugs) ? body.slugs.filter((s) => typeof s === "string") : [];
    const payload = JSON.stringify({ slugs }, null, 2);
    const filePath = getOfficialFilePath();
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, payload, "utf-8");
    return new Response(payload, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}


