import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { ClipboardList } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import FilterBar from '@/components/common/FilterBar'
import EmptyState from '@/components/common/EmptyState'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDateTime } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  getAuditLog,
  AUDIT_ACTION_TYPES,
  type AuditLogEntry,
  type AuditLogFilters,
} from '@/services/settings.service'

export default function AuditLogPage() {
  usePageTitle('Audit Log')

  const [filters, setFilters] = useState<AuditLogFilters>({ limit: 20 })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['auditLog', filters],
    queryFn: () => getAuditLog(filters),
  })

  const hasActiveFilters = !!(filters.from || filters.to || filters.actionType)

  const columns: ColumnDef<AuditLogEntry, unknown>[] = [
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.action}</span>
      ),
    },
    {
      accessorKey: 'targetRecord',
      header: 'Target Record',
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.targetRecord}</span>
      ),
    },
    {
      accessorKey: 'performedBy',
      header: 'Performed By',
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.performedBy}</span>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{formatDateTime(row.original.timestamp)}</span>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Audit Log" />

      <FilterBar
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => setFilters({ limit: 20 })}
        filters={
          <>
            <DatePicker
              value={filters.from}
              onChange={(v) => setFilters((f) => ({ ...f, from: v || undefined, page: 1 }))}
              placeholder="From date"
            />
            <DatePicker
              value={filters.to}
              onChange={(v) => setFilters((f) => ({ ...f, to: v || undefined, page: 1 }))}
              placeholder="To date"
            />
            <Select
              value={filters.actionType ?? '_all'}
              onValueChange={(v) => setFilters((f) => ({ ...f, actionType: v === '_all' ? undefined : v, page: 1 }))}
            >
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Actions</SelectItem>
                {AUDIT_ACTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load audit log." onRetry={refetch} />
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
              icon={ClipboardList}
              title="No actions recorded"
              description="No actions recorded yet."
            />
          }
        />
      )}
    </>
  )
}
