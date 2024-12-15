import { logger } from '../../../utils/logger';
import type { KeywordAnalysis, PageHeadings } from '../../../types';

interface AnalysisContext {
  title: string;
  headings: PageHeadings;
  metaDescription: string;
}

export class KeywordAnalyzer {
  analyze(words: string[], context: AnalysisContext) {
    try {
      return {
        twoWordPhrases: this.generatePhrases(words, 2, context),
        threeWordPhrases: this.generatePhrases(words, 3, context),
        fourWordPhrases: this.generatePhrases(words, 4, context)
      };
    } catch (error) {
      logger.error('Keyword analysis failed:', error);
      throw error;
    }
  }

  private generatePhrases(words: string[], length: number, context: AnalysisContext): KeywordAnalysis[] {
    const phrases = new Map<string, number>();
    const totalWords = words.length;

    for (let i = 0; i <= words.length - length; i++) {
      const phrase = words.slice(i, i + length).join(' ');
      if (this.isValidPhrase(phrase)) {
        phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
      }
    }

    return Array.from(phrases.entries())
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: this.calculateDensity(count, totalWords, length),
        prominence: this.calculateProminence(keyword, context)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
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

  private calculateProminence(phrase: string, context: AnalysisContext): number {
    const weights = {
      title: 2.0,
      h1: 1.5,
      h2: 1.2,
      h3: 1.0,
      h4: 0.8,
      metaDescription: 0.5,
      maxTotal: 7.0
    };

    let score = 0;
    const lowerPhrase = phrase.toLowerCase();

    if (context.title.toLowerCase().includes(lowerPhrase)) {
      score += weights.title;
    }
    if (context.metaDescription.toLowerCase().includes(lowerPhrase)) {
      score += weights.metaDescription;
    }
    if (context.headings.h1.some(h => h.toLowerCase().includes(lowerPhrase))) {
      score += weights.h1;
    }
    if (context.headings.h2.some(h => h.toLowerCase().includes(lowerPhrase))) {
      score += weights.h2;
    }
    if (context.headings.h3.some(h => h.toLowerCase().includes(lowerPhrase))) {
      score += weights.h3;
    }
    if (context.headings.h4.some(h => h.toLowerCase().includes(lowerPhrase))) {
      score += weights.h4;
    }

    return Number((score / weights.maxTotal).toFixed(4));
  }
}