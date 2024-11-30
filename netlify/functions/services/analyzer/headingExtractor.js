import cheerio from 'cheerio';

export function extractHeadings(html) {
  const $ = cheerio.load(html);
  
  // Remove unwanted elements
  $('script, style, noscript, iframe, svg').remove();

  return {
    title: $('title').text().trim(),
    metaDescription: $('meta[name="description"]').attr('content')?.trim() || '',
    headings: {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get()
    }
  };
}