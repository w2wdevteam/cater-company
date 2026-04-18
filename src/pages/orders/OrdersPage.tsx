import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Plus, Ban, XCircle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import FilterBar from '@/components/common/FilterBar'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import RejectOrderDialog from '@/components/features/orders/RejectOrderDialog'
import { Button } from '@/components/ui/button'
import { useOrders, useCancelOrder, useRejectOrder } from '@/hooks/useOrders'
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus'
import { ORDER_STATUSES, DELIVERY_BLOCKED_STATUSES } from '@/lib/constants'
import type { OrderStatus } from '@/lib/constants'
import { cn, formatDateTime, formatCurrency } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { mockDepartments } from '@/services/employees.service'
import type { Order, OrderFilters } from '@/types/order.types'

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  on_the_way: 'bg-amber-100 text-amber-700',
  arrived: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  not_delivered: 'bg-gray-100 text-gray-700',
}

export default function OrdersPage() {
  usePageTitle('Orders')

  const navigate = useNavigate()
  const [filters, setFilters] = useState<OrderFilters>({})
  const { data, isLoading, isError, refetch } = useOrders(filters)
  const cancelMut = useCancelOrder()
  const rejectMut = useRejectOrder()
  const { data: deliveryData } = useDeliveryStatus()

  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)
  const [rejectTarget, setRejectTarget] = useState<Order | null>(null)

  const deliveryBlocked = deliveryData
    ? DELIVERY_BLOCKED_STATUSES.includes(deliveryData.status)
    : false

  function canCancel(order: Order) {
    return order.status === 'new' && !deliveryBlocked
  }

  function canReject(order: Order) {
    return !['on_the_way', 'arrived', 'delivered', 'rejected'].includes(order.status) && !deliveryBlocked
  }

  const hasActiveFilters = !!(filters.search || filters.department || filters.status || filters.dateFrom || filters.dateTo)

  const columns: ColumnDef<Order, unknown>[] = [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div>
          <span className="font-medium text-gray-900">{row.original.employeeName}</span>
          {row.original.isCompanyLevel && (
            <span className="ml-1.5 inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
              Company
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'menuItemName',
      header: 'Menu Item',
      cell: ({ row }) => (
        <div>
          <div className="text-gray-900">{row.original.menuItemName}</div>
          <div className="text-xs text-gray-500">{formatCurrency(row.original.menuItemPrice)}</div>
        </div>
      ),
    },
    {
      accessorKey: 'departmentName',
      header: 'Department',
      cell: ({ row }) => row.original.departmentName || '—',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date & Time',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{formatDateTime(row.original.createdAt)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
            statusColors[row.original.status],
          )}
        >
          {ORDER_STATUSES[row.original.status]}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => {
        const order = row.original
        const showCancel = canCancel(order)
        const showReject = canReject(order)
        if (!showCancel && !showReject) return null
        return (
          <div className="flex items-center gap-1">
            {showCancel && (
              <button
                onClick={() => setCancelTarget(order)}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Cancel"
                aria-label={`Cancel order for ${order.employeeName}`}
              >
                <Ban className="h-4 w-4" />
              </button>
            )}
            {showReject && (
              <button
                onClick={() => setRejectTarget(order)}
                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                title="Reject"
                aria-label={`Reject order for ${order.employeeName}`}
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader
        title="Orders"
        actions={
          <Button onClick={() => navigate('/orders/create')}>
            <Plus className="h-4 w-4" />
            Place Order
          </Button>
        }
      />

      <FilterBar
        search={filters.search}
        onSearchChange={(v) => setFilters((f) => ({ ...f, search: v, page: 1 }))}
        searchPlaceholder="Search by employee name…"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => setFilters({})}
        filters={
          <>
            <DatePicker
              value={filters.dateFrom}
              onChange={(v) => setFilters((f) => ({ ...f, dateFrom: v || undefined, page: 1 }))}
              placeholder="From date"
            />
            <DatePicker
              value={filters.dateTo}
              onChange={(v) => setFilters((f) => ({ ...f, dateTo: v || undefined, page: 1 }))}
              placeholder="To date"
            />
            <Select
              value={filters.department ?? '_all'}
              onValueChange={(v) => setFilters((f) => ({ ...f, department: v === '_all' ? undefined : v, page: 1 }))}
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
            <Select
              value={filters.status ?? '_all'}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v === '_all' ? undefined : v, page: 1 }))}
            >
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Statuses</SelectItem>
                {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load orders." onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          loading={isLoading}
          total={data?.total}
          page={data?.page}
          limit={data?.limit}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          emptyState={
            <EmptyState
              title="No orders found"
              description="No orders match your current filters."
            />
          }
        />
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => { if (!open) setCancelTarget(null) }}
        title="Cancel Order"
        description="Cancel this order? This cannot be undone."
        confirmLabel="Cancel Order"
        destructive
        loading={cancelMut.isPending}
        onConfirm={() => {
          if (cancelTarget) {
            cancelMut.mutate(cancelTarget.id, { onSuccess: () => setCancelTarget(null) })
          }
        }}
      />

      <RejectOrderDialog
        open={!!rejectTarget}
        onOpenChange={(open) => { if (!open) setRejectTarget(null) }}
        order={rejectTarget}
        loading={rejectMut.isPending}
        onConfirm={(reason) => {
          if (rejectTarget) {
            rejectMut.mutate(
              { id: rejectTarget.id, reason },
              { onSuccess: () => setRejectTarget(null) },
            )
          }
        }}
      />
    </>
  )
}
