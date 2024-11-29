export function sanitizeUrl(url: string): string | null {
  try {
    const trimmed = url.trim();
    const parsed = new URL(trimmed);
    
    // Ensure protocol is http or https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Remove any script tags or dangerous content
    const sanitized = parsed.toString()
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '');

    // Encode special characters in the URL
    return encodeURI(sanitized);
  } catch {
    return null;
  }
}