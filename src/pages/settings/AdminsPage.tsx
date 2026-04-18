import { useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, ToggleLeft, ToggleRight, Plus, Shield, ShieldCheck, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import EmptyState from '@/components/common/EmptyState'
import ErrorBanner from '@/components/common/ErrorBanner'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import StatusBadge from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdmins, useCreateAdmin, useUpdateAdmin, useUpdateAdminStatus, useResetAdminPassword } from '@/hooks/useAdmins'
import { cn, formatDateTime } from '@/lib/utils'
import type { Admin, AdminFormData, AdminRole } from '@/types/admin.types'
import AdminSheet from './AdminSheet'
import ResetPasswordDialog from './ResetPasswordDialog'

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
}

const roleStyles: Record<AdminRole, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
}

export default function AdminsPage() {
  usePageTitle('Admins')

  const { data, isLoading, isError, refetch } = useAdmins()
  const createMut = useCreateAdmin()
  const updateMut = useUpdateAdmin()
  const statusMut = useUpdateAdminStatus()
  const resetPwMut = useResetAdminPassword()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null)
  const [toggleTarget, setToggleTarget] = useState<Admin | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [resetPwTarget, setResetPwTarget] = useState<Admin | null>(null)

  function handleCreate() {
    setEditAdmin(null)
    setSheetOpen(true)
  }

  function handleEdit(admin: Admin) {
    setEditAdmin(admin)
    setSheetOpen(true)
  }

  function handleToggleStatus(admin: Admin) {
    setToggleTarget(admin)
    setConfirmOpen(true)
  }

  function handleSubmit(values: AdminFormData) {
    if (editAdmin) {
      updateMut.mutate(
        { id: editAdmin.id, data: values },
        {
          onSuccess: () => {
            toast.success('Admin updated')
            setSheetOpen(false)
          },
        },
      )
    } else {
      createMut.mutate(values, {
        onSuccess: () => {
          toast.success('Admin created')
          setSheetOpen(false)
        },
      })
    }
  }

  function confirmToggle() {
    if (!toggleTarget) return
    const newStatus = toggleTarget.status === 'active' ? 'inactive' : 'active'
    statusMut.mutate(
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

  const columns: ColumnDef<Admin, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <span className="font-medium text-gray-900">{row.original.name}</span>
          <div className="text-xs text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', roleStyles[row.original.role])}>
          {row.original.role === 'super_admin' ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
          {roleLabels[row.original.role]}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'lastLoginAt',
      header: 'Last Login',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.lastLoginAt ? formatDateTime(row.original.lastLoginAt) : 'Never'}
        </span>
      ),
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
            onClick={() => setResetPwTarget(row.original)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Change Password"
            aria-label={`Change password for ${row.original.name}`}
          >
            <KeyRound className="h-4 w-4" />
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
        title="Admins"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Admin
          </Button>
        }
      />

      {isError ? (
        <ErrorBanner message="Failed to load admins." onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          loading={isLoading}
          emptyState={
            <EmptyState
              icon={Shield}
              title="No admins yet"
              description="No admin users have been added yet."
            />
          }
        />
      )}

      <AdminSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        admin={editAdmin}
        onSubmit={handleSubmit}
        loading={createMut.isPending || updateMut.isPending}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          toggleTarget?.status === 'active'
            ? 'Deactivate Admin'
            : 'Reactivate Admin'
        }
        description={
          toggleTarget?.status === 'active'
            ? `This admin will no longer be able to log in. Are you sure you want to deactivate ${toggleTarget?.name}?`
            : `This admin will be able to log in again. Are you sure you want to reactivate ${toggleTarget?.name}?`
        }
        confirmLabel={toggleTarget?.status === 'active' ? 'Deactivate' : 'Reactivate'}
        destructive={toggleTarget?.status === 'active'}
        loading={statusMut.isPending}
        onConfirm={confirmToggle}
      />

      <ResetPasswordDialog
        open={!!resetPwTarget}
        onOpenChange={(open) => { if (!open) setResetPwTarget(null) }}
        adminName={resetPwTarget?.name ?? ''}
        loading={resetPwMut.isPending}
        onConfirm={(newPassword) => {
          if (resetPwTarget) {
            resetPwMut.mutate(
              { id: resetPwTarget.id, newPassword },
              {
                onSuccess: () => {
                  toast.success(`Password updated for ${resetPwTarget.name}`)
                  setResetPwTarget(null)
                },
              },
            )
          }
        }}
      />
    </>
  )
}
