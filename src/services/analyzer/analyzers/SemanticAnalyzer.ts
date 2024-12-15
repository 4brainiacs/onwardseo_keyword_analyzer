import { logger } from '../../../utils/logger';
import type { KeywordAnalysis } from '../../../types';

interface SemanticContext {
  title: string;
  headings: string[];
  metaDescription?: string;
}

export class SemanticAnalyzer {
  private semanticGroups: Map<string, Set<string>>;

  constructor() {
    this.semanticGroups = new Map();
    this.initializeSemanticGroups();
  }

  analyzeKeywords(keywords: KeywordAnalysis[], context: SemanticContext): KeywordAnalysis[] {
    try {
      return keywords.map(keyword => ({
        ...keyword,
        semanticScore: this.calculateSemanticScore(keyword.keyword, context)
      }));
    } catch (error) {
      logger.error('Semantic analysis failed:', error);
      return keywords;
    }
  }

  private calculateSemanticScore(keyword: string, context: SemanticContext): number {
    let score = 0;
    const words = keyword.split(' ');

    words.forEach(word => {
      this.semanticGroups.forEach((relatedWords) => {
        if (relatedWords.has(word)) {
          score += 0.5;
        }
      });
    });

    if (this.isRelevantToContext(keyword, context)) {
      score += 1.0;
    }

    return Math.min(score, 1);
  }

  private isRelevantToContext(keyword: string, context: SemanticContext): boolean {
    const contentText = [
      context.title,
      ...context.headings,
      context.metaDescription || ''
    ].join(' ').toLowerCase();

    const relatedTerms = this.findRelatedTerms(keyword);
    return relatedTerms.some(term => contentText.includes(term));
  }

  private findRelatedTerms(keyword: string): string[] {
    const related = new Set<string>();
    const words = keyword.split(' ');

    words.forEach(word => {
      this.semanticGroups.forEach((group) => {
        if (group.has(word)) {
          group.forEach(term => related.add(term));
        }
      });
    });

    return Array.from(related);
  }

  private initializeSemanticGroups() {
    this.semanticGroups.set('size', new Set(['big', 'large', 'small', 'tiny', 'huge']));
    this.semanticGroups.set('time', new Set(['quick', 'fast', 'slow', 'rapid', 'instant']));
    this.semanticGroups.set('quality', new Set(['good', 'great', 'best', 'better', 'excellent']));
  }
}