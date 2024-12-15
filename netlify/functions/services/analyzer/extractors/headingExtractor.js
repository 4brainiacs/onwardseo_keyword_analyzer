import { logger } from '../../utils/logger';

export function extractHeadings($) {
  try {
    const headings = {
      h1: extractHeadingsByTag($, 'h1'),
      h2: extractHeadingsByTag($, 'h2'),
      h3: extractHeadingsByTag($, 'h3'),
      h4: extractHeadingsByTag($, 'h4')
    };

    logger.debug('Headings extracted', {
      h1Count: headings.h1.length,
      h2Count: headings.h2.length,
      h3Count: headings.h3.length,
      h4Count: headings.h4.length
    });

    return headings;
  } catch (error) {
    logger.error('Heading extraction failed:', error);
    return { h1: [], h2: [], h3: [], h4: [] };
  }
}

function extractHeadingsByTag($, tag) {
  return $(tag)
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(text => text.length > 0);
}