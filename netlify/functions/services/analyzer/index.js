import { extractHeadings } from './headingExtractor';
import { extractKeywords } from './keywordExtractor';
import { calculateProminence } from './prominenceCalculator';
import { cleanContent } from '../utils/contentCleaner';

export function analyzeContent(html) {
  // Extract headings and metadata
  const { title, headings, metaDescription } = extractHeadings(html);

  // Clean and process content
  const cleanedContent = cleanContent(html);
  const words = cleanedContent.toLowerCase().split(/\s+/).filter(Boolean);

  // Extract keywords and calculate metrics
  const twoWordPhrases = extractKeywords(words, 2);
  const threeWordPhrases = extractKeywords(words, 3);
  const fourWordPhrases = extractKeywords(words, 4);

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

  return {
    title,
    metaDescription,
    headings,
    totalWords: words.length,
    twoWordPhrases: calculateProminenceForPhrases(twoWordPhrases),
    threeWordPhrases: calculateProminenceForPhrases(threeWordPhrases),
    fourWordPhrases: calculateProminenceForPhrases(fourWordPhrases),
    scrapedContent: cleanedContent
  };
}