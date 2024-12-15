import { logger } from '../utils/logger';
import { AnalysisError } from '../errors/AnalysisError';

export function processKeywords(text) {
  try {
    const words = text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);

    const totalWords = words.length;

    if (totalWords === 0) {
      throw new Error('No valid words found in content');
    }

    const generatePhrases = (length) => {
      const phrases = {};
      
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(' ');
        phrases[phrase] = (phrases[phrase] || 0) + 1;
      }

      return Object.entries(phrases)
        .map(([keyword, count]) => ({
          keyword,
          count,
          density: Number((count / (totalWords - length + 1)).toFixed(4)),
          prominence: calculateProminence(keyword, words)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    };

    return {
      totalWords,
      phrases: {
        twoWord: generatePhrases(2),
        threeWord: generatePhrases(3),
        fourWord: generatePhrases(4)
      }
    };
  } catch (error) {
    logger.error('Keyword processing failed:', error);
    throw new AnalysisError(
      'Keyword processing failed',
      500,
      error.message,
      true
    );
  }
}

function calculateProminence(phrase: string, words: string[]): number {
  const text = words.join(' ');
  const firstIndex = text.indexOf(phrase);
  return Number((Math.max(0, 1 - firstIndex / text.length) / 5.7).toFixed(4));
}