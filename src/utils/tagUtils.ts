export function getTagIndicators(
  keyword: string,
  pageTitle: string,
  headings: { h1: string[], h2: string[], h3: string[], h4: string[] }
): string[] {
  const indicators: string[] = [];
  const lowerKeyword = keyword.toLowerCase();

  if (pageTitle?.toLowerCase().includes(lowerKeyword)) {
    indicators.push('T');
  }
  if (headings.h1?.some(h => h?.toLowerCase().includes(lowerKeyword))) {
    indicators.push('H1');
  }
  if (headings.h2?.some(h => h?.toLowerCase().includes(lowerKeyword))) {
    indicators.push('H2');
  }
  if (headings.h3?.some(h => h?.toLowerCase().includes(lowerKeyword))) {
    indicators.push('H3');
  }
  if (headings.h4?.some(h => h?.toLowerCase().includes(lowerKeyword))) {
    indicators.push('H4');
  }

  return indicators;
}