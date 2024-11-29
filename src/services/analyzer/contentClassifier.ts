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

  public classifyContent(text: string, keywords: string[]): ClassificationResult {
    const scores = new Map<string, number>();

    if (!text || !Array.isArray(keywords) || keywords.length === 0) {
      return {
        primaryCategory: {
          name: 'Uncategorized',
          confidence: 0,
          keywords: []
        },
        secondaryCategories: [] as ContentCategory[]
      };
    }

    // Calculate scores for each category
    this.categories.forEach((categoryKeywords, category) => {
      const score = this.calculateCategoryScore(text, keywords, categoryKeywords);
      scores.set(category, score);
    });

    // Sort categories by score
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
      secondaryCategories: sortedCategories.slice(1, 4).filter(cat => cat.confidence > 0.1)
    };
  }

  private calculateCategoryScore(
    text: string, 
    keywords: string[], 
    categoryKeywords: Set<string>
  ): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Keyword matches
    keywords.forEach(keyword => {
      if (Array.from(categoryKeywords).some(ck => keyword.includes(ck))) {
        score += 2;
      }
    });

    // Direct word matches
    categoryKeywords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (lowerText.match(regex) || []).length;
      score += matches * 0.5;
    });

    return Math.min(score / 10, 1); // Normalize to 0-1
  }

  private getMatchingKeywords(
    keywords: string[], 
    categoryKeywords: Set<string>
  ): string[] {
    return keywords.filter(keyword => 
      Array.from(categoryKeywords).some(ck => keyword.includes(ck))
    );
  }

  private initializeCategories() {
    // Technology
    this.categories.set('technology', new Set([
      'software', 'hardware', 'digital', 'tech', 'computer', 'mobile',
      'app', 'data', 'cloud', 'ai', 'automation', 'cyber', 'web'
    ]));

    // Business
    this.categories.set('business', new Set([
      'business', 'marketing', 'finance', 'management', 'strategy',
      'sales', 'market', 'revenue', 'startup', 'enterprise'
    ]));

    // Health
    this.categories.set('health', new Set([
      'health', 'medical', 'wellness', 'fitness', 'diet',
      'nutrition', 'exercise', 'healthcare', 'mental'
    ]));

    // Education
    this.categories.set('education', new Set([
      'education', 'learning', 'teaching', 'academic', 'school',
      'university', 'training', 'course', 'study'
    ]));

    // Add more categories as needed
  }
}