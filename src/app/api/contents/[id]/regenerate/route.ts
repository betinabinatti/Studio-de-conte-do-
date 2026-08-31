import { NextRequest, NextResponse } from "next/server";
import { contentService } from "@/services/contentService";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const regenerated = await contentService.regenerate(params.id);
  if (!regenerated) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json(regenerated);
}
