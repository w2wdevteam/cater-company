import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageHeader from '@/components/common/PageHeader'
import ExportButtons from '@/components/common/ExportButtons'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cn, formatCurrency } from '@/lib/utils'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { getWeeklyReport } from '@/services/reports.service'
import { mockDepartments } from '@/services/employees.service'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default function WeeklyReportPage() {
  usePageTitle('Weekly Report')

  const [department, setDepartment] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', 'weekly', department],
    queryFn: () => getWeeklyReport({ department: department || undefined }),
  })

  return (
    <>
      <PageHeader title="Weekly Report" actions={<ExportButtons />} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select
          value={department || '_all'}
          onValueChange={(v) => setDepartment(v === '_all' ? '' : v)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Departments</SelectItem>
            {mockDepartments.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <ErrorBanner message="Failed to load weekly report." onRetry={refetch} />
      ) : (
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-600">Employee</th>
              {DAYS.map((d) => (
                <th key={d} className="px-3 py-2.5 text-center font-medium text-gray-600">{d}</th>
              ))}
              <th className="px-4 py-2.5 text-right font-medium text-gray-600">Orders</th>
              <th className="px-4 py-2.5 text-right font-medium text-gray-600">Cost</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={8} className="px-4 py-3">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : (
              data?.map((row) => (
                <tr key={row.employeeName} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-gray-900">{row.employeeName}</div>
                    <div className="text-xs text-gray-500">{row.departmentName}</div>
                  </td>
                  {DAYS.map((day) => {
                    const cell = row.days[day]
                    return (
                      <td key={day} className="px-3 py-2.5 text-center">
                        {cell ? (
                          <span className={cn('text-xs', cell.notDelivered ? 'text-gray-400' : 'text-gray-700')}>
                            {cell.menuItemName}
                            {cell.notDelivered && <span className="ml-0.5 text-red-400">(ND)</span>}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="px-4 py-2.5 text-right text-gray-700">{row.totalOrders}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(row.totalCost)}</td>
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
