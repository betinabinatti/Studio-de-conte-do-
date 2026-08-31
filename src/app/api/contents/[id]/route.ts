import { NextRequest, NextResponse } from "next/server";
import { contentService } from "@/services/contentService";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const content = await contentService.get(params.id);
  if (!content) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const saved = await contentService.save({ ...body, id: params.id });
  return NextResponse.json(saved);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await contentService.remove(params.id);
  return NextResponse.json({ ok: true });
}
