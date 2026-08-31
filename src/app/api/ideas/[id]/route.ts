import { NextRequest, NextResponse } from "next/server";
import { ideaService } from "@/services/ideaService";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const saved = await ideaService.save({ ...body, id: params.id });
  return NextResponse.json(saved);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await ideaService.remove(params.id);
  return NextResponse.json({ ok: true });
}
