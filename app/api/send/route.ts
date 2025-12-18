import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, webhook } = await req.json();

  if (!text || !webhook) {
    return NextResponse.json(
      { ok: false, error: "Missing text or webhook" },
      { status: 400 }
    );
  }

  const r = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text }),
  });

  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: "Discord rejected request" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
