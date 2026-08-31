import { NextResponse } from "next/server";
import { contentService } from "@/services/contentService";

export async function GET() {
  const contents = await contentService.list();
  return NextResponse.json(contents);
}
