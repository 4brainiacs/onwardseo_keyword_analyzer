import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  onReset?: () => void;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    logger.error('React Error Boundary Caught Error:', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount,
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Report to console in a format easy to find in Netlify logs
    console.error('=================== REACT ERROR ===================');
    console.error('Error:', error.message);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('URL:', window.location.href);
    console.error('User Agent:', navigator.userAgent);
    console.error('================================================');
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    this.props.onReset?.();
  };

  private canRetry(): boolean {
    return this.state.retryCount < (this.props.maxRetries || 3);
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-medium text-red-800">
              Something went wrong
            </h3>
          </div>
          <div className="mt-4">
            <p className="text-sm text-red-700">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <pre className="mt-2 max-h-32 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
          {this.canRetry() && (
            <div className="mt-6">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center space-x-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again ({this.state.retryCount} of {this.props.maxRetries || 3})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}