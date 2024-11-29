import { describe, it, expect, vi } from 'vitest';
import { fetchApi } from '../services/api/client';

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

    const result = await fetchApi('/test');
    expect(result).toEqual(validResponse.data);
  });

  it('should handle empty response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve('')
    });

    await expect(fetchApi('/test')).rejects.toThrow('Invalid server response');
  });

  it('should handle malformed JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    });

    await expect(fetchApi('/test')).rejects.toThrow('Invalid server response');
  });

  it('should handle missing data field', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    await expect(fetchApi('/test')).rejects.toThrow('Invalid response format');
  });

  it('should handle server errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({
        success: false,
        error: 'Server Error',
        details: 'Internal server error'
      })
    });

    await expect(fetchApi('/test')).rejects.toThrow('Server Error');
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchApi('/test')).rejects.toThrow('Network error');
  });

  it('should handle timeout errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    await expect(fetchApi('/test')).rejects.toThrow();
  });
});