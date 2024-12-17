import { ScrapingService } from './ScrapingService';
import { ContentValidator } from './validators/ContentValidator';
import { logger } from '../../utils/logger';

export const scrapingService = new ScrapingService({
  contentValidator: new ContentValidator()
});

export type { ScrapingConfig, ScrapingResponse } from './types';