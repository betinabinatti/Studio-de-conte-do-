import { AIProvider } from "./AIProvider";
import { MockAIProvider } from "./providers/mockProvider";
import { AnthropicAIProvider } from "./providers/anthropicProvider";

let cachedProvider: AIProvider | null = null;

/**
 * Single choke point for picking the active AIProvider. Everything else in
 * the app (agents, API routes) calls getAIProvider() instead of importing a
 * concrete provider — so switching vendors later is a one-file change.
 */
export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  const apiKey = process.env.AI_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    cachedProvider = new AnthropicAIProvider(apiKey, process.env.AI_MODEL);
  } else {
    cachedProvider = new MockAIProvider();
  }

  return cachedProvider;
}
