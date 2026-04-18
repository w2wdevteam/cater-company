import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, ToggleLeft, ToggleRight, Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import FilterBar from '@/components/common/FilterBar'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useEmployees, useUpdateEmployeeStatus } from '@/hooks/useEmployees'
import { mockDepartments } from '@/services/employees.service'
import type { Employee } from '@/types/employee.types'
import EmployeeSheet from './EmployeeSheet'

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toggleTarget, setToggleTarget] = useState<Employee | null>(null)

  const filters = useMemo(
    () => ({ search: search || undefined, department: department || undefined, status: status || undefined, page }),
    [search, department, status, page],
  )

  usePageTitle('Employees')

  const { data, isLoading, isError, refetch } = useEmployees(filters)
  const statusMutation = useUpdateEmployeeStatus()

  const hasActiveFilters = !!(search || department || status)

  function handleClearFilters() {
    setSearch('')
    setDepartment('')
    setStatus('')
    setPage(1)
  }

  function handleEdit(employee: Employee) {
    setEditEmployee(employee)
    setSheetOpen(true)
  }

  function handleCreate() {
    setEditEmployee(null)
    setSheetOpen(true)
  }

  function handleToggleStatus(employee: Employee) {
    setToggleTarget(employee)
    setConfirmOpen(true)
  }

  function confirmToggle() {
    if (!toggleTarget) return
    const newStatus = toggleTarget.status === 'active' ? 'inactive' : 'active'
    statusMutation.mutate(
      { id: toggleTarget.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            newStatus === 'active'
              ? `${toggleTarget.name} reactivated`
              : `${toggleTarget.name} deactivated`,
          )
          setConfirmOpen(false)
          setToggleTarget(null)
        },
      },
    )
  }

  const columns: ColumnDef<Employee, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'departmentName',
      header: 'Department',
      cell: ({ row }) => row.original.departmentName ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row.original)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Edit"
            aria-label={`Edit ${row.original.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(row.original)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title={row.original.status === 'active' ? 'Deactivate' : 'Reactivate'}
            aria-label={row.original.status === 'active' ? `Deactivate ${row.original.name}` : `Reactivate ${row.original.name}`}
          >
            {row.original.status === 'active' ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Employees"
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/employees/import">
                <Upload className="h-4 w-4" />
                Bulk Import
              </Link>
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by name or phone…"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        filters={
          <>
            <Select
              value={department || '_all'}
              onValueChange={(v) => { setDepartment(v === '_all' ? '' : v); setPage(1) }}
            >
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Departments</SelectItem>
                {mockDepartments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status || '_all'}
              onValueChange={(v) => { setStatus(v === '_all' ? '' : v); setPage(1) }}
            >
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load employees." onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          total={data?.total}
          page={page}
          limit={10}
          onPageChange={setPage}
          loading={isLoading}
        />
      )}

      <EmployeeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        employee={editEmployee}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          toggleTarget?.status === 'active'
            ? 'Deactivate Employee'
            : 'Reactivate Employee'
        }
        description={
          toggleTarget?.status === 'active'
            ? `Deactivated employees cannot log in to the Catering Bot. Are you sure you want to deactivate ${toggleTarget?.name}?`
            : `This employee will be able to log in again. Are you sure you want to reactivate ${toggleTarget?.name}?`
        }
        confirmLabel={toggleTarget?.status === 'active' ? 'Deactivate' : 'Reactivate'}
        destructive={toggleTarget?.status === 'active'}
        loading={statusMutation.isPending}
        onConfirm={confirmToggle}
      />
    </>
  )
}
