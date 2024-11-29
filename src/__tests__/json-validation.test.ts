import { describe, it, expect } from 'vitest';
import { validateAnalysisResult } from '../services/validators';
import { AnalysisError } from '../services/errors';

describe('JSON Validation', () => {
  it('should validate a correct analysis result', () => {
    const validResult = {
      title: 'Test Page',
      headings: {
        h1: ['Main Heading'],
        h2: ['Sub Heading'],
        h3: [],
        h4: []
      },
      totalWords: 100,
      twoWordPhrases: [
        { keyword: 'test phrase', count: 5, density: 0.05, prominence: 0.5 }
      ],
      threeWordPhrases: [
        { keyword: 'three word phrase', count: 3, density: 0.03, prominence: 0.3 }
      ],
      fourWordPhrases: [
        { keyword: 'four word test phrase', count: 2, density: 0.02, prominence: 0.2 }
      ],
      scrapedContent: 'Test content'
    };

    expect(() => validateAnalysisResult(validResult)).not.toThrow();
  });

  it('should reject null or undefined result', () => {
    expect(() => validateAnalysisResult(null)).toThrow(AnalysisError);
    expect(() => validateAnalysisResult(undefined)).toThrow(AnalysisError);
  });

  it('should reject result with missing required fields', () => {
    const invalidResult = {
      title: 'Test',
      headings: { h1: [], h2: [], h3: [], h4: [] }
      // Missing other required fields
    };

    expect(() => validateAnalysisResult(invalidResult)).toThrow(AnalysisError);
  });

  it('should reject invalid field types', () => {
    const invalidTypes = {
      title: 123, // Should be string
      headings: {
        h1: ['Valid'],
        h2: [123], // Should be string
        h3: [],
        h4: []
      },
      totalWords: 'invalid', // Should be number
      twoWordPhrases: [
        { keyword: 'valid', count: 'invalid', density: 0.5, prominence: 0.5 }
      ],
      threeWordPhrases: [],
      fourWordPhrases: [],
      scrapedContent: 'valid'
    };

    expect(() => validateAnalysisResult(invalidTypes)).toThrow(AnalysisError);
  });

  it('should reject invalid phrase structures', () => {
    const invalidPhrases = {
      title: 'Test',
      headings: { h1: [], h2: [], h3: [], h4: [] },
      totalWords: 100,
      twoWordPhrases: [
        { 
          keyword: 'test',
          // Missing required fields
        }
      ],
      threeWordPhrases: [],
      fourWordPhrases: [],
      scrapedContent: 'test'
    };

    expect(() => validateAnalysisResult(invalidPhrases)).toThrow(AnalysisError);
  });

  it('should reject invalid density values', () => {
    const invalidDensity = {
      title: 'Test',
      headings: { h1: [], h2: [], h3: [], h4: [] },
      totalWords: 100,
      twoWordPhrases: [
        { 
          keyword: 'test phrase',
          count: 5,
          density: 1.5, // Should be between 0 and 1
          prominence: 0.5
        }
      ],
      threeWordPhrases: [],
      fourWordPhrases: [],
      scrapedContent: 'test'
    };

    expect(() => validateAnalysisResult(invalidDensity)).toThrow(AnalysisError);
  });

  it('should reject invalid prominence values', () => {
    const invalidProminence = {
      title: 'Test',
      headings: { h1: [], h2: [], h3: [], h4: [] },
      totalWords: 100,
      twoWordPhrases: [
        { 
          keyword: 'test phrase',
          count: 5,
          density: 0.5,
          prominence: 2.0 // Should be between 0 and 1
        }
      ],
      threeWordPhrases: [],
      fourWordPhrases: [],
      scrapedContent: 'test'
    };

    expect(() => validateAnalysisResult(invalidProminence)).toThrow(AnalysisError);
  });

  it('should handle malformed JSON strings', () => {
    const malformedJson = '{"title": "Test", "incomplete": true';
    
    expect(() => {
      JSON.parse(malformedJson);
    }).toThrow();
  });

  it('should validate nested structures', () => {
    const nestedInvalid = {
      title: 'Test',
      headings: {
        h1: [], 
        h2: [],
        h3: null, // Should be array
        h4: []
      },
      totalWords: 100,
      twoWordPhrases: [],
      threeWordPhrases: [],
      fourWordPhrases: [],
      scrapedContent: 'test'
    };

    expect(() => validateAnalysisResult(nestedInvalid)).toThrow(AnalysisError);
  });
});