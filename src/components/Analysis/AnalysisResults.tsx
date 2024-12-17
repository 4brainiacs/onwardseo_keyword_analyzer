import React from 'react';
import { WordCount } from './WordCount';
import { PageStructure } from './PageStructure';
import { KeywordTable } from './KeywordTable';
import { ScrapedContent } from './ScrapedContent';
import type { AnalysisResult, ContentCategory } from '../../types';

export interface AnalysisResultsProps {
  result: AnalysisResult;
}

interface Classification {
  primaryCategory: ContentCategory;
  secondaryCategories: ContentCategory[];
}

export function AnalysisResults({ result }: AnalysisResultsProps): JSX.Element {
  if (!result) {
    return <div>No analysis results available</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PageStructure 
          title={result.title} 
          classification={result.classification as Classification}
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