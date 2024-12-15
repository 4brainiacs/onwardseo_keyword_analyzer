import { logger } from '../../utils/logger';

export function extractMetadata($) {
  try {
    const title = $('title').text().trim() || 'Untitled Page';
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
    const canonicalUrl = $('link[rel="canonical"]').attr('href')?.trim();
    const language = $('html').attr('lang')?.trim();

    logger.debug('Metadata extracted', { title, hasDescription: !!metaDescription });

    return {
      title,
      metaDescription,
      canonicalUrl,
      language
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