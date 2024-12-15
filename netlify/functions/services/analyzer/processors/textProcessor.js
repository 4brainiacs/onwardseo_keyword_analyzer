import { logger } from '../../utils/logger';
import { CONTENT_FILTERS } from '../../utils/contentFilters';

export function processText(rawText) {
  try {
    // Remove unwanted content
    let cleanText = rawText;
    
    // Apply content filters
    CONTENT_FILTERS.forEach(pattern => {
      cleanText = cleanText.replace(pattern, ' ');
    });

    // Clean up text
    cleanText = cleanText
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract words
    const words = cleanText
      .toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length >= 3 && 
        !/^\d+$/.test(word) &&
        !/^[^a-z]+$/.test(word)
      );

    logger.debug('Text processing complete', {
      originalLength: rawText.length,
      cleanedLength: cleanText.length,
      wordCount: words.length
    });

    return {
      cleanText,
      words,
      totalWords: words.length
    };
  } catch (error) {
    logger.error('Text processing failed:', error);
    throw error;
  }
}