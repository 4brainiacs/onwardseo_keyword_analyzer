import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../services/api/client';
import { AnalysisError } from '../../services/errors';
import { ERROR_MESSAGES } from '../../services/api/constants';

describe('ApiClient', () => {
  let apiClient: ApiClient;
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = mockFetch;
    apiClient = new ApiClient();
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

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(apiClient.request('/test'))
      .rejects
      .toThrow(AnalysisError);
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
      .toThrow(ERROR_MESSAGES.INVALID_JSON);
  });

  it('should retry on server errors', async () => {
    const successResponse = {
      success: true,
      data: { test: 'data' }
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({
          'content-type': 'application/json'
        }),
        text: () => Promise.resolve(JSON.stringify({ error: 'Server Error' }))
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          'content-type': 'application/json'
        }),
        text: () => Promise.resolve(JSON.stringify(successResponse))
      });

    const result = await apiClient.request('/test');
    expect(result).toEqual({ test: 'data' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should not retry on client errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: new Headers({
        'content-type': 'application/json'
      }),
      text: () => Promise.resolve(JSON.stringify({ error: 'Bad Request' }))
    });

    await expect(apiClient.request('/test'))
      .rejects
      .toThrow(ERROR_MESSAGES.BAD_REQUEST);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});