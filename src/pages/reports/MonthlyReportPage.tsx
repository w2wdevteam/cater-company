import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import ExportButtons from '@/components/common/ExportButtons'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency } from '@/lib/utils'
import { MonthPicker } from '@/components/ui/date-picker'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { getMonthlyReport } from '@/services/reports.service'
import { useDepartmentOptions } from '@/hooks/useDepartments'
import type { MonthlyReportRow } from '@/types/report.types'

export default function MonthlyReportPage() {
  usePageTitle('Monthly Report')

  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [department, setDepartment] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const departments = useDepartmentOptions()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', 'monthly', month, department],
    queryFn: () => getMonthlyReport({ month, department: department || undefined }),
  })

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const totalOrders = data?.reduce((s, r) => s + r.orderCount, 0) ?? 0
  const totalCost = data?.reduce((s, r) => s + r.totalCost, 0) ?? 0

  return (
    <>
      <PageHeader title="Monthly Report" actions={<ExportButtons />} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <MonthPicker
          value={month}
          onChange={(v) => { setMonth(v); setExpanded(new Set()) }}
        />
        <Select
          value={department || '_all'}
          onValueChange={(v) => setDepartment(v === '_all' ? '' : v)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <ErrorBanner message="Failed to load monthly report." onRetry={refetch} />
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="w-10 px-4 py-2.5" />
                <th className="px-4 py-2.5 text-left font-medium text-gray-600">Employee</th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-600">Department</th>
                <th className="px-4 py-2.5 text-right font-medium text-gray-600">Orders</th>
                <th className="px-4 py-2.5 text-right font-medium text-gray-600">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {data?.map((row) => (
                    <EmployeeRows
                      key={row.employeeName}
                      row={row}
                      isOpen={expanded.has(row.employeeName)}
                      onToggle={() => toggleExpand(row.employeeName)}
                    />
                  ))}
                  <tr className="border-t-2 bg-gray-50 font-semibold">
                    <td className="px-4 py-2.5" />
                    <td className="px-4 py-2.5 text-gray-900">Total</td>
                    <td className="px-4 py-2.5" />
                    <td className="px-4 py-2.5 text-right text-gray-900">{totalOrders}</td>
                    <td className="px-4 py-2.5 text-right text-gray-900">{formatCurrency(totalCost)}</td>
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

function EmployeeRows({ row, isOpen, onToggle }: { row: MonthlyReportRow; isOpen: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="border-b cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <td className="px-4 py-2.5 text-gray-400">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </td>
        <td className="px-4 py-2.5 font-medium text-gray-900">{row.employeeName}</td>
        <td className="px-4 py-2.5 text-gray-600">{row.departmentName}</td>
        <td className="px-4 py-2.5 text-right text-gray-700">{row.orderCount}</td>
        <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(row.totalCost)}</td>
      </tr>
      {isOpen && row.menuItems.map((item) => (
        <tr key={item.menuItemName} className="border-b bg-gray-100">
          <td className="px-4 py-2" />
          <td className="px-4 py-2 pl-10 text-gray-700" colSpan={2}>{item.menuItemName}</td>
          <td className="px-4 py-2 text-right text-gray-600">{item.orderCount}</td>
          <td className="px-4 py-2" />
        </tr>
      ))}
    </>
  )
}
