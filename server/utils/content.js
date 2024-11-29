import { DATE_PATTERNS, PHONE_PATTERNS, CODE_PATTERNS } from './patterns.js';

export function cleanContent(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text.replace(/\s+/g, ' ').trim();

  // Remove unwanted patterns
  [...DATE_PATTERNS, ...PHONE_PATTERNS, ...CODE_PATTERNS].forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });

  return cleaned
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\b\d+\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractText($, selector) {
  try {
    return $(selector)
      .map((_, el) => cleanContent($(el).text()))
      .get()
      .filter(text => text.length > 0);
  } catch (error) {
    console.error(`Error extracting text from ${selector}:`, error);
    return [];
  }
}

export function generatePhrases(words, n) {
  if (!Array.isArray(words) || n < 2) {
    return [];
  }

  const phrases = {};
  const totalWords = words.length;

  for (let i = 0; i <= words.length - n; i++) {
    const phrase = words.slice(i, i + n).join(' ');
    if (isValidPhrase(phrase)) {
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
  }

  return Object.entries(phrases)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: Number((count / (totalWords - n + 1)).toFixed(4)),
      prominence: calculateProminence(keyword, words)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function isValidPhrase(phrase) {
  if (!phrase || typeof phrase !== 'string') {
    return false;
  }

  return (
    phrase.length >= 3 &&
    !DATE_PATTERNS.some(pattern => pattern.test(phrase)) &&
    !PHONE_PATTERNS.some(pattern => pattern.test(phrase)) &&
    !CODE_PATTERNS.some(pattern => pattern.test(phrase))
  );
}

function calculateProminence(phrase, words) {
  if (!phrase || !Array.isArray(words)) {
    return 0;
  }

  const text = words.join(' ');
  const firstIndex = text.indexOf(phrase);
  return firstIndex === -1 ? 0 : Number((Math.max(0, 1 - firstIndex / text.length) / 5.7).toFixed(4));
}