import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, parse } from 'date-fns'
import PageHeader from '@/components/common/PageHeader'
import ErrorBanner from '@/components/common/ErrorBanner'
import { MonthPicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDepartmentOptions } from '@/hooks/useDepartments'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency } from '@/lib/utils'
import { getMonthlyReport } from '@/services/reports.service'

export default function MonthlyReportPage() {
  usePageTitle('Monthly Report')

  const [month, setMonth] = useState(() => format(new Date(), 'yyyy-MM'))
  const [department, setDepartment] = useState('')
  const departments = useDepartmentOptions()

  useEffect(() => {
    document.title = 'Monthly Report — Company Admin'
  }, [])

  const { data: rows = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['report', 'monthly', month, department],
    queryFn: () =>
      getMonthlyReport({ month, department: department || undefined }),
  })

  const { grandTotal, grandQty } = useMemo(() => {
    let gt = 0
    let q = 0
    for (const r of rows) {
      gt += r.totalCost
      q += r.orderCount
    }
    return { grandTotal: gt, grandQty: q }
  }, [rows])

  const monthLabel = format(parse(month + '-01', 'yyyy-MM-dd', new Date()), 'MMMM yyyy')

  return (
    <>
      <PageHeader title="Monthly Report" />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <MonthPicker value={month} onChange={setMonth} />
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
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <ErrorBanner message="Failed to load monthly report." onRetry={refetch} />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-3">
            <h3 className="text-sm font-semibold text-gray-900">{monthLabel}</h3>
            <div className="text-xs text-gray-500">
              {rows.length} employee{rows.length === 1 ? '' : 's'} · {grandQty} order
              {grandQty === 1 ? '' : 's'}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 px-6 py-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-gray-100"
                  style={{ width: `${90 - i * 8}%` }}
                />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-500">No orders for this period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="border-r px-4 py-3">Employee</th>
                    <th className="border-r px-4 py-3">Department</th>
                    <th className="border-r px-4 py-3">Menu Item</th>
                    <th className="border-r px-4 py-3 text-right">Qty</th>
                    <th className="border-r px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const items = row.menuItems
                    const span = Math.max(items.length, 1)
                    if (items.length === 0) {
                      // Defensive: backend should not emit an employee with zero
                      // breakdown rows, but if it does, show a single placeholder
                      // row so the rowSpan layout doesn't collapse.
                      return (
                        <tr key={row.employeeId} className="hover:bg-gray-50/60">
                          <td className="border-b border-r px-4 py-3 font-medium text-gray-900">
                            {row.employeeName}
                          </td>
                          <td className="border-b border-r px-4 py-3 text-gray-700">
                            {row.departmentName}
                          </td>
                          <td className="border-b border-r px-4 py-3 text-gray-400" colSpan={3}>
                            No items
                          </td>
                          <td className="border-b px-4 py-3 text-right font-semibold text-gray-900">
                            {formatCurrency(row.totalCost)}
                          </td>
                        </tr>
                      )
                    }
                    return items.map((item, idx) => {
                      const isFirst = idx === 0
                      const isLast = idx === span - 1
                      const rowBorder = isLast ? 'border-b' : ''
                      return (
                        <tr
                          key={`${row.employeeId}-${item.menuItemId}`}
                          className="hover:bg-gray-50/60"
                        >
                          {isFirst && (
                            <td
                              rowSpan={span}
                              className="border-b border-r align-top px-4 py-3 font-medium text-gray-900"
                            >
                              {row.employeeName}
                            </td>
                          )}
                          {isFirst && (
                            <td
                              rowSpan={span}
                              className="border-b border-r align-top px-4 py-3 text-gray-700"
                            >
                              {row.departmentName}
                            </td>
                          )}
                          <td className={`border-r px-4 py-3 text-gray-700 ${rowBorder}`}>
                            {item.menuItemName}
                          </td>
                          <td
                            className={`border-r px-4 py-3 text-right text-gray-700 ${rowBorder}`}
                          >
                            {item.quantity}
                          </td>
                          <td
                            className={`border-r px-4 py-3 text-right text-gray-700 ${rowBorder}`}
                          >
                            {formatCurrency(item.unitPrice)}
                          </td>
                          {isFirst && (
                            <td
                              rowSpan={span}
                              className="border-b align-top px-4 py-3 text-right font-semibold text-gray-900"
                            >
                              {formatCurrency(row.totalCost)}
                            </td>
                          )}
                        </tr>
                      )
                    })
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-3 text-gray-900" colSpan={3}>
                      Total owed to catering
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{grandQty}</td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  )
}
