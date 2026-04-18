import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageHeader from '@/components/common/PageHeader'
import ExportButtons from '@/components/common/ExportButtons'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate, formatDateTime } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import { getCancellationLog } from '@/services/reports.service'

export default function CancellationLogPage() {
  usePageTitle('Cancellation Log')

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', 'cancellations', from, to],
    queryFn: () => getCancellationLog({ from: from || undefined, to: to || undefined }),
  })

  return (
    <>
      <PageHeader title="Cancellation Log" actions={<ExportButtons />} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <DatePicker value={from} onChange={(v) => setFrom(v)} placeholder="From date" />
        <span className="text-sm text-gray-400">to</span>
        <DatePicker value={to} onChange={(v) => setTo(v)} placeholder="To date" />
      </div>

      {isError ? (
        <ErrorBanner message="Failed to load cancellation log." onRetry={refetch} />
      ) : (
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Employee</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Menu Item</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Order Date</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Cancelled At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={4} className="px-4 py-3"><div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" /></td>
                </tr>
              ))
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">No cancellations found.</td>
              </tr>
            ) : (
              data?.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.employeeName}</td>
                  <td className="px-4 py-2.5 text-gray-700">{row.menuItemName}</td>
                  <td className="px-4 py-2.5 text-gray-600">{formatDate(row.orderDate)}</td>
                  <td className="px-4 py-2.5 text-gray-600">{formatDateTime(row.cancelledAt)}</td>
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
