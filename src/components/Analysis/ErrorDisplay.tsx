import { AlertCircle, RefreshCw } from 'lucide-react';
import { AnalysisError } from '../../services/errors';

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const isAnalysisError = error instanceof AnalysisError;
  const details = isAnalysisError ? error.details : undefined;
  
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
          <div className="mt-2">
            <p className="text-sm text-red-700">{error.message}</p>
            {details && (
              <p className="mt-1 text-sm text-red-600">{details}</p>
            )}
          </div>
          {isAnalysisError && error.retryable && onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}