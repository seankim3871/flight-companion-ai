/** OpenAI request timeout (ms) */
export const OPENAI_TIMEOUT_MS = 20_000;

export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY?.trim();
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}
