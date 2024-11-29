import { KeywordAnalysis } from '../types';
import { getTagIndicators } from '../utils/tagUtils';

export function exportToCSV(
  twoWordPhrases: KeywordAnalysis[],
  threeWordPhrases: KeywordAnalysis[],
  fourWordPhrases: KeywordAnalysis[],
  pageTitle: string,
  headings: { h1: string[], h2: string[], h3: string[], h4: string[] }
): void {
  // Prepare CSV data
  const headers = ['Phrase Type,Keyword,Count,Density,Prominence,Prominence Tags'];
  const rows = [
    ...formatPhrases(twoWordPhrases, 'Two-Word', pageTitle, headings),
    ...formatPhrases(threeWordPhrases, 'Three-Word', pageTitle, headings),
    ...formatPhrases(fourWordPhrases, 'Four-Word', pageTitle, headings)
  ];

  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `keyword-analysis-${getTimestamp()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatPhrases(
  phrases: KeywordAnalysis[], 
  type: string,
  pageTitle: string,
  headings: { h1: string[], h2: string[], h3: string[], h4: string[] }
): string[] {
  return phrases.map(phrase => {
    const tags = getTagIndicators(phrase.keyword, pageTitle, headings);
    return [
      type,
      `"${phrase.keyword}"`,
      phrase.count,
      `${(phrase.density * 100).toFixed(2)}%`,
      `${(phrase.prominence * 100).toFixed(2)}%`,
      tags.length > 0 ? `"${tags.join(', ')}"` : ''
    ].join(',');
  });
}

function getTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
}