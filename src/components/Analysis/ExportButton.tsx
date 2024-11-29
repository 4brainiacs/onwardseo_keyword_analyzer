import React from 'react';
import { Download } from 'lucide-react';
import { exportToCSV } from '../../services/exportService';
import type { KeywordAnalysis } from '../../types';

interface ExportButtonProps {
  twoWordPhrases: KeywordAnalysis[];
  threeWordPhrases: KeywordAnalysis[];
  fourWordPhrases: KeywordAnalysis[];
  pageTitle: string;
  headings: { h1: string[], h2: string[], h3: string[], h4: string[] };
}

export function ExportButton({ 
  twoWordPhrases, 
  threeWordPhrases, 
  fourWordPhrases,
  pageTitle,
  headings
}: ExportButtonProps) {
  const handleExport = () => {
    exportToCSV(
      twoWordPhrases, 
      threeWordPhrases, 
      fourWordPhrases,
      pageTitle,
      headings
    );
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Download className="mr-2 h-4 w-4" />
      Export Analysis
    </button>
  );
}