import { useState, FormEvent } from 'react';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { validateUrl } from '../../utils/validation/urlValidator';

interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  isEnabled: boolean;
  onNewAnalysis: () => void;
}

export function UrlInput({ 
  onAnalyze, 
  isLoading, 
  isEnabled, 
  onNewAnalysis 
}: UrlInputProps): JSX.Element {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL');
      return;
    }

    const validation = validateUrl(trimmedUrl);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid URL');
      return;
    }

    setError(null);
    try {
      await onAnalyze(trimmedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (error) {
      setError(null);
    }
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
            <div className="flex-grow relative">
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Enter webpage URL to analyze (e.g., https://example.com)"
                className={`
                  w-full h-14 px-6 rounded-lg border 
                  ${error ? 'border-red-300' : 'border-gray-300'}
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 
                  text-lg transition-colors duration-200
                  disabled:bg-gray-50 disabled:text-gray-500
                `}
                disabled={!isEnabled || isLoading}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'url-error' : undefined}
              />
              {error && (
                <div 
                  id="url-error"
                  className="absolute -bottom-6 left-0 text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!isEnabled && (
                <button
                  type="button"
                  onClick={handleNewAnalysis}
                  className="
                    inline-flex items-center px-8 h-14 
                    border border-gray-300 rounded-lg
                    text-lg font-medium text-gray-700 
                    bg-white hover:bg-gray-50 
                    shadow-sm transition-colors duration-200
                    focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-blue-500 
                    whitespace-nowrap
                  "
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  New Analysis
                </button>
              )}
              <button
                type="submit"
                disabled={!isEnabled || isLoading}
                className="
                  inline-flex items-center px-8 h-14 
                  border border-transparent rounded-lg
                  text-lg font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 
                  shadow-sm transition-colors duration-200
                  focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500 
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  whitespace-nowrap
                "
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                      />
                    </svg>
                    <span>Analyzing...</span>
                  </span>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    <span>Start Analyzing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}