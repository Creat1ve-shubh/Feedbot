import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const brand = url.searchParams.get("brand");
  const limit = url.searchParams.get("limit") || "100";
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/results?brand=${brand}&limit=${limit}`
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
