import { DATE_PATTERNS, PHONE_PATTERNS, CODE_PATTERNS, FOOTER_PATTERNS, NAVIGATION_PATTERNS, HEADER_PATTERNS } from './patterns';

export interface ContentConfig {
  contentTags: Set<string>;
  excludeTags: Set<string>;
  patterns: {
    dates: RegExp[];
    phoneNumbers: RegExp[];
    code: RegExp[];
    footer: RegExp[];
    navigation: RegExp[];
    header: RegExp[];
  };
}

export const CONTENT_FILTERS: ContentConfig = {
  contentTags: new Set([
    'p', 'article', 'section', 'main', 'div.content', 'div.main',
    'div.article', '.post-content', '.entry-content', '.article-content'
  ]),
  
  excludeTags: new Set([
    'script', 'style', 'noscript', 'iframe', 'svg', 'img', 'video',
    'audio', 'canvas', 'object', 'embed', 'form', 'input', 'button',
    'nav', 'header', 'footer', 'aside', 'advertisement', '.ad', '.ads',
    '.cookie', '.popup', '.modal', '.sidebar', '.comments', '.related',
    'link', 'meta', '[class*="cookie"]', '[class*="newsletter"]', '[class*="social"]',
    '[class*="menu"]', '[class*="navigation"]', '[class*="header"]', '[class*="nav"]'
  ]),

  patterns: {
    dates: DATE_PATTERNS,
    phoneNumbers: PHONE_PATTERNS,
    code: CODE_PATTERNS,
    footer: FOOTER_PATTERNS,
    navigation: NAVIGATION_PATTERNS,
    header: HEADER_PATTERNS
  }
};

export function applyContentFilters(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text;

  // First apply navigation and header patterns
  CONTENT_FILTERS.patterns.navigation.forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });

  CONTENT_FILTERS.patterns.header.forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });

  // Then apply footer patterns
  CONTENT_FILTERS.patterns.footer.forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });

  // Finally apply other patterns
  CONTENT_FILTERS.patterns.dates.forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });

  CONTENT_FILTERS.patterns.phoneNumbers.forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });

  CONTENT_FILTERS.patterns.code.forEach(pattern => {
    cleaned = cleaned.replace(pattern, ' ');
  });

  // Additional cleanup for navigation items
  cleaned = cleaned.replace(/(?:menu|nav)[-\s]*items?(?:\s|$)/gi, ' ');
  cleaned = cleaned.replace(/(?:sub|main|primary)[-\s]*menu(?:\s|$)/gi, ' ');
  cleaned = cleaned.replace(/(?:navigation|header|footer)[-\s]*content(?:\s|$)/gi, ' ');

  // Normalize text
  return cleaned
    .replace(/[\r\n\t]+/g, ' ')           // Replace newlines and tabs
    .replace(/\s+/g, ' ')                 // Normalize spaces
    .replace(/[^\w\s-]/g, ' ')           // Remove special characters except hyphens
    .replace(/\b[a-z]\b/g, ' ')          // Remove single letters
    .trim();
}

export function isValidContent(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return !Object.values(CONTENT_FILTERS.patterns).some(patternGroup =>
    patternGroup.some(pattern => pattern.test(text))
  );
}