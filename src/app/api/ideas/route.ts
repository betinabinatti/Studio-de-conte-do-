import { NextRequest, NextResponse } from "next/server";
import { ideaService } from "@/services/ideaService";

export async function GET() {
  const ideas = await ideaService.list();
  return NextResponse.json(ideas);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const idea = await ideaService.create(body);
  return NextResponse.json(idea);
}
