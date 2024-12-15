import type { CheerioAPI } from 'cheerio';
import { logger } from '../../../utils/logger';

interface PageMetadata {
  title: string;
  metaDescription: string;
  canonicalUrl?: string;
  language?: string;
}

export class MetadataExtractor {
  extract($: CheerioAPI): PageMetadata {
    try {
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

  private extractTitle($: CheerioAPI): string {
    return $('title').text().trim() || 'Untitled Page';
  }

  private extractMetaDescription($: CheerioAPI): string {
    return $('meta[name="description"]').attr('content')?.trim() || '';
  }

  private extractCanonicalUrl($: CheerioAPI): string | undefined {
    return $('link[rel="canonical"]').attr('href')?.trim();
  }

  private extractLanguage($: CheerioAPI): string | undefined {
    return $('html').attr('lang')?.trim();
  }
}