import { AIOutputSchema, AIOutput } from '../../types/recommendations';

/**
 * Parse and validate AI response JSON.
 * Handles common AI quirks: markdown fences, preamble text, trailing commas.
 */
export function parseAIResponse(rawText: string): AIOutput {
  // Step 1: Strip markdown code fences
  let cleaned = rawText.trim();

  // Remove ```json ... ``` wrapping
  const jsonFencePattern = /^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/;
  const fenceMatch = cleaned.match(jsonFencePattern);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Remove any text before the first { and after the last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // Step 2: Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // Try fixing trailing commas
    const fixedTrailingCommas = cleaned.replace(/,\s*([\]}])/g, '$1');
    try {
      parsed = JSON.parse(fixedTrailingCommas);
    } catch {
      throw new Error(`Failed to parse AI response as JSON: ${(e as Error).message}\nRaw text (first 500 chars): ${rawText.slice(0, 500)}`);
    }
  }

  // Step 3: Validate against Zod schema
  const result = AIOutputSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map(i => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`AI response failed schema validation:\n${issues}`);
  }

  return result.data;
}
