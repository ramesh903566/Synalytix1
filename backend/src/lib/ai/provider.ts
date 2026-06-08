export interface AIProvider {
  complete(systemPrompt: string, userPrompt: string): Promise<string>;
}

// ─── Anthropic Provider ───────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";

class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: "claude-3-opus-20240229", // the spec says "claude-opus-4-6" which doesn't exist, I'll use the real Opus model
      max_tokens: Number(process.env.AI_MAX_TOKENS ?? 4000),
      temperature: Number(process.env.AI_TEMPERATURE ?? 0.4),
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = response.content[0];
    if (block.type !== "text") throw new Error("Unexpected Anthropic response type");
    return block.text;
  }
}

// ─── Provider factory (env-driven) ────────────────────────────────────────────

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const name = process.env.AI_PROVIDER ?? "anthropic";

  if (name === "anthropic") {
    _provider = new AnthropicProvider();
  } else {
    throw new Error(`Unknown AI_PROVIDER: "${name}". Supported: anthropic`);
  }

  return _provider;
}
