import { useQuery } from '@tanstack/react-query'
import { Clock, ShoppingCart, UserX } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getDailyStatus } from '@/services/reports.service'

export default function DailyStatusPage() {
  usePageTitle('Daily Order Status')

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['report', 'dailyStatus'],
    queryFn: getDailyStatus,
    refetchInterval: 60_000,
  })

  const secondsAgo = dataUpdatedAt ? Math.floor((Date.now() - dataUpdatedAt) / 1000) : 0

  return (
    <>
      <PageHeader
        title="Daily Order Status"
        actions={
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            Last updated: {secondsAgo}s ago
          </div>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load daily status." onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-md border p-4">
              <div className="mb-3 h-5 w-32 animate-pulse rounded bg-gray-200" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="mb-2 h-10 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-gray-900">Ordered</h3>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                {data?.ordered.length ?? 0}
              </span>
            </div>
            <div className="divide-y">
              {data?.ordered.map((emp, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="font-medium text-gray-900">{emp.employeeName}</span>
                  <span className="text-gray-500">{emp.menuItemName}</span>
                </div>
              ))}
              {data?.ordered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-gray-400">No orders yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <UserX className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Not Yet Ordered</h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {data?.notOrdered.length ?? 0}
              </span>
            </div>
            <div className="divide-y">
              {data?.notOrdered.map((emp, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="font-medium text-gray-900">{emp.employeeName}</span>
                  <span className="text-gray-500">{emp.departmentName}</span>
                </div>
              ))}
              {data?.notOrdered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-gray-400">Everyone has ordered!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
