import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { scrapingService } from '../scraping/ScrapingService';
import type { AnalysisResult } from '../../types';

export class AnalyzerService {
  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting content analysis', { url });

      const content = await scrapingService.scrapeContent(url);
      
      if (!content || (typeof content === 'object' && !Object.keys(content).length)) {
        logger.error('Invalid or empty content received', { url });
        throw new AnalysisError(
          'Invalid content received',
          500,
          'The target URL returned invalid or empty content',
          false
        );
      }

      // Process the content based on its type
      const processedContent = this.processContent(content);
      logger.info('Content processed successfully');

      return processedContent;
    } catch (error) {
      logger.error('Analysis failed:', {
        error,
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error instanceof AnalysisError) {
        throw error;
      }

      throw new AnalysisError(
        'Analysis failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }

  private processContent(content: any): AnalysisResult {
    // Handle both JSON and raw HTML content
    const rawContent = content.rawContent || content;
    
    // Basic structure for now - expand based on your needs
    return {
      title: this.extractTitle(rawContent),
      metaDescription: this.extractMetaDescription(rawContent),
      headings: this.extractHeadings(rawContent),
      totalWords: this.countWords(rawContent),
      twoWordPhrases: [],
      threeWordPhrases: [],
      fourWordPhrases: [],
      scrapedContent: rawContent
    };
  }

  private extractTitle(content: string): string {
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'Untitled Page';
  }

  private extractMetaDescription(content: string): string {
    const metaMatch = content.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i);
    return metaMatch ? metaMatch[1].trim() : '';
  }

  private extractHeadings(content: string): { h1: string[], h2: string[], h3: string[], h4: string[] } {
    return {
      h1: this.extractHeadingsByTag(content, 'h1'),
      h2: this.extractHeadingsByTag(content, 'h2'),
      h3: this.extractHeadingsByTag(content, 'h3'),
      h4: this.extractHeadingsByTag(content, 'h4')
    };
  }

  private extractHeadingsByTag(content: string, tag: string): string[] {
    const regex = new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`, 'gi');
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
  }

  private countWords(content: string): number {
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').length;
  }
}

export const analyzerService = new AnalyzerService();