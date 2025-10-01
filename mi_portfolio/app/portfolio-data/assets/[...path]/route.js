import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  const segments = Array.isArray(params?.path) ? params.path : [];

  const baseDir = path.resolve(process.cwd(), "..", "portfolio-data", "assets");
  const targetPath = path.resolve(baseDir, ...segments);

  if (!targetPath.startsWith(baseDir)) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const stat = await fs.promises.stat(targetPath);
    if (stat.isDirectory()) {
      return new Response("Not Found", { status: 404 });
    }

    const file = await fs.promises.readFile(targetPath);
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = getContentType(ext);
    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    return new Response("Not Found", { status: 404 });
  }
}

function getContentType(ext) {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    case ".json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
}


