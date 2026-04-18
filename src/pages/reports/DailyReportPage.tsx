import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Building2, UtensilsCrossed, MapPin } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import ExportButtons from '@/components/common/ExportButtons'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cn, formatCurrency } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { getDailyReport, getDailyReportByMenu, getDailyReportByLocation } from '@/services/reports.service'
import { mockDepartments } from '@/services/employees.service'
import type { DailyReportDepartment, DailyReportMenuGroup, DailyReportLocationGroup } from '@/types/report.types'

type ViewMode = 'department' | 'menu' | 'location'

const views: { key: ViewMode; label: string; icon: typeof Building2 }[] = [
  { key: 'department', label: 'By Department', icon: Building2 },
  { key: 'menu', label: 'By Menu', icon: UtensilsCrossed },
  { key: 'location', label: 'By Location', icon: MapPin },
]

export default function DailyReportPage() {
  usePageTitle('Daily Report')

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [department, setDepartment] = useState('')
  const [view, setView] = useState<ViewMode>('department')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const deptQuery = useQuery({
    queryKey: ['report', 'daily', 'dept', date, department],
    queryFn: () => getDailyReport({ date, department: department || undefined }),
    enabled: view === 'department',
  })

  const menuQuery = useQuery({
    queryKey: ['report', 'daily', 'menu', date, department],
    queryFn: () => getDailyReportByMenu({ date, department: department || undefined }),
    enabled: view === 'menu',
  })

  const locQuery = useQuery({
    queryKey: ['report', 'daily', 'location', date],
    queryFn: () => getDailyReportByLocation({ date }),
    enabled: view === 'location',
  })

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const isLoading =
    (view === 'department' && deptQuery.isLoading) ||
    (view === 'menu' && menuQuery.isLoading) ||
    (view === 'location' && locQuery.isLoading)

  const isError =
    (view === 'department' && deptQuery.isError) ||
    (view === 'menu' && menuQuery.isError) ||
    (view === 'location' && locQuery.isError)

  const refetch =
    view === 'department' ? deptQuery.refetch :
    view === 'menu' ? menuQuery.refetch :
    locQuery.refetch

  return (
    <>
      <PageHeader title="Daily Report" actions={<ExportButtons />} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <DatePicker
          value={date}
          onChange={(v) => { setDate(v); setExpanded(new Set()) }}
        />
        {view !== 'location' && (
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
        )}
      </div>

      <div className="mb-5 inline-flex rounded-lg border bg-gray-50 p-1">
        {views.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setView(key); setExpanded(new Set()) }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              view === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {isError ? (
        <ErrorBanner message="Failed to load report data." onRetry={refetch} />
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : view === 'department' ? (
        <DepartmentView data={deptQuery.data ?? []} expanded={expanded} onToggle={toggleExpand} />
      ) : view === 'menu' ? (
        <MenuView data={menuQuery.data ?? []} expanded={expanded} onToggle={toggleExpand} />
      ) : (
        <LocationView data={locQuery.data ?? []} expanded={expanded} onToggle={toggleExpand} />
      )}
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <tbody>
          {Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="border-b">
              <td colSpan={4} className="px-4 py-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ExpandIcon({ open }: { open: boolean }) {
  return open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
}

function DepartmentView({
  data,
  expanded,
  onToggle,
}: {
  data: DailyReportDepartment[]
  expanded: Set<string>
  onToggle: (key: string) => void
}) {
  const totalOrders = data.reduce((s, d) => s + d.orderCount, 0)
  const totalCost = data.reduce((s, d) => s + d.costTotal, 0)

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="w-10 px-4 py-2.5" />
            <th className="px-4 py-2.5 text-left font-medium text-gray-600">Department</th>
            <th className="px-4 py-2.5 text-right font-medium text-gray-600">Orders</th>
            <th className="px-4 py-2.5 text-right font-medium text-gray-600">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dept) => {
            const isOpen = expanded.has(dept.departmentName)
            return (
              <DeptRows key={dept.departmentName} dept={dept} isOpen={isOpen} onToggle={() => onToggle(dept.departmentName)} />
            )
          })}
          <tr className="border-t-2 bg-gray-50 font-semibold">
            <td className="px-4 py-2.5" />
            <td className="px-4 py-2.5 text-gray-900">Total</td>
            <td className="px-4 py-2.5 text-right text-gray-900">{totalOrders}</td>
            <td className="px-4 py-2.5 text-right text-gray-900">{formatCurrency(totalCost)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function DeptRows({ dept, isOpen, onToggle }: { dept: DailyReportDepartment; isOpen: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="border-b cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <td className="px-4 py-2.5 text-gray-400"><ExpandIcon open={isOpen} /></td>
        <td className="px-4 py-2.5 font-medium text-gray-900">{dept.departmentName}</td>
        <td className="px-4 py-2.5 text-right text-gray-700">{dept.orderCount}</td>
        <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(dept.costTotal)}</td>
      </tr>
      {isOpen && dept.employees.map((emp, i) => (
        <tr key={i} className={cn('border-b bg-gray-50/50', emp.notDelivered && 'text-gray-400')}>
          <td className="px-4 py-2" />
          <td className="px-4 py-2 pl-10">
            {emp.employeeName}
            <span className="mx-2 text-gray-300">·</span>
            <span className="text-gray-500">{emp.menuItemName}</span>
            {emp.notDelivered && <span className="ml-2 text-xs text-red-400">(not delivered)</span>}
          </td>
          <td className="px-4 py-2 text-right" />
          <td className={cn('px-4 py-2 text-right', emp.notDelivered && 'line-through')}>{formatCurrency(emp.cost)}</td>
        </tr>
      ))}
    </>
  )
}

function MenuView({
  data,
  expanded,
  onToggle,
}: {
  data: DailyReportMenuGroup[]
  expanded: Set<string>
  onToggle: (key: string) => void
}) {
  const totalOrders = data.reduce((s, d) => s + d.orderCount, 0)
  const totalCost = data.reduce((s, d) => s + d.costTotal, 0)

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="w-10 px-4 py-2.5" />
            <th className="px-4 py-2.5 text-left font-medium text-gray-600">Menu Item</th>
            <th className="px-4 py-2.5 text-right font-medium text-gray-600">Price</th>
            <th className="px-4 py-2.5 text-right font-medium text-gray-600">Orders</th>
            <th className="px-4 py-2.5 text-right font-medium text-gray-600">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isOpen = expanded.has(item.menuItemName)
            return (
              <MenuRows key={item.menuItemName} item={item} isOpen={isOpen} onToggle={() => onToggle(item.menuItemName)} />
            )
          })}
          <tr className="border-t-2 bg-gray-50 font-semibold">
            <td className="px-4 py-2.5" />
            <td className="px-4 py-2.5 text-gray-900">Total</td>
            <td className="px-4 py-2.5" />
            <td className="px-4 py-2.5 text-right text-gray-900">{totalOrders}</td>
            <td className="px-4 py-2.5 text-right text-gray-900">{formatCurrency(totalCost)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function MenuRows({ item, isOpen, onToggle }: { item: DailyReportMenuGroup; isOpen: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="border-b cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <td className="px-4 py-2.5 text-gray-400"><ExpandIcon open={isOpen} /></td>
        <td className="px-4 py-2.5 font-medium text-gray-900">{item.menuItemName}</td>
        <td className="px-4 py-2.5 text-right text-gray-500">{formatCurrency(item.price)}</td>
        <td className="px-4 py-2.5 text-right text-gray-700">{item.orderCount}</td>
        <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(item.costTotal)}</td>
      </tr>
      {isOpen && item.employees.map((emp, i) => (
        <tr key={i} className={cn('border-b bg-gray-50/50', emp.notDelivered && 'text-gray-400')}>
          <td className="px-4 py-2" />
          <td className="px-4 py-2 pl-10" colSpan={2}>
            {emp.employeeName}
            <span className="mx-2 text-gray-300">·</span>
            <span className="text-gray-500">{emp.departmentName}</span>
            {emp.notDelivered && <span className="ml-2 text-xs text-red-400">(not delivered)</span>}
          </td>
          <td className="px-4 py-2" />
          <td className="px-4 py-2" />
        </tr>
      ))}
    </>
  )
}

