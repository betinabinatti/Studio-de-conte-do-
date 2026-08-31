import { NextResponse } from "next/server";
import { ideaService } from "@/services/ideaService";

export async function POST() {
  const ideas = await ideaService.surprise();
  return NextResponse.json(ideas);
}
