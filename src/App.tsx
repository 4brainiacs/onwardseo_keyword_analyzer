import { useState, useEffect } from 'react';
import { UrlInput } from './components/Form/UrlInput';
import { AnalysisResults } from './components/Analysis/AnalysisResults';
import { ErrorDisplay } from './components/Analysis/ErrorDisplay';
import { CalculationExamples } from './components/Analysis/CalculationExamples';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useApi } from './hooks/useApi';
import { logger } from './utils/logger';
import type { AnalysisResult } from './types';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInputEnabled, setIsInputEnabled] = useState(true);
  const { request, isLoading, error, data: result, reset } = useApi({
    onSuccess: () => setIsInputEnabled(false),
    onError: (error) => logger.error('Analysis failed:', error)
  });

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleAnalyze = async (url: string) => {
    await request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  };

  const handleNewAnalysis = () => {
    setIsInputEnabled(true);
    reset();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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
                details={error instanceof Error ? error.message : undefined}
              />
            )}
            
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            )}
            
            {result && (
              <AnalysisResults result={result} />
            )}
            
            {!result && !error && !isLoading && (
              <CalculationExamples />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}