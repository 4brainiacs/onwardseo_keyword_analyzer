import { logger } from '../../../utils/logger';
import type { PageHeadings } from '../../../types';

export class HeadingExtractor {
  extract(html: string): { 
    title: string; 
    metaDescription: string; 
    headings: PageHeadings; 
  } {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      return {
        title: this.extractTitle(doc),
        metaDescription: this.extractMetaDescription(doc),
        headings: this.extractHeadings(doc)
      };
    } catch (error) {
      logger.error('Heading extraction failed:', error);
      throw error;
    }
  }

  private extractTitle(doc: Document): string {
    return doc.title.trim() || 'Untitled Page';
  }

  private extractMetaDescription(doc: Document): string {
    return doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  }

  private extractHeadings(doc: Document): PageHeadings {
    return {
      h1: Array.from(doc.querySelectorAll('h1')).map(el => el.textContent?.trim() || ''),
      h2: Array.from(doc.querySelectorAll('h2')).map(el => el.textContent?.trim() || ''),
      h3: Array.from(doc.querySelectorAll('h3')).map(el => el.textContent?.trim() || ''),
      h4: Array.from(doc.querySelectorAll('h4')).map(el => el.textContent?.trim() || '')
    };
  }
}