import { NextRequest, NextResponse } from "next/server";
import { contentService } from "@/services/contentService";
import { ContentBrief } from "@/types/brief";

export async function POST(request: NextRequest) {
  const brief = (await request.json()) as ContentBrief;

  if (!brief.topic || !brief.topic.trim()) {
    return NextResponse.json({ error: "topic-required" }, { status: 400 });
  }

  const content = await contentService.generate(brief);
  return NextResponse.json(content);
}
