import { CONTENT_PATTERNS } from './patterns';

export function cleanContent(html) {
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $('script, style, noscript, iframe, svg, nav, header, footer').remove();
  $('.navigation, .menu, .footer, .header, .sidebar').remove();

  // Get text content
  let text = $('body').text();

  // Apply cleaning patterns
  CONTENT_PATTERNS.forEach(pattern => {
    text = text.replace(pattern, ' ');
  });

  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}