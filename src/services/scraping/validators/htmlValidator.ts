import { logger } from '../../../utils/logger';

export class HtmlValidator {
  isValidHtml(content: string): boolean {
    try {
      const cleaned = content.toLowerCase().trim();
      return (
        cleaned.includes('<html') || 
        cleaned.includes('<!doctype html') || 
        (cleaned.includes('<body') && cleaned.includes('</body>'))
      );
    } catch (error) {
      logger.error('HTML validation error:', error);
      return false;
    }
  }

  validateStructure(html: string): boolean {
    const requiredTags = ['<html', '<head', '<body'];
    const lowerHtml = html.toLowerCase();
    return requiredTags.every(tag => lowerHtml.includes(tag));
  }
}