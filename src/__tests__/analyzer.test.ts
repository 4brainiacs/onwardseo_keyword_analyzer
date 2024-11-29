import { describe, it, expect } from 'vitest';
import { analyzeContent } from '../services/analyzer';
import { mockHtmlContent } from './mocks/content';

describe('analyzeContent', () => {
  it('should analyze content and return correct structure', async () => {
    const result = analyzeContent(mockHtmlContent);

    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('headings');
    expect(result).toHaveProperty('totalWords');
    expect(result).toHaveProperty('twoWordPhrases');
    expect(result).toHaveProperty('threeWordPhrases');
    expect(result).toHaveProperty('fourWordPhrases');
    expect(result).toHaveProperty('scrapedContent');
  });

  it('should extract correct number of phrases', async () => {
    const result = analyzeContent(mockHtmlContent);

    expect(result.twoWordPhrases).toHaveLength(10);
    expect(result.threeWordPhrases).toHaveLength(10);
    expect(result.fourWordPhrases).toHaveLength(10);
  });

  it('should calculate keyword density correctly', async () => {
    const result = analyzeContent(mockHtmlContent);

    result.twoWordPhrases.forEach(phrase => {
      expect(phrase.density).toBeGreaterThanOrEqual(0);
      expect(phrase.density).toBeLessThanOrEqual(1);
    });
  });

  it('should calculate prominence scores correctly', async () => {
    const result = analyzeContent(mockHtmlContent);

    result.twoWordPhrases.forEach(phrase => {
      expect(phrase.prominence).toBeGreaterThanOrEqual(0);
      expect(phrase.prominence).toBeLessThanOrEqual(1);
    });
  });

  it('should handle empty content gracefully', async () => {
    expect(() => analyzeContent('')).toThrow();
  });
});