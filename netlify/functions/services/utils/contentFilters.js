export const CONTENT_FILTERS = [
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
  /function\s*\(.*?\)/g,

  // Footer patterns
  /copyright\s*(?:©|\(c\))?\s*\d{4}/gi,
  /all\s*rights?\s*reserved/gi,
  /terms\s*(?:of\s*(?:use|service)|&\s*conditions?)/gi,
  /privacy\s*policy/gi,

  // Social media patterns
  /(?:facebook|twitter|linkedin|instagram)(?:\s|$)/gi,
  /(?:follow|connect|find)\s+us/gi,

  // Navigation elements
  /site\s*map/gi,
  /accessibility/gi,
  /cookie\s*(?:policy|preferences|settings)/gi,
  /newsletter/gi
];