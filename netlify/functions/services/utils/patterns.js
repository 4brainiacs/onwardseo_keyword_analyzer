export const CONTENT_PATTERNS = [
  // Navigation patterns
  /menu[-\s]*items?/gi,
  /(?:main|primary|secondary)[-\s]*menu/gi,
  /(?:navigation|header|footer)[-\s]*content/gi,

  // Date patterns
  /\d{4}-\d{2}-\d{2}/g,
  /\d{1,2}\/\d{1,2}\/\d{2,4}/g,

  // Contact patterns
  /(?:tel|phone|fax|email):\s*[\d\w@.-]+/gi,
  /(?:\+\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}/g,

  // Code patterns
  /<[^>]+>/g,
  /\{[\s\S]*?\}/g,
  /function\s*\(.*?\)/g
];