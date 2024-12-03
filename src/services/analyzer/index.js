import cheerio from 'cheerio';
import { scrapingService } from '../scraping/scrapingService';
import { logger } from '../../utils/logger';
import { AnalysisError } from '../errors/AnalysisError';

export async function analyzeContent(url) {
  try {
    logger.info('Starting content analysis', { url });

    const html = await scrapingService.scrapeWebpage(url);
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, noscript, iframe, svg').remove();

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
    const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2s = $('h2').map((_, el) => $(el).text().trim()).get();
    const h3s = $('h3').map((_, el) => $(el).text().trim()).get();
    const h4s = $('h4').map((_, el) => $(el).text().trim()).get();

    const textContent = $('body').text().trim();
    const words = textContent.toLowerCase().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    const result = {
      title,
      metaDescription,
      headings: { h1: h1s, h2: h2s, h3: h3s, h4: h4s },
      totalWords,
      twoWordPhrases: generatePhrases(words, 2),
      threeWordPhrases: generatePhrases(words, 3),
      fourWordPhrases: generatePhrases(words, 4),
      scrapedContent: textContent
    };

    logger.info('Analysis completed successfully');
    return result;
  } catch (error) {
    logger.error('Analysis failed:', error);
    throw new AnalysisError(
      'Failed to analyze content',
      500,
      error.message
    );
  }
}

function generatePhrases(words, n) {
  const phrases = {};
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
      prominence: calculateProminence(keyword, words)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function calculateProminence(phrase, words) {
  const text = words.join(' ');
  const firstIndex = text.indexOf(phrase);
  return Number((Math.max(0, 1 - firstIndex / text.length) / 5.7).toFixed(4));
}