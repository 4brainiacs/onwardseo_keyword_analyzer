import { logger } from '../../utils/logger';
import type { KeywordAnalysis } from '../../types';

export class KeywordExtractor {
  extractPhrases(words: string[], length: number): KeywordAnalysis[] {
    try {
      const phrases = new Map<string, number>();
      const totalWords = words.length;

      // Generate phrases
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(' ');
        if (this.isValidPhrase(phrase)) {
          phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
        }
      }

      // Convert to array and calculate metrics
      return Array.from(phrases.entries())
        .map(([keyword, count]) => ({
          keyword,
          count,
          density: this.calculateDensity(count, totalWords, length),
          prominence: 0 // Will be calculated later
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    } catch (error) {
      logger.error('Phrase extraction failed:', error);
      return [];
    }
  }

  private isValidPhrase(phrase: string): boolean {
    return (
      phrase.length >= 3 &&
      !/^\d+$/.test(phrase) &&
      !/^[^a-z]+$/.test(phrase)
    );
  }

  private calculateDensity(count: number, totalWords: number, phraseLength: number): number {
    return Number((count / (totalWords - phraseLength + 1)).toFixed(4));
  }
}