import { logger } from '../../utils/logger';
import type { PageHeadings } from '../../types';

interface ProminenceContext {
  title: string;
  headings: PageHeadings;
  metaDescription: string;
}

const WEIGHTS = {
  title: 2.0,
  h1: 1.5,
  h2: 1.2,
  h3: 1.0,
  h4: 0.8,
  metaDescription: 0.5,
  maxTotal: 7.0
};

export class ProminenceCalculator {
  calculate(phrase: string, context: ProminenceContext): number {
    try {
      let score = 0;
      const lowerPhrase = phrase.toLowerCase();

      // Title score
      if (context.title.toLowerCase().includes(lowerPhrase)) {
        score += WEIGHTS.title;
      }

      // Meta description score
      if (context.metaDescription.toLowerCase().includes(lowerPhrase)) {
        score += WEIGHTS.metaDescription;
      }

      // Heading scores
      if (context.headings.h1.some(h => h.toLowerCase().includes(lowerPhrase))) {
        score += WEIGHTS.h1;
      }
      if (context.headings.h2.some(h => h.toLowerCase().includes(lowerPhrase))) {
        score += WEIGHTS.h2;
      }
      if (context.headings.h3.some(h => h.toLowerCase().includes(lowerPhrase))) {
        score += WEIGHTS.h3;
      }
      if (context.headings.h4.some(h => h.toLowerCase().includes(lowerPhrase))) {
        score += WEIGHTS.h4;
      }

      return Number((score / WEIGHTS.maxTotal).toFixed(4));
    } catch (error) {
      logger.error('Prominence calculation failed:', error);
      return 0;
    }
  }
}