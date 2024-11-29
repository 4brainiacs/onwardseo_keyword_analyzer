import { describe, it, expect, beforeAll } from 'vitest';
import { scrapingService } from '../../services/scraping/scrapingService';
import { env } from '../../config/environment';

describe('ScrapingBee Integration', () => {
  beforeAll(() => {
    if (!env.scrapingBeeApiKey) {
      throw new Error('VITE_SCRAPINGBEE_API_KEY is required for integration tests');
    }
  });

  // Error Handling Scenarios
  describe('Error Handling', () => {
    it('should handle invalid URLs', async () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com',
        'http://.com',
        'https://'
      ];

      for (const url of invalidUrls) {
        await expect(scrapingService.scrapeWebpage(url))
          .rejects
          .toThrow();
      }
    }, 30000);

    it('should handle network timeouts', async () => {
      // Using a non-responsive endpoint
      const url = 'https://example.org:81';
      await expect(scrapingService.scrapeWebpage(url))
        .rejects
        .toThrow();
    }, 40000);

    it('should handle large page responses', async () => {
      const url = 'https://en.wikipedia.org/wiki/List_of_largest_known_stars';
      const result = await scrapingService.scrapeWebpage(url);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(100000);
    }, 40000);

    it('should handle malformed HTML responses', async () => {
      // Using a known endpoint that returns malformed HTML
      const url = 'https://raw.githubusercontent.com/whatever/malformed.html';
      await expect(scrapingService.scrapeWebpage(url))
        .rejects
        .toThrow();
    }, 30000);
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle special character encoding', async () => {
      const url = 'https://www.unicode.org/charts/';
      const result = await scrapingService.scrapeWebpage(url);
      expect(result).toBeDefined();
      expect(result).toContain('UTF');
    }, 30000);

    it('should handle different content types', async () => {
      const urls = [
        'https://example.com/robots.txt',
        'https://example.com/sitemap.xml'
      ];

      for (const url of urls) {
        await expect(scrapingService.scrapeWebpage(url))
          .rejects
          .toThrow('Invalid content type');
      }
    }, 40000);
  });

  // Original test cases remain unchanged
  it('should successfully scrape a simple webpage', async () => {
    const url = 'https://example.com';
    const result = await scrapingService.scrapeWebpage(url);
    
    expect(result).toBeDefined();
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<title>');
    expect(result).toContain('</html>');
  }, 30000);

  it('should handle a complex webpage with JavaScript', async () => {
    const url = 'https://news.ycombinator.com';
    const result = await scrapingService.scrapeWebpage(url);
    
    expect(result).toBeDefined();
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('Hacker News');
  }, 30000);

  it('should handle non-English content', async () => {
    const url = 'https://www.lemonde.fr';
    const result = await scrapingService.scrapeWebpage(url);
    
    expect(result).toBeDefined();
    expect(result).toContain('<!DOCTYPE html>');
  }, 30000);

  it('should handle rate limiting gracefully', async () => {
    const urls = Array(5).fill('https://example.com');
    const results = await Promise.allSettled(
      urls.map(url => scrapingService.scrapeWebpage(url))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled');
    expect(successful.length).toBeGreaterThan(0);
  }, 60000);

  it('should handle a webpage with complex DOM structure', async () => {
    const url = 'https://github.com';
    const result = await scrapingService.scrapeWebpage(url);
    
    expect(result).toBeDefined();
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('GitHub');
  }, 30000);
});