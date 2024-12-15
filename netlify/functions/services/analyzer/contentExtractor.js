import * as cheerio from 'cheerio';
import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../utils/logger';

export function extractContent(html) {
  try {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, noscript, iframe, svg').remove();

    const title = $('title').text().trim() || 'Untitled Page';
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
    
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get()
    };

    // Extract main content
    const textContent = $('body').text()
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!textContent) {
      throw new Error('No text content found in HTML');
    }

    return {
      title,
      metaDescription,
      headings,
      textContent
    };
  } catch (error) {
    logger.error('Content extraction failed:', error);
    throw new AnalysisError(
      'Content extraction failed',
      500,
      error.message,
      true
    );
  }
}