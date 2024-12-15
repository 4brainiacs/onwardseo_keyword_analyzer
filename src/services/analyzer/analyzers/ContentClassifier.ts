import { logger } from '../../../utils/logger';

interface ContentCategory {
  name: string;
  confidence: number;
  keywords: string[];
}

interface ClassificationResult {
  primaryCategory: ContentCategory;
  secondaryCategories: ContentCategory[];
}

export class ContentClassifier {
  private categories: Map<string, Set<string>>;

  constructor() {
    this.categories = new Map();
    this.initializeCategories();
  }

  classify(text: string, keywords: string[]): ClassificationResult {
    try {
      const scores = new Map<string, number>();

      this.categories.forEach((categoryKeywords, category) => {
        const score = this.calculateScore(text, keywords, categoryKeywords);
        scores.set(category, score);
      });

      const sortedCategories = Array.from(scores.entries())
        .map(([name, score]) => ({
          name,
          confidence: score,
          keywords: this.getMatchingKeywords(keywords, this.categories.get(name) || new Set())
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .filter(cat => cat.confidence > 0);

      return {
        primaryCategory: sortedCategories[0] || {
          name: 'Uncategorized',
          confidence: 0,
          keywords: []
        },
        secondaryCategories: sortedCategories.slice(1, 4)
      };
    } catch (error) {
      logger.error('Content classification failed:', error);
      return {
        primaryCategory: {
          name: 'Uncategorized',
          confidence: 0,
          keywords: []
        },
        secondaryCategories: []
      };
    }
  }

  private calculateScore(text: string, keywords: string[], categoryKeywords: Set<string>): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    keywords.forEach(keyword => {
      if (Array.from(categoryKeywords).some(ck => keyword.includes(ck))) {
        score += 2;
      }
    });

    categoryKeywords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (lowerText.match(regex) || []).length;
      score += matches * 0.5;
    });

    return Math.min(score / 10, 1);
  }

  private getMatchingKeywords(keywords: string[], categoryKeywords: Set<string>): string[] {
    return keywords.filter(keyword => 
      Array.from(categoryKeywords).some(ck => keyword.includes(ck))
    );
  }

  private initializeCategories() {
    this.categories.set('technology', new Set([
      'software', 'hardware', 'digital', 'tech', 'computer', 'mobile',
      'app', 'data', 'cloud', 'ai', 'automation', 'cyber', 'web'
    ]));

    this.categories.set('business', new Set([
      'business', 'marketing', 'finance', 'management', 'strategy',
      'sales', 'market', 'revenue', 'startup', 'enterprise'
    ]));

    this.categories.set('health', new Set([
      'health', 'medical', 'wellness', 'fitness', 'diet',
      'nutrition', 'exercise', 'healthcare', 'mental'
    ]));

    this.categories.set('education', new Set([
      'education', 'learning', 'teaching', 'academic', 'school',
      'university', 'training', 'course', 'study'
    ]));
  }
}