import React from 'react';
import { FileText } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { TopKeywords } from './TopKeywords';
import type { KeywordAnalysis } from '../../types';

interface WordCountProps {
  count: number;
  twoWordPhrases: KeywordAnalysis[];
  threeWordPhrases: KeywordAnalysis[];
  fourWordPhrases: KeywordAnalysis[];
  pageTitle: string;
  headings: { h1: string[], h2: string[], h3: string[], h4: string[] };
}

export function WordCount({ 
  count,
  twoWordPhrases,
  threeWordPhrases,
  fourWordPhrases,
  pageTitle,
  headings
}: WordCountProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Total Words</h2>
              <p className="mt-1 text-3xl font-bold text-blue-600">{count.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <ExportButton 
            twoWordPhrases={twoWordPhrases}
            threeWordPhrases={threeWordPhrases}
            fourWordPhrases={fourWordPhrases}
            pageTitle={pageTitle}
            headings={headings}
          />
        </div>
      </div>

      <TopKeywords
        twoWordPhrases={twoWordPhrases}
        threeWordPhrases={threeWordPhrases}
        fourWordPhrases={fourWordPhrases}
      />
    </div>
  );
}