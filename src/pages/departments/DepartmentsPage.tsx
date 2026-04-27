import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/button'
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '@/services/departments.service'
import { getApiErrorMessage } from '@/lib/api-errors'
import type { Department, DepartmentFormData } from '@/types/common.types'
import DepartmentSheet from './DepartmentSheet'

export default function DepartmentsPage() {
  usePageTitle('Departments')

  const qc = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  })

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editDept, setEditDept] = useState<Department | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)

  const createMut = useMutation({
    mutationFn: (d: DepartmentFormData) => createDepartment(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department created')
      setSheetOpen(false)
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to create department')),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data: d }: { id: string; data: DepartmentFormData }) =>
      updateDepartment(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department updated')
      setSheetOpen(false)
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update department')),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department deleted')
      setDeleteTarget(null)
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to delete department')),
  })

  function handleCreate() {
    setEditDept(null)
    setSheetOpen(true)
  }

  function handleEdit(dept: Department) {
    setEditDept(dept)
    setSheetOpen(true)
  }

  function handleSubmit(values: DepartmentFormData) {
    const cleaned = {
      ...values,
      location: values.location || undefined,
      contactPerson: values.contactPerson || undefined,
      buildingNotes: values.buildingNotes || undefined,
    }
    if (editDept) {
      updateMut.mutate({ id: editDept.id, data: cleaned })
    } else {
      createMut.mutate(cleaned)
    }
  }

  const columns: ColumnDef<Department, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'contactPerson', header: 'Contact Person' },
    {
      accessorKey: 'buildingNotes',
      header: 'Building / Floor',
      cell: ({ row }) => row.original.buildingNotes ?? '—',
    },
    {
      accessorKey: 'employeeCount',
      header: 'Employees',
      cell: ({ row }) => row.original.employeeCount,
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
            onClick={() => setDeleteTarget(row.original)}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
            title="Delete"
            aria-label={`Delete ${row.original.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Departments"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load departments." onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={isLoading}
          emptyState={
            <EmptyState
              title="No departments yet"
              description="No departments have been added to your company yet."
            />
          }
        />
      )}

      <DepartmentSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        department={editDept}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Employees in this department will be unassigned.`}
        confirmLabel="Delete"
        destructive
        loading={deleteMut.isPending}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
      />
    </>
  )
}
