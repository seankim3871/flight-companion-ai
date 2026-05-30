/**
 * AI Arrival Assistant types.
 */

export type AIRecommendationErrorCode =
  | "CONFIG_ERROR"
  | "API_ERROR"
  | "TIMEOUT"
  | "INVALID_INPUT";

export interface AIRecommendationResult {
  success: boolean;
  /** Natural-language pickup recommendation (2–4 sentences) */
  recommendation?: string;
  error?: string;
  code?: AIRecommendationErrorCode;
  /** True when OpenAI was unavailable and a local fallback was used */
  fallback?: boolean;
}
