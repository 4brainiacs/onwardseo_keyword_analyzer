import * as cheerio from 'cheerio';
import { AnalysisResult, ProminenceWeights } from '../types';
import { applyContentFilters } from '../utils/contentFilters';

const PROMINENCE_WEIGHTS: ProminenceWeights = {
  title: 2.0,
  h1: 1.5,
  h2: 1.2,
  h3: 1.0,
  h4: 0.8,
  position: 0.9,
  maxTotal: 7.4
};

export function analyzeContent(html: string): AnalysisResult {
  const $ = cheerio.load(html);
  
  // Remove unwanted elements first
  $('script, style, noscript, iframe, svg, img').remove();
  $('nav, header, .navigation, .menu, .sub-menu, .menu-item, .menu-items').remove();
  $('footer, .footer').remove();

  // Extract metadata
  const title = $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
  const h2s = $('h2').map((_, el) => $(el).text().trim()).get();
  const h3s = $('h3').map((_, el) => $(el).text().trim()).get();
  const h4s = $('h4').map((_, el) => $(el).text().trim()).get();

  // Get main content and apply filters
  const textContent = applyContentFilters($('body').text());
  const words = textContent
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 1);

  return {
    title,
    metaDescription,
    headings: { h1: h1s, h2: h2s, h3: h3s, h4: h4s },
    totalWords: words.length,
    twoWordPhrases: generatePhrases(words, 2, $, title),
    threeWordPhrases: generatePhrases(words, 3, $, title),
    fourWordPhrases: generatePhrases(words, 4, $, title),
    scrapedContent: textContent
  };
}

function generatePhrases(
  words: string[], 
  n: number, 
  $: cheerio.CheerioAPI,
  pageTitle: string
) {
  const phrases: { [key: string]: number } = {};
  const totalWords = words.length;

  for (let i = 0; i <= words.length - n; i++) {
    const phrase = words.slice(i, i + n).join(' ');
    phrases[phrase] = (phrases[phrase] || 0) + 1;
  }

  return Object.entries(phrases)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: Number((count / (totalWords - n + 1)).toFixed(4)),
      prominence: calculateProminence(keyword, words, $, pageTitle)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function calculateProminence(
  phrase: string,
  contentWords: string[],
  $: cheerio.CheerioAPI,
  pageTitle: string
): number {
  let score = 0;
  const phraseWords = phrase.toLowerCase().split(/\s+/);

  // Calculate position score using word-based approach
  let firstWordIndex = -1;
  for (let i = 0; i <= contentWords.length - phraseWords.length; i++) {
    if (contentWords.slice(i, i + phraseWords.length).join(' ') === phrase.toLowerCase()) {
      firstWordIndex = i;
      break;
    }
  }

  if (firstWordIndex !== -1) {
    score += PROMINENCE_WEIGHTS.position * (1 - firstWordIndex / contentWords.length);
  }

  // Title score
  if (pageTitle.toLowerCase().includes(phrase.toLowerCase())) {
    score += PROMINENCE_WEIGHTS.title;
  }

  // Heading scores
  if ($('h1').text().toLowerCase().includes(phrase.toLowerCase())) {
    score += PROMINENCE_WEIGHTS.h1;
  }
  if ($('h2').text().toLowerCase().includes(phrase.toLowerCase())) {
    score += PROMINENCE_WEIGHTS.h2;
  }
  if ($('h3').text().toLowerCase().includes(phrase.toLowerCase())) {
    score += PROMINENCE_WEIGHTS.h3;
  }
  if ($('h4').text().toLowerCase().includes(phrase.toLowerCase())) {
    score += PROMINENCE_WEIGHTS.h4;
  }

  return Number((score / PROMINENCE_WEIGHTS.maxTotal).toFixed(4));
}