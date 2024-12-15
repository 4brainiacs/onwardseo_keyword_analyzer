import { useState } from 'react';
import { UrlInput } from './components/Form/UrlInput';
import { AnalysisResults } from './components/Analysis/AnalysisResults';
import { ErrorDisplay } from './components/Analysis/ErrorDisplay';
import { CalculationExamples } from './components/Analysis/CalculationExamples';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAnalysis } from './hooks';
import { logger } from './utils/logger';
import { AnalysisError } from './services/errors';

export default function App() {
  const [isInputEnabled, setIsInputEnabled] = useState(true);
  
  const { 
    analyze, 
    reset, 
    isLoading, 
    error, 
    result 
  } = useAnalysis({
    onSuccess: () => {
      setIsInputEnabled(false);
      logger.info('Analysis completed successfully');
    },
    onError: (error) => {
      logger.error('Analysis failed:', {
        error: error instanceof AnalysisError ? error : error,
        context: 'App component error handler'
      });
    }
  });

  const handleNewAnalysis = () => {
    setIsInputEnabled(true);
    reset();
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="space-y-8">
            <UrlInput 
              onAnalyze={analyze}
              isLoading={isLoading}
              isEnabled={isInputEnabled}
              onNewAnalysis={handleNewAnalysis}
            />
            
            {error && (
              <ErrorDisplay 
                error={error}
                onRetry={error instanceof AnalysisError && error.retryable ? 
                  () => analyze(error.requestId || '') : undefined}
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