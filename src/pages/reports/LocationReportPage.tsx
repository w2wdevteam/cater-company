import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageHeader from '@/components/common/PageHeader'
import ExportButtons from '@/components/common/ExportButtons'
import { getLocationReport } from '@/services/reports.service'
import { DatePicker } from '@/components/ui/date-picker'

export default function LocationReportPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['report', 'location', from, to],
    queryFn: () => getLocationReport({ from: from || undefined, to: to || undefined }),
  })

  return (
    <>
      <PageHeader title="Location-based Order Report" actions={<ExportButtons />} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <DatePicker value={from} onChange={(v) => setFrom(v)} placeholder="From date" />
        <span className="text-sm text-gray-400">to</span>
        <DatePicker value={to} onChange={(v) => setTo(v)} placeholder="To date" />
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-md border p-4">
              <div className="mb-3 h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-16 animate-pulse rounded bg-gray-100" />
            </div>
          ))
        ) : (
          data?.map((group) => (
            <div key={group.locationName} className="overflow-hidden rounded-md border">
              <div className="border-b bg-gray-50 px-4 py-2.5">
                <h3 className="font-semibold text-gray-900">{group.locationName}</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Department</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Orders</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Menu Breakdown</th>
                  </tr>
                </thead>
                <tbody>
                  {group.departments.map((dept) => (
                    <tr key={dept.departmentName} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{dept.departmentName}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{dept.orderCount}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{dept.menuBreakdown}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </>
  )
}
