export const CONTENT_FILTERS = {
  contentTags: new Set([
    'p', 'article', 'section', 'main', 
    'div.content', 'div.main',
    'div.article', '.post-content', 
    '.entry-content', '.article-content'
  ]),
  
  excludeTags: new Set([
    'script', 'style', 'noscript', 'iframe',
    'nav', 'header', 'footer', 'aside',
    'advertisement', '.ad', '.ads', '.cookie'
  ]),
  
  patterns: {
    dates: [/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/],
    phoneNumbers: [/(?:\+\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}/],
    code: [/<[^>]+>/g]
  }
} as const;

export type ContentFilters = typeof CONTENT_FILTERS;