import { describe, it, expect } from 'vitest';
import { validateContentType, validateStatus, validateJsonResponse } from '../../services/api/utils/validation';
import { AnalysisError } from '../../services/errors';
import { ERROR_MESSAGES } from '../../services/api/constants';

describe('API Validation Utils', () => {
  describe('validateContentType', () => {
    it('should accept application/json content type', () => {
      const response = new Response('', {
        headers: { 'content-type': 'application/json' }
      });

      expect(() => validateContentType(response)).not.toThrow();
    });

    it('should throw on non-JSON content type', () => {
      const response = new Response('', {
        headers: { 'content-type': 'text/html' }
      });

      expect(() => validateContentType(response))
        .toThrow(ERROR_MESSAGES.INVALID_JSON);
    });
  });

  describe('validateStatus', () => {
    it('should accept 2xx status codes', () => {
      const response = new Response('', { status: 200 });
      expect(() => validateStatus(response)).not.toThrow();
    });

    it('should throw on 4xx status codes', () => {
      const response = new Response('', { status: 400 });
      expect(() => validateStatus(response))
        .toThrow(ERROR_MESSAGES.BAD_REQUEST);
    });

    it('should throw on 5xx status codes', () => {
      const response = new Response('', { status: 500 });
      expect(() => validateStatus(response))
        .toThrow(ERROR_MESSAGES.SERVER_ERROR);
    });
  });

  describe('validateJsonResponse', () => {
    it('should parse valid JSON response', async () => {
      const mockResponse = {
        success: true,
        data: { test: 'data' }
      };

      const response = new Response(JSON.stringify(mockResponse));
      const result = await validateJsonResponse(response);
      expect(result).toEqual(mockResponse);
    });

    it('should throw on invalid JSON', async () => {
      const response = new Response('invalid json');
      await expect(validateJsonResponse(response))
        .rejects
        .toThrow(ERROR_MESSAGES.INVALID_JSON);
    });

    it('should throw on missing required fields', async () => {
      const response = new Response('{"foo": "bar"}');
      await expect(validateJsonResponse(response))
        .rejects
        .toThrow(ERROR_MESSAGES.INVALID_JSON);
    });
  });
});