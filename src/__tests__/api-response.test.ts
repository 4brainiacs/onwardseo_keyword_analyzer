import { describe, it, expect, vi } from 'vitest';
import { request } from '../services/api/client';

describe('API Response Handling', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should handle valid JSON response', async () => {
    const validResponse = {
      success: true,
      data: {
        title: 'Test',
        headings: { h1: [], h2: [], h3: [], h4: [] },
        totalWords: 100,
        twoWordPhrases: [],
        threeWordPhrases: [],
        fourWordPhrases: [],
        scrapedContent: 'test'
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(validResponse)
    });

    const result = await request('/test');
    expect(result).toEqual(validResponse.data);
  });
});