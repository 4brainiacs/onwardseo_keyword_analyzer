import { KeywordAnalysis } from '../../types';

export interface SemanticContext {
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

  public analyzeKeywords(
    keywords: KeywordAnalysis[],
    context: SemanticContext
  ): KeywordAnalysis[] {
    return keywords.map(keyword => ({
      ...keyword,
      prominence: this.calculateProminence(keyword.keyword, context),
      semanticScore: this.calculateSemanticScore(keyword.keyword, context)
    }));
  }

  private calculateProminence(keyword: string, context: SemanticContext): number {
    const scores = {
      title: context.title.toLowerCase().includes(keyword) ? 2.0 : 0,
      headings: context.headings.reduce((score: number, heading: string) => {
        return heading.toLowerCase().includes(keyword) ? score + 1.0 : score;
      }, 0),
      meta: context.metaDescription?.toLowerCase().includes(keyword) ? 1.0 : 0
    };

    const totalScore = scores.title + scores.headings + scores.meta;
    const maxPossibleScore = 2.0 + context.headings.length + 1.0;

    return totalScore / maxPossibleScore;
  }

  private calculateSemanticScore(keyword: string, context: SemanticContext): number {
    let score = 0;
    const words = keyword.split(' ');

    // Check for semantic relationships
    words.forEach(word => {
      this.semanticGroups.forEach((relatedWords) => {
        if (relatedWords.has(word)) {
          score += 0.5;
        }
      });
    });

    // Context relevance
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
    // Initialize with some basic semantic relationships
    // This could be expanded with a proper NLP library or API
    this.semanticGroups.set('size', new Set(['big', 'large', 'small', 'tiny', 'huge']));
    this.semanticGroups.set('time', new Set(['quick', 'fast', 'slow', 'rapid', 'instant']));
    this.semanticGroups.set('quality', new Set(['good', 'great', 'best', 'better', 'excellent']));
    // Add more semantic groups as needed
  }
}