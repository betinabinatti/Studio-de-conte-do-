import Anthropic from "@anthropic-ai/sdk";
import {
  AIProvider,
  ImageGenerationOptions,
  ImageGenerationResult,
  TextGenerationOptions,
} from "../AIProvider";

/**
 * Real text provider backed by Claude. Anthropic has no first-party image
 * generation endpoint, so generateImage stays a demo-mode fallback here —
 * the renderer composes the slide graphically instead. Swap this class (or
 * add a sibling implementing AIProvider) to plug in an image vendor via
 * IMAGE_API_KEY without touching agents or components.
 */
export class AnthropicAIProvider implements AIProvider {
  readonly name = "anthropic";
  readonly isDemo = false;
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = "claude-sonnet-4-5") {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generateText(prompt: string, options: TextGenerationOptions = {}): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens ?? 2000,
      temperature: options.temperature ?? 0.7,
      system: options.system,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock && "text" in textBlock ? textBlock.text : "";
  }

  async generateImage(
    _prompt: string,
    _options: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    return { url: undefined, provider: "anthropic-unsupported" };
  }
}
