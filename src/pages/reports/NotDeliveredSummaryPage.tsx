import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageHeader from '@/components/common/PageHeader'
import ExportButtons from '@/components/common/ExportButtons'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { REQUEST_STATUSES } from '@/lib/constants'
import type { RequestStatus } from '@/lib/constants'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import { getNotDeliveredSummary } from '@/services/reports.service'

const statusColors: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function NotDeliveredSummaryPage() {
  usePageTitle('Not Delivered Summary')

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', 'notDeliveredSummary', from, to],
    queryFn: () => getNotDeliveredSummary({ from: from || undefined, to: to || undefined }),
  })

  const totalOrders = data?.reduce((s, r) => s + r.affectedOrders, 0) ?? 0
  const totalValue = data?.reduce((s, r) => s + r.totalValue, 0) ?? 0

  return (
    <>
      <PageHeader title="Not Delivered Summary" actions={<ExportButtons />} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <DatePicker value={from} onChange={(v) => setFrom(v)} placeholder="From date" />
        <span className="text-sm text-gray-400">to</span>
        <DatePicker value={to} onChange={(v) => setTo(v)} placeholder="To date" />
      </div>

      {isError ? (
        <ErrorBanner message="Failed to load not-delivered summary." onRetry={refetch} />
      ) : (
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-2.5 text-right font-medium text-gray-600">Affected Orders</th>
              <th className="px-4 py-2.5 text-right font-medium text-gray-600">Total Value</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={4} className="px-4 py-3"><div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" /></td>
                </tr>
              ))
            ) : (
              <>
                {data?.map((row) => (
                  <tr key={row.date} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{formatDate(row.date)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{row.affectedOrders}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(row.totalValue)}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', statusColors[row.status])}>
                        {REQUEST_STATUSES[row.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 bg-gray-50 font-semibold">
                  <td className="px-4 py-2.5 text-gray-900">Total</td>
                  <td className="px-4 py-2.5 text-right text-gray-900">{totalOrders}</td>
                  <td className="px-4 py-2.5 text-right text-gray-900">{formatCurrency(totalValue)}</td>
                  <td className="px-4 py-2.5" />
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
      )}
    </>
  )
}
