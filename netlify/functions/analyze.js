import { scrapingService } from './services/scraping';
import { validateUrl } from './utils/validators';
import { analyzeContent } from './services/analyzer';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: urlValidation.error })
      };
    }

    const html = await scrapingService.scrapeWebpage(url);
    const analysis = analyzeContent(html);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: analysis
      })
    };
  } catch (error) {
    console.error('Analysis error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to analyze webpage',
        details: error.message
      })
    };
  }
}