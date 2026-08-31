import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: { contentId: string; fileName: string } }
) {
  const safeContentId = path.basename(params.contentId);
  const safeFileName = path.basename(params.fileName);
  const filePath = path.join(process.cwd(), "data", "exports", safeContentId, safeFileName);

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: { "Content-Type": "image/png" },
    });
  } catch {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
}