function LocationView({
  data,
  expanded,
  onToggle,
}: {
  data: DailyReportLocationGroup[]
  expanded: Set<string>
  onToggle: (key: string) => void
}) {
  const totalOrders = data.reduce((s, g) => s + g.orderCount, 0)
  const totalCost = data.reduce((s, g) => s + g.costTotal, 0)

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="w-10 px-4 py-2.5" />
            <th className="px-4 py-2.5 text-left font-medium text-gray-600">Location / Department</th>
            <th className="px-4 py-2.5 text-right font-medium text-gray-600">Orders</th>
            <th className="px-4 py-2.5 text-right font-medium text-gray-600">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.map((loc) => {
            const isOpen = expanded.has(loc.locationName)
            return (
              <LocationRows key={loc.locationName} loc={loc} isOpen={isOpen} onToggle={onToggle} expanded={expanded} />
            )
          })}
          <tr className="border-t-2 bg-gray-50 font-semibold">
            <td className="px-4 py-2.5" />
            <td className="px-4 py-2.5 text-gray-900">Total</td>
            <td className="px-4 py-2.5 text-right text-gray-900">{totalOrders}</td>
            <td className="px-4 py-2.5 text-right text-gray-900">{formatCurrency(totalCost)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function LocationRows({
  loc,
  isOpen,
  onToggle,
  expanded,
}: {
  loc: DailyReportLocationGroup
  isOpen: boolean
  onToggle: (key: string) => void
  expanded: Set<string>
}) {
  return (
    <>
      <tr className="border-b cursor-pointer hover:bg-gray-50" onClick={() => onToggle(loc.locationName)}>
        <td className="px-4 py-2.5 text-gray-400"><ExpandIcon open={isOpen} /></td>
        <td className="px-4 py-2.5 font-medium text-gray-900">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {loc.locationName}
          </span>
        </td>
        <td className="px-4 py-2.5 text-right text-gray-700">{loc.orderCount}</td>
        <td className="px-4 py-2.5 text-right text-gray-700">{formatCurrency(loc.costTotal)}</td>
      </tr>
      {isOpen && loc.departments.map((dept) => {
        const deptKey = `${loc.locationName}::${dept.departmentName}`
        const deptOpen = expanded.has(deptKey)
        return (
          <DeptInLocationRows key={deptKey} dept={dept} deptKey={deptKey} isOpen={deptOpen} onToggle={onToggle} />
        )
      })}
    </>
  )
}

function DeptInLocationRows({
  dept,
  deptKey,
  isOpen,
  onToggle,
}: {
  dept: DailyReportLocationGroup['departments'][number]
  deptKey: string
  isOpen: boolean
  onToggle: (key: string) => void
}) {
  return (
    <>
      <tr className="border-b cursor-pointer bg-gray-50/50 hover:bg-gray-100/50" onClick={() => onToggle(deptKey)}>
        <td className="px-4 py-2 pl-8 text-gray-400"><ExpandIcon open={isOpen} /></td>
        <td className="px-4 py-2 pl-12 font-medium text-gray-700">{dept.departmentName}</td>
        <td className="px-4 py-2 text-right text-gray-600">{dept.orderCount}</td>
        <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(dept.costTotal)}</td>
      </tr>
      {isOpen && dept.employees.map((emp, i) => (
        <tr key={i} className={cn('border-b bg-gray-50/30', emp.notDelivered && 'text-gray-400')}>
          <td className="px-4 py-1.5" />
          <td className="px-4 py-1.5 pl-20">
            {emp.employeeName}
            <span className="mx-2 text-gray-300">·</span>
            <span className="text-gray-500">{emp.menuItemName}</span>
            {emp.notDelivered && <span className="ml-2 text-xs text-red-400">(not delivered)</span>}
          </td>
          <td className="px-4 py-1.5" />
          <td className={cn('px-4 py-1.5 text-right', emp.notDelivered && 'line-through')}>{formatCurrency(emp.cost)}</td>
        </tr>
      ))}
    </>
  )
}
