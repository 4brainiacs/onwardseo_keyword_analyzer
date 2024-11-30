export const SCRAPING_CONFIG = {
  timeout: 30000,
  headers: {
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate'
  },
  options: {
    render_js: false,
    premium_proxy: true,
    block_ads: true,
    block_resources: true,
    wait_browser: false,
    country_code: 'us'
  }
};

export const ANALYSIS_CONFIG = {
  maxPhraseLength: 4,
  minWordLength: 3,
  maxResults: 10,
  weights: {
    title: 2.0,
    h1: 1.5,
    h2: 1.2,
    h3: 1.0,
    h4: 0.8,
    position: 0.9,
    maxTotal: 7.4
  }
};