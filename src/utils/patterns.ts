export const DATE_PATTERNS = [
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/i,
  /\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/i,
  /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i,
  /\d{1,2}\/\d{1,2}\/\d{2,4}/i,
  /\d{4}\/\d{1,2}\/\d{1,2}/i
];

export const PHONE_PATTERNS = [
  /(?:\+\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}/g,
  /\(\+\d{1,4}\)/g,
  /\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}/g,
  /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
  /\+\d{1,4}\s\d{1,14}(?:[\s-]\d{1,4}){0,3}/g
];

export const CODE_PATTERNS = [
  /<\/?[^>]+(>|$)/g,
  /\{[\s\S]*?\}/g,
  /\[[\s\S]*?\]/g,
  /function\s*\(.*?\)/g,
  /\b(?:var|let|const)\s+\w+\s*=/g
];

export const FOOTER_PATTERNS = [
  // Copyright and legal
  /copyright\s*(?:©|\(c\))?\s*\d{4}/gi,
  /all\s*rights?\s*reserved/gi,
  /terms\s*(?:of\s*(?:use|service)|&\s*conditions?)/gi,
  /privacy\s*policy/gi,
  
  // Company identifiers
  /(?:ltd|inc|llc|corp|co|company)\.?(?:\s|$)/gi,
  
  // Contact information
  /(?:tel|phone|fax|email|address|contact)(?:\s*:|\s+us)/gi,
  /(?:follow|connect|find)\s+us/gi,
  
  // Social media
  /(?:facebook|twitter|linkedin|instagram|youtube|whatsapp)(?:\s|$)/gi,
  /(?:fb|tw|ig|yt)(?:\s|$)/gi,
  /social\s*media/gi,
  
  // Footer specific elements
  /powered\s*by/gi,
  /designed\s*by/gi,
  /developed\s*by/gi,
  /maintained\s*by/gi,
  /hosted\s*by/gi,
  
  // Common footer links
  /site\s*map/gi,
  /accessibility/gi,
  /cookie\s*(?:policy|preferences|settings)/gi,
  /newsletter/gi,
  
  // Location patterns
  /\b(?:street|avenue|road|boulevard|lane|drive|way|plaza|square)\b/gi,
  /\b(?:suite|floor|unit|building)\s*#?\d+\b/gi,
  /\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/g, // ZIP codes
  
  // Combined patterns for social media without spaces
  /(?:Facebook|Twitter|LinkedIn|Instagram|YouTube|WhatsApp)(?:[A-Z][a-z]*)*\b/g,
  
  // Footer class patterns
  /class="[^"]*footer[^"]*"/gi,
  /id="[^"]*footer[^"]*"/gi
];

