export interface ContentPatterns {
  dates: RegExp[];
  phoneNumbers: RegExp[];
  code: RegExp[];
  footer: RegExp[];
  navigation: RegExp[];
  header: RegExp[];
}

export interface ContentConfig {
  contentTags: Set<string>;
  excludeTags: Set<string>;
  patterns: ContentPatterns;
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
    '.cookie', '.popup', '.modal', '.sidebar', '.comments', '.related'
  ]),

  patterns: {
    dates: [
      /\d{4}-\d{2}-\d{2}/g,
      /\d{1,2}\/\d{1,2}\/\d{2,4}/g
    ],
    phoneNumbers: [
      /(?:\+\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}/g
    ],
    code: [
      /<[^>]+>/g,
      /\{[\s\S]*?\}/g,
      /function\s*\(.*?\)/g
    ],
    footer: [
      /copyright\s*(?:©|\(c\))?\s*\d{4}/gi,
      /all\s*rights?\s*reserved/gi
    ],
    navigation: [
      /menu[-\s]*items?/gi,
      /(?:main|primary|secondary)[-\s]*menu/gi
    ],
    header: [
      /(?:navigation|header|footer)[-\s]*content/gi
    ]
  }
};