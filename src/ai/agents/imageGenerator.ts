import { getAIProvider } from "../getAIProvider";
import { VisualDirection } from "@/types/slide";

/**
 * Only called for slides the art director flagged as actually needing a
 * photo/illustration. Text, layout, color and spacing are never delegated
 * to an image model — they're rendered deterministically (see
 * src/components/render/SlideCanvas.tsx) so they stay pixel-controlled.
 */
export async function runImageGenerator(
  direction: VisualDirection,
  width: number,
  height: number
): Promise<VisualDirection> {
  if (!direction.imageNeeded || !direction.imageDescription) return direction;

  const provider = getAIProvider();
  const result = await provider.generateImage(direction.imageDescription, {
    width,
    height,
  });

  return { ...direction, imageUrl: result.url };
}
