import { ScrapingBeeService } from '../services/scrapingBee.js';
import { Analyzer } from '../services/analyzer.js';
import dotenv from 'dotenv';

dotenv.config();

const scraper = new ScrapingBeeService();
const analyzer = new Analyzer();

export async function analyzeController(req, res) {
  const { url } = req.body;

  try {
    // Fetch webpage content using ScrapingBee
    const html = await scraper.scrape(url);

    if (!html) {
      throw new Error('Empty response received');
    }

    // Analyze the content
    const result = analyzer.analyze(html);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Analysis error:', error);

    if (error.message.includes('ScrapingBee API error')) {
      return res.status(500).json({
        success: false,
        error: 'Scraping service error',
        details: error.message
      });
    }

    if (error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        details: 'The website took too long to respond'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      details: error.message || 'An unexpected error occurred'
    });
  }
}