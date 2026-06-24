import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // validate → call DB/external API → return response
  return NextResponse.json({ user, tokens }, { status: 200 });
}