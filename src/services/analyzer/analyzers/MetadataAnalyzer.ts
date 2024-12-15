import { load } from 'cheerio';
import { logger } from '../../../utils/logger';

export class MetadataAnalyzer {
  extract(html: string) {
    try {
      const $ = load(html);

      return {
        title: $('title').text().trim() || 'Untitled Page',
        metaDescription: $('meta[name="description"]').attr('content')?.trim() || '',
        canonicalUrl: $('link[rel="canonical"]').attr('href')?.trim(),
        language: $('html').attr('lang')?.trim()
      };
    } catch (error) {
      logger.error('Metadata extraction failed:', error);
      return {
        title: 'Untitled Page',
        metaDescription: '',
        canonicalUrl: null,
        language: null
      };
    }
  }
}