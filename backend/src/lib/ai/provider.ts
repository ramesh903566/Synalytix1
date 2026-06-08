import { GoogleGenAI } from '@google/genai';

// ═══════════════════════════════════════════════════════════════════════════
// AI Provider Abstraction
// ═══════════════════════════════════════════════════════════════════════════

export interface AIProvider {
  complete(systemPrompt: string, userPrompt: string): Promise<string>;
  readonly name: string;
}

// ─── Gemini Provider ────────────────────────────────────────────────────────

class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  private client: GoogleGenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is required');
    this.client = new GoogleGenAI({ apiKey });
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '4000', 10);
    const temperature = parseFloat(process.env.AI_TEMPERATURE || '0.4');

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: maxTokens,
        temperature,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Gemini returned empty response');
    return text;
  }
}

// ─── Anthropic Provider ─────────────────────────────────────────────────────

class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is required');

    const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '4000', 10);
    const temperature = parseFloat(process.env.AI_TEMPERATURE || '0.4');
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed (${response.status}): ${await response.text()}`);
    }

    const data = await response.json() as {
      content?: Array<{ type: string; text?: string }>;
    };
    const block = data.content?.[0];
    if (!block || block.type !== 'text' || !block.text) {
      throw new Error('Anthropic returned empty or non-text response');
    }
    return block.text;
  }
}

// ─── OpenAI Provider ────────────────────────────────────────────────────────

class OpenAIProvider implements AIProvider {
  readonly name = 'openai';

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is required');

    const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '4000', 10);
    const temperature = parseFloat(process.env.AI_TEMPERATURE || '0.4');
    const model = process.env.OPENAI_MODEL || 'gpt-4o';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed (${response.status}): ${await response.text()}`);
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenAI returned empty response');
    return text;
  }
}

// ─── Factory ────────────────────────────────────────────────────────────────

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const providerName = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  switch (providerName) {
    case 'gemini':
      _provider = new GeminiProvider();
      break;
    case 'anthropic':
      _provider = new AnthropicProvider();
      break;
    case 'openai':
      _provider = new OpenAIProvider();
      break;
    default:
      throw new Error(`Unknown AI_PROVIDER: ${providerName}. Use gemini, anthropic, or openai.`);
  }

  return _provider;
}
