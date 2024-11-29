import { describe, it, expect, vi } from 'vitest';
import { scrapeWebpage } from '../../services/scraper';
import { scrapingService } from '../../services/scraping/scrapingService';
import { mockHtmlContent } from '../mocks/content';

vi.mock('../../services/scraping/scrapingService', () => ({
  scrapingService: {
    scrapeWebpage: vi.fn()
  }
}));

describe('scrapeWebpage', () => {
  it('should successfully scrape and decode HTML', async () => {
    const encodedContent = mockHtmlContent.replace(/[<>]/g, (char) => 
      char === '<' ? '&lt;' : '&gt;'
    );
    
    vi.mocked(scrapingService.scrapeWebpage).mockResolvedValueOnce(encodedContent);

    const result = await scrapeWebpage('https://example.com');
    expect(result).toBe(mockHtmlContent);
  });

  it('should handle scraping errors', async () => {
    const error = new Error('Scraping failed');
    vi.mocked(scrapingService.scrapeWebpage).mockRejectedValueOnce(error);

    await expect(scrapeWebpage('https://example.com'))
      .rejects
      .toThrow('Scraping failed');
  });
});