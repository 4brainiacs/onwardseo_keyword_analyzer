import { useState } from 'react';
import { PieChart } from 'lucide-react';
import type { KeywordAnalysis } from '../../types';

interface TopKeywordsProps {
  twoWordPhrases: KeywordAnalysis[];
  threeWordPhrases: KeywordAnalysis[];
  fourWordPhrases: KeywordAnalysis[];
}

const COLORS = [
  'hsl(210, 100%, 45%)',  // Deep Blue
  'hsl(150, 100%, 35%)',  // Emerald Green
  'hsl(350, 100%, 50%)',  // Vibrant Red
  'hsl(45, 100%, 50%)',   // Golden Yellow
  'hsl(280, 100%, 45%)',  // Royal Purple
  'hsl(170, 100%, 35%)'   // Teal
];

export function TopKeywords({ twoWordPhrases, threeWordPhrases, fourWordPhrases }: TopKeywordsProps) {
  const [hoveredKeyword, setHoveredKeyword] = useState<KeywordAnalysis | null>(null);

  const topKeywords = [
    ...twoWordPhrases.slice(0, 2),
    ...threeWordPhrases.slice(0, 2),
    ...fourWordPhrases.slice(0, 2)
  ].sort((a, b) => b.prominence - a.prominence);

  const total = topKeywords.reduce((sum, kw) => sum + kw.prominence, 0);
  const getPercentage = (prominence: number) => ((prominence / total) * 100);

  let cumulativePercentage = 0;

  return (
    <div className="mt-6 bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <PieChart className="h-8 w-8 text-blue-500" />
          <h2 className="ml-4 text-xl font-semibold text-gray-900">Top Page Keywords</h2>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <svg viewBox="0 0 100 100" className="w-full">
            <circle cx="50" cy="50" r="45" fill="#f3f4f6"/>
            
            {topKeywords.map((keyword, i) => {
              const percentage = getPercentage(keyword.prominence);
              const strokeDasharray = percentage * 2.83;
              const strokeDashoffset = -cumulativePercentage * 2.83;
              cumulativePercentage += percentage;

              return (
                <g key={keyword.keyword}>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke={COLORS[i]}
                    strokeWidth="12"
                    strokeDasharray={`${strokeDasharray} 283`}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-200"
                    style={{
                      opacity: hoveredKeyword && hoveredKeyword !== keyword ? 0.4 : 1
                    }}
                    onMouseEnter={() => setHoveredKeyword(keyword)}
                    onMouseLeave={() => setHoveredKeyword(null)}
                  />
                </g>
              );
            })}
            
            <circle cx="50" cy="50" r="35" fill="white"/>
            
            {hoveredKeyword && (
              <foreignObject x="25" y="40" width="50" height="20">
                <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs text-center">
                  {(hoveredKeyword.prominence * 100).toFixed(1)}%
                </div>
              </foreignObject>
            )}
          </svg>
        </div>

        <div className="space-y-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-gray-500">Keyword</th>
                <th className="text-right text-sm font-medium text-gray-500">onwardSEO Prominence Score</th>
              </tr>
            </thead>
            <tbody>
              {topKeywords.map((keyword, i) => (
                <tr 
                  key={keyword.keyword}
                  className="transition-all duration-200 hover:bg-gray-50"
                  onMouseEnter={() => setHoveredKeyword(keyword)}
                  onMouseLeave={() => setHoveredKeyword(null)}
                >
                  <td className="py-2">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2 transition-opacity duration-200"
                        style={{ 
                          backgroundColor: COLORS[i],
                          opacity: hoveredKeyword && hoveredKeyword !== keyword ? 0.4 : 1
                        }}
                      />
                      <span 
                        className={`transition-all duration-200 ${
                          hoveredKeyword === keyword 
                            ? 'text-base font-semibold text-gray-900' 
                            : hoveredKeyword 
                              ? 'text-sm text-gray-400'
                              : 'text-sm text-gray-900'
                        }`}
                      >
                        {keyword.keyword}
                      </span>
                    </div>
                  </td>
                  <td 
                    className={`text-right transition-all duration-200 ${
                      hoveredKeyword === keyword 
                        ? 'text-base font-semibold text-gray-900'
                        : hoveredKeyword
                          ? 'text-sm text-gray-400'
                          : 'text-sm text-gray-500'
                    }`}
                  >
                    {(keyword.prominence * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}