export const NAVIGATION_PATTERNS = [
  // Skip links and accessibility
  /skip\s*to\s*(?:main\s*)?content/gi,
  /skip\s*(?:to\s*)?navigation/gi,
  
  // Common navigation elements
  /main\s*menu/gi,
  /primary\s*(?:menu|navigation)/gi,
  /site\s*navigation/gi,
  /menu[-\s]*toggle/gi,
  /navigation[-\s]*menu/gi,
  /nav[-\s]*menu/gi,
  
  // Menu items and labels
  /menu[-\s]*item/gi,
  /(?:sub|dropdown|mega|flyout)[-\s]*menu/gi,
  /class="[^"]*(?:sub|dropdown|mega|flyout)-menu[^"]*"/gi,
  /menu[-\s]*button/gi,
  /hamburger[-\s]*menu/gi,
  
  // Sub-menu specific patterns
  /(?:sub|child)[-\s]*nav(?:igation)?/gi,
  /has[-\s]*(?:sub|child)[-\s]*menu/gi,
  /menu[-\s]*(?:level|depth)[-\s]*\d+/gi,
  /(?:parent|child)[-\s]*item/gi,
  /dropdown[-\s]*(?:content|wrapper|container)/gi,
  
  // Menu state and interaction patterns
  /menu[-\s]*(?:active|open|expanded|collapsed)/gi,
  /(?:expand|collapse)[-\s]*(?:menu|submenu)/gi,
  /toggle[-\s]*(?:sub|child)?[-\s]*menu/gi,
  
  // Common header/nav actions
  /get[-\s]*(?:a[-\s]*)?quote/gi,
  /call[-\s]*(?:us[-\s]*)?today/gi,
  /contact[-\s]*(?:us|now)/gi,
  /login/gi,
  /sign[-\s]*(?:in|up|out)/gi,
  /register/gi,
  /my[-\s]*account/gi,
  
  // Navigation attributes
  /data[-\s]*(?:close|open)[-\s]*icon/gi,
  /data[-\s]*full[-\s]*width/gi,
  /aria[-\s]*(?:label|expanded|controls|hidden)/gi,
  /data[-\s]*(?:submenu|dropdown)/gi,
  
  // Loading states
  /loading[-\s]*(?:content|data|page)?/gi,
  
  // Common nav sections with word boundaries
  /\b(?:home|about(?:\s*us)?|services|products|portfolio|blog|news|contact)\b/gi,
  
  // Tools and features in nav
  /\b(?:search|calculator|tools|resources)\b/gi,
  
  // Location/language selectors
  /select[-\s]*(?:language|region|country)/gi,
  /language[-\s]*selector/gi,
  /country[-\s]*selector/gi,
  
  // Combined terms without spaces
  /(?:Home|About|Services|Products|Blog|News|Contact)(?=[A-Z])/g,
  /(?:Facebook|Twitter|LinkedIn|Instagram|YouTube)(?=[A-Z]|$)/g
];

export const HEADER_PATTERNS = [
  // Header containers
  /class="[^"]*header[^"]*"/gi,
  /id="[^"]*header[^"]*"/gi,
  /role="banner"/gi,
  
  // Common header elements
  /site[-\s]*header/gi,
  /main[-\s]*header/gi,
  /page[-\s]*header/gi,
  /header[-\s]*(?:content|wrapper|container)/gi,
  
  // Header navigation
  /header[-\s]*nav(?:igation)?/gi,
  /top[-\s]*nav(?:igation)?/gi,
  /primary[-\s]*nav(?:igation)?/gi,
  
  // Header actions
  /header[-\s]*(?:search|cart|login|menu)/gi,
  /top[-\s]*(?:search|cart|login|menu)/gi,
  
  // Utility navigation
  /utility[-\s]*nav(?:igation)?/gi,
  /secondary[-\s]*nav(?:igation)?/gi,
  
  // Header specific classes
  /sticky[-\s]*header/gi,
  /fixed[-\s]*header/gi,
  /transparent[-\s]*header/gi,
  
  // Header states
  /header[-\s]*(?:active|visible|hidden|collapsed|expanded)/gi,
  
  // Header components
  /logo[-\s]*(?:container|wrapper|image)/gi,
  /brand(?:ing)?[-\s]*(?:container|wrapper|image)/gi,
  
  // Header buttons and controls
  /mobile[-\s]*(?:menu|nav)[-\s]*(?:button|toggle|icon)/gi,
  /nav[-\s]*(?:button|toggle|icon)/gi,
  
  // Header specific attributes
  /data[-\s]*header/gi,
  /js[-\s]*header/gi,
  
  // Menu item patterns
  /menu-items?(?:\s|$)/gi,
  /class="[^"]*menu-items?[^"]*"/gi,
  /id="[^"]*menu-items?[^"]*"/gi,
  /(?:header|main|primary|secondary)[-\s]*menu-items?/gi,
  /menu-items?[-\s]*(?:container|wrapper|list)/gi,
  /menu-items?[-\s]*(?:active|current|selected)/gi,
  /menu-items?[-\s]*(?:level|depth)[-\s]*\d+/gi,
  /(?:sub|child)[-\s]*menu-items?/gi,
  /has[-\s]*(?:sub|child)[-\s]*menu-items?/gi,
  /menu-items?[-\s]*(?:hover|focus|expanded)/gi
];