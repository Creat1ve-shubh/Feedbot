import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const brand = url.searchParams.get("brand");
    const limit = url.searchParams.get("limit") || "100";
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const res = await fetch(`${baseUrl}/results?brand=${brand}&limit=${limit}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend responded with error", status: res.status, data },
        { status: res.status }
      );
    }
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Backend unavailable", details: err?.message || String(err) },
      { status: 502 }
    );
  }
}
