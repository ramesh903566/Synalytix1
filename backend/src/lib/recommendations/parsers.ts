import { AIOutputSchema, type AIOutput } from "../../types/recommendations";

export function parseAIResponse(rawJson: string): AIOutput {
  try {
    const cleaned = rawJson
      .replace(/^```json/m, "")
      .replace(/^```/m, "")
      .trim();
    
    const parsed = JSON.parse(cleaned);
    return AIOutputSchema.parse(parsed);
  } catch (err) {
    throw new Error(`Failed to parse AI response: ${err instanceof Error ? err.message : String(err)}`);
  }
}
