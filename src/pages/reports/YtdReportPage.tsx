import { useQuery } from '@tanstack/react-query'
import PageHeader from '@/components/common/PageHeader'
import ExportButtons from '@/components/common/ExportButtons'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency } from '@/lib/utils'
import { getYtdReport } from '@/services/reports.service'

export default function YtdReportPage() {
  usePageTitle('Year-to-Date')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', 'ytd'],
    queryFn: getYtdReport,
  })

  return (
    <>
      <PageHeader title="Year-to-Date Summary" actions={<ExportButtons />} />

      {isError ? (
        <ErrorBanner message="Failed to load year-to-date report." onRetry={refetch} />
      ) : (
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Month</th>
              <th className="px-4 py-2.5 text-right font-medium text-gray-600">Order Count</th>
              <th className="px-4 py-2.5 text-right font-medium text-gray-600">Total Cost</th>
              <th className="px-4 py-2.5 text-right font-medium text-gray-600">Running Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={4} className="px-4 py-3">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : (
              data?.map((row) => (
                <tr key={row.month} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.month}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {row.orderCount != null ? row.orderCount : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {row.totalCost != null ? formatCurrency(row.totalCost) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">
                    {row.runningTotal != null ? formatCurrency(row.runningTotal) : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
    </>
  )
}
