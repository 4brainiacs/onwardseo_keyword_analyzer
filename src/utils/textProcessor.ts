import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export class TextProcessor {
  private window: Window;
  private purifier: DOMPurify.DOMPurifyI;

  constructor() {
    this.window = new JSDOM('').window as unknown as Window;
    this.purifier = DOMPurify(this.window);
  }

  // ... rest of implementation
}