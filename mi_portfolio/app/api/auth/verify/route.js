export async function POST(request) {
  try {
    const { password } = await request.json();
    const expected = process.env.EDIT_PASSWORD || "";
    if (!expected) {
      return Response.json({ ok: false, error: "Not configured" }, { status: 500 });
    }
    const ok = typeof password === "string" && password === expected;
    if (!ok) {
      return Response.json({ ok: false }, { status: 401 });
    }
    return Response.json({ ok: true });
  } catch (_) {
    return Response.json({ ok: false }, { status: 400 });
  }
}


