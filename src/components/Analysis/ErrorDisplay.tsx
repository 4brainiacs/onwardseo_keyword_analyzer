import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  details?: string;
}

export function ErrorDisplay({ message, details }: ErrorDisplayProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
          <div className="mt-2">
            <p className="text-sm text-red-700">{message}</p>
            {details && (
              <p className="mt-1 text-sm text-red-600">{details}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}