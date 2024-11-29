import cheerio from 'cheerio';
import { decode } from 'html-entities';
import sanitizeHtml from 'sanitize-html';

export class Analyzer {
  analyze(html) {
    try {
      // Initial load with cheerio
      const $ = cheerio.load(html, {
        decodeEntities: true,
        normalizeWhitespace: true
      });

      // Remove unwanted elements
      $('script, style, link, meta, iframe, noscript').remove();

      // Extract content
      const title = this.cleanText($('title').text()) || 'Untitled Page';
      const h1s = $('h1').map((_, el) => this.cleanText($(el).text())).get();
      const h2s = $('h2').map((_, el) => this.cleanText($(el).text())).get();
      const h3s = $('h3').map((_, el) => this.cleanText($(el).text())).get();
      const h4s = $('h4').map((_, el) => this.cleanText($(el).text())).get();

      // Process main content
      const bodyText = this.cleanText($('body').text());
      const words = this.getWords(bodyText);

      return {
        title: decode(title),
        headings: {
          h1: h1s.map(h => decode(h)),
          h2: h2s.map(h => decode(h)),
          h3: h3s.map(h => decode(h)),
          h4: h4s.map(h => decode(h))
        },
        totalWords: words.length,
        twoWordPhrases: this.generatePhrases(words, 2),
        threeWordPhrases: this.generatePhrases(words, 3),
        fourWordPhrases: this.generatePhrases(words, 4),
        scrapedContent: bodyText.slice(0, 5000)
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error('Failed to analyze content: ' + error.message);
    }
  }

  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getWords(text) {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length >= 3 && 
        !/^\d+$/.test(word) &&
        !/^[^a-z]+$/.test(word)
      );
  }

  generatePhrases(words, n) {
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
        prominence: this.calculateProminence(keyword, words)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  calculateProminence(phrase, words) {
    const text = words.join(' ');
    const firstIndex = text.indexOf(phrase);
    return firstIndex === -1 ? 0 : Number((Math.max(0, 1 - firstIndex / text.length) / 5.7).toFixed(4));
  }
}