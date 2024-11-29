import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ScrapingService } from './scrapingService';
import { mockHtmlContent } from '../../__tests__/mocks/content';

describe('ScrapingService', () => {
  let scrapingService: ScrapingService;
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetModules();
    global.fetch = mockFetch;
    scrapingService = new ScrapingService();
    mockFetch.mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should successfully scrape a webpage', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'text/html',
        'content-length': '1000'
      }),
      text: () => Promise.resolve(mockHtmlContent)
    });

    const result = await scrapingService.scrapeWebpage('https://example.com');
    expect(result).toBe(mockHtmlContent);
  });

  it('should handle API key validation', async () => {
    const originalEnv = process.env.VITE_SCRAPINGBEE_API_KEY;
    process.env.VITE_SCRAPINGBEE_API_KEY = '';

    await expect(scrapingService.scrapeWebpage('https://example.com'))
      .rejects
      .toThrow('ScrapingBee API key is missing');

    process.env.VITE_SCRAPINGBEE_API_KEY = originalEnv;
  });

  it('should handle rate limiting', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      headers: new Headers({
        'content-type': 'application/json'
      })
    });

    await expect(scrapingService.scrapeWebpage('https://example.com'))
      .rejects
      .toThrow('Too many requests');
  });

  it('should handle timeout', async () => {
    mockFetch.mockImplementationOnce(() => new Promise((resolve) => {
      setTimeout(resolve, 31000);
    }));

    await expect(scrapingService.scrapeWebpage('https://example.com'))
      .rejects
      .toThrow('Request timeout');
  });

  it('should handle invalid content type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'application/json'
      })
    });

    await expect(scrapingService.scrapeWebpage('https://example.com'))
      .rejects
      .toThrow('Invalid content type');
  });

  it('should handle large responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'text/html',
        'content-length': '20000000' // 20MB
      })
    });

    await expect(scrapingService.scrapeWebpage('https://example.com'))
      .rejects
      .toThrow('Response too large');
  });
});