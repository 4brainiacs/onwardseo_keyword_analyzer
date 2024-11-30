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
import type { AnalysisResult } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isInputEnabled, setIsInputEnabled] = useState(true);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting analysis for:', url);
      const html = await scrapeWebpage(url);
      console.log('Received HTML response');
      const analysisResult = analyzeContent(html);
      console.log('Analysis completed');
      setResult(analysisResult);
      setIsInputEnabled(false);
    } catch (err: any) {
      console.error('Analysis failed:', err);
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