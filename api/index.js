import express from 'express';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    const title = $('title').text().trim();
    const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2s = $('h2').map((_, el) => $(el).text().trim()).get();
    const h3s = $('h3').map((_, el) => $(el).text().trim()).get();
    const h4s = $('h4').map((_, el) => $(el).text().trim()).get();

    const textContent = $('body').text().trim();
    const words = textContent.toLowerCase().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    const generatePhrases = (n) => {
      const phrases = {};
      for (let i = 0; i <= words.length - n; i++) {
        const phrase = words.slice(i, i + n).join(' ');
        phrases[phrase] = (phrases[phrase] || 0) + 1;
      }
      
      return Object.entries(phrases)
        .map(([keyword, count]) => ({
          keyword,
          count,
          density: count / (totalWords - n + 1),
          prominence: calculateProminence(keyword, $),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    };

    const result = {
      title,
      headings: { h1: h1s, h2: h2s, h3: h3s, h4: h4s },
      totalWords,
      twoWordPhrases: generatePhrases(2),
      threeWordPhrases: generatePhrases(3),
      fourWordPhrases: generatePhrases(4),
      scrapedContent: textContent,
    };

    res.json(result);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to analyze webpage' });
  }
});

function calculateProminence(phrase, $) {
  const text = $('body').text().toLowerCase();
  const firstIndex = text.indexOf(phrase);
  if (firstIndex === -1) return 0;

  const positionScore = Math.max(0, 1 - firstIndex / text.length);
  const inTitle = $('title').text().toLowerCase().includes(phrase) ? 2 : 0;
  const inH1 = $('h1').text().toLowerCase().includes(phrase) ? 1.5 : 0;
  const inH2 = $('h2').text().toLowerCase().includes(phrase) ? 1.2 : 0;

  return (positionScore + inTitle + inH1 + inH2) / 5.7;
}

export default app;