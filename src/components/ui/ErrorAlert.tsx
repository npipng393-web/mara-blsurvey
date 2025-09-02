'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
}

export function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
