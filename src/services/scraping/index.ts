import { ScrapingService } from './ScrapingService';
import { RequestBuilder } from './request/RequestBuilder';
import { ResponseValidator } from './response/ResponseValidator';
import { ContentValidator } from './validators/ContentValidator';
import { logger } from '../../utils/logger';

const scrapingService = new ScrapingService({
  requestBuilder: new RequestBuilder(),
  responseValidator: new ResponseValidator(),
  contentValidator: new ContentValidator()
});

export { scrapingService };
export type { ScrapingConfig, ScrapingResponse } from './types';