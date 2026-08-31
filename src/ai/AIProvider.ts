/**
 * AIProvider is the single abstraction the rest of the app talks to.
 * Every agent (contentStrategist, copywriter, artDirector, contentReviewer)
 * calls `generateText`. `imageGenerator` calls `generateImage`.
 *
 * Swapping the underlying model/vendor later means writing one new class
 * that implements this interface and pointing `getAIProvider()` at it —
 * nothing in components, services, or agents needs to change.
 */

export interface TextGenerationOptions {
  system?: string;
  temperature?: number;
  maxTokens?: number;
  /** Hint for mock/demo mode so it can return a plausible canned shape. */
  intent?: string;
}

export interface ImageGenerationOptions {
  width: number;
  height: number;
  style?: string;
}

export interface ImageGenerationResult {
  /** data: URL or remote URL. Undefined in demo mode -> renderer falls back to a graphic composition. */
  url?: string;
  provider: string;
}

export interface AIProvider {
  readonly name: string;
  readonly isDemo: boolean;
  generateText(prompt: string, options?: TextGenerationOptions): Promise<string>;
  generateImage(
    prompt: string,
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResult>;
}
