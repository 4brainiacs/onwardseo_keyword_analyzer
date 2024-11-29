import { KeywordAnalysis } from '../../types';

interface ExtractionOptions {
  minWordLength: number;
  maxPhraseLength: number;
  stopWords: Set<string>;
  minOccurrences: number;
}

const DEFAULT_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with'
]);

export class KeywordExtractor {
  private options: ExtractionOptions;

  constructor(options: Partial<ExtractionOptions> = {}) {
    this.options = {
      minWordLength: options.minWordLength || 3,
      maxPhraseLength: options.maxPhraseLength || 4,
      stopWords: options.stopWords || DEFAULT_STOP_WORDS,
      minOccurrences: options.minOccurrences || 2
    };
  }

  public extractKeywords(text: string): Map<number, KeywordAnalysis[]> {
    const cleanedText = this.cleanText(text);
    const words = this.tokenize(cleanedText);
    const results = new Map<number, KeywordAnalysis[]>();

    // Extract phrases of different lengths
    for (let length = 2; length <= this.options.maxPhraseLength; length++) {
      const phrases = this.extractPhrases(words, length);
      results.set(length, this.analyzePhrases(phrases, words.length));
    }

    return results;
  }

  private cleanText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return text
      .split(' ')
      .filter(word => 
        word.length >= this.options.minWordLength &&
        !this.options.stopWords.has(word)
      );
  }

  private extractPhrases(words: string[], length: number): Map<string, number> {
    const phrases = new Map<string, number>();

    for (let i = 0; i <= words.length - length; i++) {
      const phrase = words.slice(i, i + length).join(' ');
      if (this.isValidPhrase(phrase)) {
        phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
      }
    }

    return phrases;
  }

  private isValidPhrase(phrase: string): boolean {
    const words = phrase.split(' ');
    return words.every(word => 
      word.length >= this.options.minWordLength &&
      !this.options.stopWords.has(word)
    );
  }

  private analyzePhrases(phrases: Map<string, number>, totalWords: number): KeywordAnalysis[] {
    return Array.from(phrases.entries())
      .filter(([_, count]) => count >= this.options.minOccurrences)
      .map(([phrase, count]) => ({
        keyword: phrase,
        count,
        density: count / (totalWords - phrase.split(' ').length + 1),
        prominence: 0 // Will be calculated later with document structure
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}