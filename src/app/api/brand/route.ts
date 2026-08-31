import { NextRequest, NextResponse } from "next/server";
import { brandService } from "@/services/brandService";

export async function GET() {
  const brand = await brandService.get();
  return NextResponse.json(brand);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const saved = await brandService.save(body);
  return NextResponse.json(saved);
}
