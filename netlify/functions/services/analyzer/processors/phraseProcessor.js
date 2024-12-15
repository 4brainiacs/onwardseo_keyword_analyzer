import { logger } from '../../utils/logger';

const PROMINENCE_WEIGHTS = {
  title: 2.0,
  h1: 1.5,
  h2: 1.2,
  h3: 1.0,
  h4: 0.8,
  position: 0.9,
  maxTotal: 7.4
};

export function analyzePhrases(words, context) {
  try {
    return {
      twoWordPhrases: generatePhrases(words, 2, context),
      threeWordPhrases: generatePhrases(words, 3, context),
      fourWordPhrases: generatePhrases(words, 4, context)
    };
  } catch (error) {
    logger.error('Phrase analysis failed:', error);
    throw error;
  }
}

function generatePhrases(words, length, context) {
  const phrases = new Map();
  const totalWords = words.length;

  // Generate phrases
  for (let i = 0; i <= words.length - length; i++) {
    const phrase = words.slice(i, i + length).join(' ');
    phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
  }

  // Convert to array and calculate metrics
  return Array.from(phrases.entries())
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: calculateDensity(count, totalWords, length),
      prominence: calculateProminence(keyword, context)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function calculateDensity(count, totalWords, phraseLength) {
  return Number((count / (totalWords - phraseLength + 1)).toFixed(4));
}

function calculateProminence(phrase, context) {
  let score = 0;
  const lowerPhrase = phrase.toLowerCase();

  // Title score
  if (context.title.toLowerCase().includes(lowerPhrase)) {
    score += PROMINENCE_WEIGHTS.title;
  }

  // Heading scores
  if (context.headings.h1.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += PROMINENCE_WEIGHTS.h1;
  }
  if (context.headings.h2.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += PROMINENCE_WEIGHTS.h2;
  }
  if (context.headings.h3.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += PROMINENCE_WEIGHTS.h3;
  }
  if (context.headings.h4.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += PROMINENCE_WEIGHTS.h4;
  }

  return Number((score / PROMINENCE_WEIGHTS.maxTotal).toFixed(4));
}