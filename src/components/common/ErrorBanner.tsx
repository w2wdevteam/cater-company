import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBannerProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorBanner({
  message = 'Something went wrong',
  onRetry,
}: ErrorBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      <p className="flex-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0 gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  )
}
