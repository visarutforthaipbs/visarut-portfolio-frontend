/**
 * Signal 39 — Cognitive Resource Accounting
 *
 * Treats human attention as a finite biological limit:
 * 39 bits per second, yielding a daily budget of 184 KB.
 */

const BPS = 39; // biological bit-rate limit
const DAILY_BUDGET_KB = 184;
const WORDS_PER_MINUTE = 250;
const BITS_PER_KB = 8192; // 1 KB = 8 * 1024 bits

export interface CognitiveCostResult {
  /** Total attention cost in KB, rounded to 1 decimal */
  kbCost: number;
  /** Percentage of the 184 KB daily budget, rounded to 1 decimal */
  percentageOfDaily: number;
  /** Estimated reading time in seconds */
  readingTimeSeconds: number;
  /** Total bits consumed */
  totalBits: number;
}

export function calculateCognitiveCost(wordCount: number): CognitiveCostResult {
  const readingTimeMinutes = wordCount / WORDS_PER_MINUTE;
  const readingTimeSeconds = readingTimeMinutes * 60;
  const totalBits = readingTimeSeconds * BPS;
  const kbCost = Math.round((totalBits / BITS_PER_KB) * 10) / 10;
  const percentageOfDaily =
    Math.round((kbCost / DAILY_BUDGET_KB) * 1000) / 10;

  return { kbCost, percentageOfDaily, readingTimeSeconds, totalBits };
}

/**
 * Strip HTML tags and count words in a content string.
 */
export function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").length;
}
