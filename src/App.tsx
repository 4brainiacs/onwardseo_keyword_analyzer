import { useState } from 'react';
import { UrlInput } from './components/Form/UrlInput';
import { AnalysisResults } from './components/Analysis/AnalysisResults';
import { ErrorDisplay } from './components/Analysis/ErrorDisplay';
import { CalculationExamples } from './components/Analysis/CalculationExamples';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { scrapeWebpage } from './services/scraper';
import { analyzeContent } from './services/analyzer';
import { logger } from './utils/logger';
import type { AnalysisResult } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isInputEnabled, setIsInputEnabled] = useState(true);

  const handleAnalyze = async (url: string) => {
    logger.info('Starting analysis', { url });
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Fetching webpage content');
      const html = await scrapeWebpage(url);
      
      logger.info('Analyzing content');
      const analysisResult = analyzeContent(html);
      
      logger.info('Analysis complete', { 
        wordCount: analysisResult.totalWords,
        headings: Object.keys(analysisResult.headings).length
      });
      
      setResult(analysisResult);
      setIsInputEnabled(false);
    } catch (err: any) {
      logger.error('Analysis failed', { 
        error: err,
        url,
        message: err.message,
        stack: err.stack
      });
      
      setError({
        message: err.message || 'Analysis failed',
        details: err.details || 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    logger.info('Starting new analysis');
    setIsInputEnabled(true);
    setResult(null);
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="space-y-8">
            <UrlInput 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
              isEnabled={isInputEnabled}
              onNewAnalysis={handleNewAnalysis}
            />
            
            {error && (
              <ErrorDisplay 
                message={error.message} 
                details={error.details}
              />
            )}
            
            {result && (
              <AnalysisResults result={result} />
            )}
            
            {!result && !error && (
              <CalculationExamples />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}