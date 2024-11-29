import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: {
    message: string;
    details?: string;
  };
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
            {error.details && (
              <p className="mt-1 text-sm text-red-600">{error.details}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}