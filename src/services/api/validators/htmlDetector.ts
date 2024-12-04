```typescript
import { AnalysisError } from '../../errors';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

export class HtmlDetector {
  private static readonly HTML_PATTERNS = [
    /^\s*<!doctype\s+html/i,
    /^\s*<html/i,
    /<\/html>/i,
    /<head>/i,
    /<body>/i,
    /<title>/i,
    /<meta[^>]+>/i,
    /<link[^>]+>/i,
    /<script[^>]*>/i,
    /<style[^>]*>/i
  ];

  static detect(text: string): void {
    const trimmedText = text.trim();
    
    // Quick check for common HTML patterns
    if (this.HTML_PATTERNS.some(pattern => pattern.test(trimmedText))) {
      throw new AnalysisError(
        ERROR_MESSAGES.HTML_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned HTML instead of JSON. This usually indicates a server-side error.',
        true
      );
    }

    // Additional check for HTML entities
    if (trimmedText.includes('&lt;') || 
        trimmedText.includes('&gt;') || 
        trimmedText.includes('&amp;')) {
      throw new AnalysisError(
        ERROR_MESSAGES.HTML_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Response contains HTML entities instead of JSON.',
        true
      );
    }
  }
}
```