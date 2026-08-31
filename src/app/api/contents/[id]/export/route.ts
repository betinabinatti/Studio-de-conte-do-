import { NextRequest, NextResponse } from "next/server";
import { saveExportFile } from "@/database/db";
import { getContent, saveContent } from "@/database/contentRepository";

interface ExportPayload {
  images: string[]; // base64 data URLs, one per slide, in order
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const content = await getContent(params.id);
  if (!content) return NextResponse.json({ error: "not-found" }, { status: 404 });

  const { images } = (await request.json()) as ExportPayload;

  const urls = await Promise.all(
    images.map((image, index) =>
      saveExportFile(params.id, `slide-${index + 1}.png`, image)
    )
  );

  const updated = await saveContent({
    ...content,
    exportedImages: urls,
    status: content.status === "rascunho" ? "pronto" : content.status,
  });

  return NextResponse.json(updated);
}
