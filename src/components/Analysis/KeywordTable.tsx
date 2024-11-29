import React from 'react';
import type { KeywordTableProps } from '../../types';

export function KeywordTable({ keywords, title, pageTitle, headings }: KeywordTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Density
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                onwardSEO Prominence Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keywords.map((item, index) => {
              const indicators = getTagIndicators(item.keyword, pageTitle, headings);
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.keyword}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(item.density * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-gray-500">{(item.prominence * 100).toFixed(2)}%</span>
                    {indicators.length > 0 && (
                      <span className="text-gray-400 ml-1 font-bold">
                        ({indicators.join(', ')})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getTagIndicators(
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