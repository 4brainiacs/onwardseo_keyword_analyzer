import { load } from 'cheerio';
import { logger } from '../../../utils/logger';

interface PageMetadata {
  title: string;
  metaDescription: string;
  canonicalUrl?: string;
  language?: string;
}

export class MetadataAnalyzer {
  extract(html: string): PageMetadata {
    try {
      const $ = load(html);

      return {
        title: this.extractTitle($),
        metaDescription: this.extractMetaDescription($),
        canonicalUrl: this.extractCanonicalUrl($),
        language: this.extractLanguage($)
      };
    } catch (error) {
      logger.error('Metadata extraction failed:', error);
      return {
        title: 'Untitled Page',
        metaDescription: ''
      };
    }
  }

  private extractTitle($: cheerio.Root): string {
    return $('title').text().trim() || 'Untitled Page';
  }

  private extractMetaDescription($: cheerio.Root): string {
    return $('meta[name="description"]').attr('content')?.trim() || '';
  }

  private extractCanonicalUrl($: cheerio.Root): string | undefined {
    return $('link[rel="canonical"]').attr('href')?.trim();
  }

  private extractLanguage($: cheerio.Root): string | undefined {
    return $('html').attr('lang')?.trim();
  }
}