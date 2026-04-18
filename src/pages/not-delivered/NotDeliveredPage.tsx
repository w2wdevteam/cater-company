import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Plus, Eye, AlertTriangle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import EmptyState from '@/components/common/EmptyState'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import NotDeliveredDetailSheet from '@/components/features/not-delivered/NotDeliveredDetailSheet'
import { Button } from '@/components/ui/button'
import { useNotDeliveredRequests } from '@/hooks/useNotDelivered'
import { REQUEST_STATUSES } from '@/lib/constants'
import type { RequestStatus } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import type { NotDeliveredRequest } from '@/types/not-delivered.types'

const statusColors: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function NotDeliveredPage() {
  usePageTitle('Not Delivered Requests')

  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useNotDeliveredRequests()
  const [viewTarget, setViewTarget] = useState<NotDeliveredRequest | null>(null)

  const columns: ColumnDef<NotDeliveredRequest, unknown>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{formatDate(row.original.date)}</span>
      ),
    },
    {
      id: 'affectedOrders',
      header: 'Affected Orders',
      cell: ({ row }) => (
        <span className="text-gray-700">
          {row.original.affectedOrders.length} order{row.original.affectedOrders.length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      accessorKey: 'note',
      header: 'Note',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.note
            ? row.original.note.length > 60
              ? row.original.note.slice(0, 60) + '…'
              : row.original.note
            : '—'}
        </span>
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
          {REQUEST_STATUSES[row.original.status]}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => setViewTarget(row.original)}
          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="View"
          aria-label="View request details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Not Delivered Requests"
        actions={
          <Button onClick={() => navigate('/not-delivered/create')}>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load requests." onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={isLoading}
          emptyState={
            <EmptyState
              icon={AlertTriangle}
              title="No requests yet"
              description="No not-delivered requests have been submitted yet."
            />
          }
        />
      )}

      <NotDeliveredDetailSheet
        open={!!viewTarget}
        onOpenChange={(open) => { if (!open) setViewTarget(null) }}
        request={viewTarget}
      />
    </>
  )
}
