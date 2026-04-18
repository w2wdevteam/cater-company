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
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '@/services/locations.service'
import type { Location, LocationFormData } from '@/types/common.types'
import LocationSheet from './LocationSheet'

export default function LocationsPage() {
  usePageTitle('Locations')

  const qc = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  })

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editLoc, setEditLoc] = useState<Location | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null)

  const createMut = useMutation({
    mutationFn: (d: LocationFormData) => createLocation(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      toast.success('Location created')
      setSheetOpen(false)
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data: d }: { id: string; data: LocationFormData }) =>
      updateLocation(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      toast.success('Location updated')
      setSheetOpen(false)
    },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      toast.success('Location deleted')
      setDeleteTarget(null)
    },
  })

  function handleCreate() {
    setEditLoc(null)
    setSheetOpen(true)
  }

  function handleEdit(loc: Location) {
    setEditLoc(loc)
    setSheetOpen(true)
  }

  function handleSubmit(values: LocationFormData) {
    if (editLoc) {
      updateMut.mutate({ id: editLoc.id, data: values })
    } else {
      createMut.mutate(values)
    }
  }

  const columns: ColumnDef<Location, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Location Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    { accessorKey: 'address', header: 'Address' },
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
        title="Delivery Locations"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load locations." onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={isLoading}
          emptyState={
            <EmptyState
              title="No locations yet"
              description="No delivery locations have been added yet."
            />
          }
        />
      )}

      <LocationSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        location={editLoc}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete Location"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteMut.isPending}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
      />
    </>
  )
}
