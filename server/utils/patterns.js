export const DATE_PATTERNS = [
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/i,
  /\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/i,
  /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i,
  /\d{1,2}\/\d{1,2}\/\d{2,4}/i,
  /\d{4}\/\d{1,2}\/\d{1,2}/i
];

export const PHONE_PATTERNS = [
  /(?:\+\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}/g,
  /\(\+\d{1,4}\)/g
];

export const CODE_PATTERNS = [
  /<\/?[^>]+(>|$)/g,
  /\{[\s\S]*?\}/g,
  /\[[\s\S]*?\]/g,
  /function\s*\(.*?\)/g,
  /\b(?:var|let|const)\s+\w+\s*=/g
];