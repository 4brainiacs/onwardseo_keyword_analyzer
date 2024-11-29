import sanitizeHtml from 'sanitize-html';

export function parseHtml(content) {
  // First validate if it's HTML
  if (!isValidHtml(content)) {
    throw new Error('Invalid HTML content received');
  }

  // Clean and sanitize HTML
  const cleaned = sanitizeHtml(content, {
    allowedTags: [
      'html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'div', 'span', 'article', 'section', 'main', 'nav', 'header',
      'footer', 'aside', 'ul', 'ol', 'li', 'a'
    ],
    allowedAttributes: {
      'a': ['href']
    },
    nonTextTags: ['style', 'script', 'textarea', 'noscript', 'iframe'],
    transformTags: {
      'a': (tagName, attribs) => {
        return {
          tagName,
          attribs: {
            href: attribs.href
          }
        };
      }
    }
  });

  return cleaned;
}

function isValidHtml(text) {
  const trimmed = text.trim().toLowerCase();
  return (
    trimmed.startsWith('<!doctype') ||
    trimmed.startsWith('<html') ||
    trimmed.includes('<body') ||
    trimmed.includes('<head')
  );
}