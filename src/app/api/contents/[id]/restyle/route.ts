import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/database/contentRepository";
import { getBrandProfile } from "@/database/brandRepository";
import { runArtDirector } from "@/ai/agents/artDirector";
import { runImageGenerator } from "@/ai/agents/imageGenerator";
import { FORMAT_DIMENSIONS } from "@/types/brief";
import { recentFeedTiers } from "@/services/contentService";

/** "Alterar visual": keeps the copy untouched, asks the art director for a fresh composition. */
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const content = await getContent(params.id);
  if (!content) return NextResponse.json({ error: "not-found" }, { status: 404 });

  const brand = await getBrandProfile();
  const recentTiers = await recentFeedTiers(params.id);

  let visualDirections = await runArtDirector(content.slides, brand, recentTiers);

  const dimensions = FORMAT_DIMENSIONS[content.brief.format];
  visualDirections = await Promise.all(
    visualDirections.map((direction) =>
      runImageGenerator(direction, dimensions.width, dimensions.height)
    )
  );

  const updated = await saveContent({ ...content, visualDirections });
  return NextResponse.json(updated);
}
