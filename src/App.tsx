import { useState } from 'react';
import { UrlInput } from './components/Form/UrlInput';
import { AnalysisResults } from './components/Analysis/AnalysisResults';
import { ErrorDisplay } from './components/Analysis/ErrorDisplay';
import { CalculationExamples } from './components/Analysis/CalculationExamples';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { AnalysisResult } from './types';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { scrapeWebpage } from './services/scraper';
import { analyzeContent } from './services/analyzer';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isInputEnabled, setIsInputEnabled] = useState(true);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const html = await scrapeWebpage(url);
      const analysisResult = analyzeContent(html);
      setResult(analysisResult);
      setIsInputEnabled(false);
    } catch (err: any) {
      setError({
        message: err.message || 'Analysis failed',
        details: err.details || 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setIsInputEnabled(true);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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