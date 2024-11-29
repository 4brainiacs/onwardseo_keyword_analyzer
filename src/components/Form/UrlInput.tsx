import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  isEnabled: boolean;
  onNewAnalysis: () => void;
}

export function UrlInput({ onAnalyze, isLoading, isEnabled, onNewAnalysis }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError(null);
    await onAnalyze(trimmedUrl);
  };

  const handleNewAnalysis = () => {
    setUrl('');
    setError(null);
    onNewAnalysis();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-4">
            <div className="flex-grow">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder="Enter webpage URL to analyze (e.g., https://example.com)"
                className={`w-full h-14 px-6 rounded-lg border ${
                  error ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg`}
                disabled={!isEnabled || isLoading}
              />
            </div>
            <div className="flex gap-2">
              {!isEnabled && (
                <button
                  type="button"
                  onClick={handleNewAnalysis}
                  className="inline-flex items-center px-8 h-14 border border-gray-300 text-lg font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  New Analysis
                </button>
              )}
              <button
                type="submit"
                disabled={!isEnabled || isLoading}
                className="inline-flex items-center px-8 h-14 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Start Analyzing
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}