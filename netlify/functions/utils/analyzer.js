import cheerio from 'cheerio';
import { decode } from 'html-entities';

export function analyzeContent(html) {
  const $ = cheerio.load(html, {
    decodeEntities: true,
    normalizeWhitespace: true
  });

  // Remove unwanted elements
  $('script, style, noscript, iframe, svg, img, link, meta').remove();

  // Extract content
  const title = $('title').text().trim();
  const h1s = extractHeadings($, 'h1');
  const h2s = extractHeadings($, 'h2');
  const h3s = extractHeadings($, 'h3');
  const h4s = extractHeadings($, 'h4');

  // Clean and process text
  const textContent = cleanText($('body').text());
  const words = processWords(textContent);

  return {
    title: decode(title),
    headings: {
      h1: h1s.map(h => decode(h)),
      h2: h2s.map(h => decode(h)),
      h3: h3s.map(h => decode(h)),
      h4: h4s.map(h => decode(h))
    },
    totalWords: words.length,
    twoWordPhrases: generatePhrases(words, 2),
    threeWordPhrases: generatePhrases(words, 3),
    fourWordPhrases: generatePhrases(words, 4),
    scrapedContent: textContent.slice(0, 5000)
  };
}

function extractHeadings($, selector) {
  return $(selector).map((_, el) => $(el).text().trim()).get();
}

function cleanText(text) {
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function processWords(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => {
      return word.length > 1 && 
             !/^\d+$/.test(word) &&
             !/^[^a-z]+$/.test(word);
    });
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