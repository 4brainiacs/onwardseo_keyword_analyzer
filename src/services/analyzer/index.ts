import { KeywordExtractor } from './keywordExtractor';
import { SemanticAnalyzer } from './semanticAnalyzer';
import { ContentClassifier } from './contentClassifier';
import type { AnalysisResult, KeywordAnalysis } from '../../types/analysis';
import type { Classification } from '../../types/classification';
import { CacheService } from '../cache/cacheService';

export class Analyzer {
  private keywordExtractor: KeywordExtractor;
  private semanticAnalyzer: SemanticAnalyzer;
  private contentClassifier: ContentClassifier;
  private cache: CacheService<AnalysisResult>;

  constructor() {
    this.keywordExtractor = new KeywordExtractor();
    this.semanticAnalyzer = new SemanticAnalyzer();
    this.contentClassifier = new ContentClassifier();
    this.cache = new CacheService<AnalysisResult>();
  }

  public async analyze(
    content: string,
    options: { useCache?: boolean; includeSemantic?: boolean; includeClassification?: boolean } = {}
  ): Promise<AnalysisResult> {
    const cacheKey = this.generateCacheKey(content);

    if (options.useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const keywordsByLength = this.keywordExtractor.extractKeywords(content);
    const context = this.extractContext(content);
    const processedKeywords = new Map<number, KeywordAnalysis[]>();

    keywordsByLength.forEach((keywords, length) => {
      let processed: KeywordAnalysis[] = keywords;

      if (options.includeSemantic) {
        const combinedHeadings = [
          ...context.headings.h1,
          ...context.headings.h2,
          ...context.headings.h3,
          ...context.headings.h4
        ].filter(Boolean);

        processed = this.semanticAnalyzer.analyzeKeywords(processed, {
          title: context.title,
          headings: combinedHeadings,
          metaDescription: context.metaDescription
        });
      }

      processedKeywords.set(length, processed);
    });

    const result: AnalysisResult = {
      title: context.title,
      metaDescription: context.metaDescription || '',
      headings: context.headings,
      totalWords: content.split(/\s+/).length,
      twoWordPhrases: processedKeywords.get(2) || [],
      threeWordPhrases: processedKeywords.get(3) || [],
      fourWordPhrases: processedKeywords.get(4) || [],
      scrapedContent: content,
      classification: undefined
    };

    if (options.includeClassification) {
      const allKeywords = Array.from(processedKeywords.values())
        .flat()
        .map(k => k.keyword);
      const classification = this.contentClassifier.classifyContent(
        content,
        allKeywords
      ) as Classification;
      result.classification = classification;
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
    const lines = content.split('\n');
    const title = lines.find(l => l.includes('<title>'))?.replace(/<\/?title>/g, '') || '';
    const headings = {
      h1: [] as string[],
      h2: [] as string[],
      h3: [] as string[],
      h4: [] as string[]
    };

    lines
      .filter(l => /<h[1-4][^>]*>/.test(l))
      .forEach(l => {
        const level = parseInt(l.match(/<h([1-4])/)?.[1] || '0');
        const text = l.replace(/<[^>]+>/g, '').trim();
        switch (level) {
          case 1: headings.h1.push(text); break;
          case 2: headings.h2.push(text); break;
          case 3: headings.h3.push(text); break;
          case 4: headings.h4.push(text); break;
        }
      });

    return {
      title,
      headings,
      metaDescription: lines.find(l => l.includes('meta name="description"'))?.match(/content="([^"]+)"/)?.[1] || ''
    };
  }
}