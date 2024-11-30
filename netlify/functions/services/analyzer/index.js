import { extractHeadings } from './headingExtractor';
import { extractKeywords } from './keywordExtractor';
import { calculateProminence } from './prominenceCalculator';
import { cleanContent } from '../utils/contentCleaner';
import { logger } from '../utils/logger';

export function analyzeContent(html) {
  try {
    logger.info('Starting content analysis');

    // Extract headings and metadata
    const { title, headings, metaDescription } = extractHeadings(html);
    logger.info('Extracted headings and metadata');

    // Clean and process content
    const cleanedContent = cleanContent(html);
    const words = cleanedContent.toLowerCase().split(/\s+/).filter(Boolean);
    logger.info(`Processed ${words.length} words`);

    // Extract keywords and calculate metrics
    const twoWordPhrases = extractKeywords(words, 2);
    const threeWordPhrases = extractKeywords(words, 3);
    const fourWordPhrases = extractKeywords(words, 4);
    logger.info('Extracted keyword phrases');

    // Calculate prominence for each phrase
    const calculateProminenceForPhrases = (phrases) => {
      return phrases.map(phrase => ({
        ...phrase,
        prominence: calculateProminence(phrase.keyword, {
          title,
          headings,
          content: cleanedContent
        })
      }));
    };

    const result = {
      title,
      metaDescription,
      headings,
      totalWords: words.length,
      twoWordPhrases: calculateProminenceForPhrases(twoWordPhrases),
      threeWordPhrases: calculateProminenceForPhrases(threeWordPhrases),
      fourWordPhrases: calculateProminenceForPhrases(fourWordPhrases),
      scrapedContent: cleanedContent
    };

    logger.info('Analysis completed successfully');
    return result;
  } catch (error) {
    logger.error('Analysis failed', { error });
    throw error;
  }
}