import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../../services/api/client';
import { ERROR_MESSAGES } from '../../services/api/constants/errors';

describe('ApiClient', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should successfully make a request', async () => {
    const mockResponse = {
      success: true,
      data: { test: 'data' }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({
        'content-type': 'application/json'
      }),
      text: () => Promise.resolve(JSON.stringify(mockResponse))
    });

    const result = await apiClient.request('/test');
    expect(result).toEqual({ test: 'data' });
  });

  it('should handle invalid JSON responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({
        'content-type': 'application/json'
      }),
      text: () => Promise.resolve('invalid json')
    });

    await expect(apiClient.request('/test'))
      .rejects
      .toThrow(ERROR_MESSAGES.VALIDATION.INVALID_JSON);
  });
});