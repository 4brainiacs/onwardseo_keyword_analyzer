import React from 'react';
import type { AnalysisResultsProps } from '../../types';
import { PageStructure } from './PageStructure';
import { KeywordTable } from './KeywordTable';
import { ScrapedContent } from './ScrapedContent';
import { WordCount } from './WordCount';

export function AnalysisResults({ result }: AnalysisResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PageStructure 
          title={result.title} 
          headings={result.headings}
          metaDescription={result.metaDescription} 
        />
        <WordCount 
          count={result.totalWords} 
          twoWordPhrases={result.twoWordPhrases}
          threeWordPhrases={result.threeWordPhrases}
          fourWordPhrases={result.fourWordPhrases}
          pageTitle={result.title}
          headings={result.headings}
        />
      </div>
      
      <div className="space-y-6">
        <KeywordTable 
          keywords={result.twoWordPhrases} 
          title="Two-Word Phrases"
          pageTitle={result.title}
          headings={result.headings}
        />
        <KeywordTable 
          keywords={result.threeWordPhrases} 
          title="Three-Word Phrases"
          pageTitle={result.title}
          headings={result.headings}
        />
        <KeywordTable 
          keywords={result.fourWordPhrases} 
          title="Four-Word Phrases"
          pageTitle={result.title}
          headings={result.headings}
        />
      </div>

      <ScrapedContent content={result.scrapedContent} />
    </div>
  );
}