import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.resolve(process.cwd(), "..", "portfolio-data", "projects.json");
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
  }
}


