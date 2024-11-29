import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { encode } from 'html-entities';

export class TextProcessor {
  private dom: JSDOM;
  private DOMPurify: any;

  constructor() {
    this.dom = new JSDOM('');
    this.DOMPurify = createDOMPurify(this.dom.window as any);
  }

  public process(html: string): {
    cleanText: string;
    wordCount: number;
    metadata: {
      originalLength: number;
      cleanedLength: number;
      sanitizationTime: number;
      processingTime: number;
    };
  } {
    const startTime = performance.now();
    let cleanText = '';
    
    try {
      // First pass: Basic HTML cleaning
      const sanitizeStart = performance.now();
      const sanitized = this.DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'],
        ALLOWED_ATTR: [],
        RETURN_DOM: true
      });
      const sanitizeTime = performance.now() - sanitizeStart;

      // Extract text content
      cleanText = this.extractText(sanitized);

      // Clean up the text
      cleanText = this.cleanText(cleanText);

      const wordCount = this.countWords(cleanText);
      const endTime = performance.now();

      return {
        cleanText,
        wordCount,
        metadata: {
          originalLength: html.length,
          cleanedLength: cleanText.length,
          sanitizationTime: sanitizeTime,
          processingTime: endTime - startTime
        }
      };
    } catch (error) {
      console.error('Text processing error:', error);
      throw new Error('Failed to process text content');
    } finally {
      // Clean up to prevent memory leaks
      this.cleanup();
    }
  }

  private extractText(dom: Document): string {
    const walker = document.createTreeWalker(
      dom,
      NodeFilter.SHOW_TEXT,
      null
    );

    let text = '';
    let node;
    while (node = walker.nextNode()) {
      text += node.textContent + ' ';
    }

    return text;
  }

  private cleanText(text: string): string {
    return text
      // Remove control characters
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Remove HTML entities
      .replace(/&[a-z0-9]+;/gi, ' ')
      // Encode special characters
      .split('').map(char => {
        const code = char.charCodeAt(0);
        return code > 127 ? encode(char) : char;
      }).join('')
      .trim();
  }

  private countWords(text: string): number {
    return text
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  private cleanup(): void {
    // Clean up JSDOM instance
    if (this.dom) {
      this.dom.window.close();
    }
  }
}