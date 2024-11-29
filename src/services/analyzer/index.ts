import { KeywordExtractor } from './keywordExtractor';
import { SemanticAnalyzer } from './semanticAnalyzer';
import { ContentClassifier } from './contentClassifier';
import { CacheService } from '../cache/cacheService';
import type { AnalysisResult, KeywordAnalysis } from '../../types';

interface AnalysisOptions {
  useCache?: boolean;
  includeSemantic?: boolean;
  includeClassification?: boolean;
}

export class ContentAnalyzer {
  private keywordExtractor: KeywordExtractor;
  private semanticAnalyzer: SemanticAnalyzer;
  private contentClassifier: ContentClassifier;
  private cache: CacheService<AnalysisResult>;

  constructor() {
    this.keywordExtractor = new KeywordExtractor();
    this.semanticAnalyzer = new SemanticAnalyzer();
    this.contentClassifier = new ContentClassifier();
    this.cache = new CacheService<AnalysisResult>({
      ttl: 3600000, // 1 hour
      maxSize: 100
    });
  }

  public async analyzeContent(
    content: string,
    options: AnalysisOptions = {}
  ): Promise<AnalysisResult> {
    const cacheKey = this.generateCacheKey(content);

    if (options.useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    // Extract basic keywords
    const keywordsByLength = this.keywordExtractor.extractKeywords(content);

    // Get context for semantic analysis
    const context = this.extractContext(content);

    // Process each keyword set
    const processedKeywords = new Map<number, KeywordAnalysis[]>();
    keywordsByLength.forEach((keywords, length) => {
      let processed = keywords;

      if (options.includeSemantic) {
        processed = this.semanticAnalyzer.analyzeKeywords(processed, context);
      }

      processedKeywords.set(length, processed);
    });

    // Create result
    const result: AnalysisResult = {
      title: context.title,
      headings: {
        h1: context.headings.filter(h => h.level === 1).map(h => h.text),
        h2: context.headings.filter(h => h.level === 2).map(h => h.text),
        h3: context.headings.filter(h => h.level === 3).map(h => h.text),
        h4: context.headings.filter(h => h.level === 4).map(h => h.text)
      },
      totalWords: content.split(/\s+/).length,
      twoWordPhrases: processedKeywords.get(2) || [],
      threeWordPhrases: processedKeywords.get(3) || [],
      fourWordPhrases: processedKeywords.get(4) || [],
      scrapedContent: content
    };

    if (options.includeClassification) {
      const allKeywords = Array.from(processedKeywords.values())
        .flat()
        .map(k => k.keyword);
      
      result.classification = this.contentClassifier.classifyContent(
        content,
        allKeywords
      );
    }

    if (options.useCache) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  private generateCacheKey(content: string): string {
    return Buffer.from(content).toString('base64').slice(0, 32);
  }

  private extractContext(content: string) {
    // Simple context extraction - could be improved with proper HTML parsing
    const lines = content.split('\n');
    const title = lines.find(l => l.includes('<title>'))?.replace(/<\/?title>/g, '') || '';
    const headings = lines
      .filter(l => /<h[1-4][^>]*>/.test(l))
      .map(l => {
        const level = parseInt(l.match(/<h([1-4])/)?.[1] || '0');
        const text = l.replace(/<[^>]+>/g, '').trim();
        return { level, text };
      });

    return {
      title,
      headings,
      metaDescription: lines.find(l => l.includes('meta name="description"'))
        ?.match(/content="([^"]+)"/)?.[1]
    };
  }
}