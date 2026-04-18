import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Order } from '@/types/order.types'

interface RejectOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  loading?: boolean
  onConfirm: (reason?: string) => void
}

export default function RejectOrderDialog({
  open,
  onOpenChange,
  order,
  loading = false,
  onConfirm,
}: RejectOrderDialogProps) {
  const [reason, setReason] = useState('')

  function handleConfirm() {
    onConfirm(reason.trim() || undefined)
    setReason('')
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="text-base font-semibold text-gray-900">
            Reject Order
          </Dialog.Title>

          {order && (
            <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium">{order.employeeName}</span>
              {' — '}
              {order.menuItemName}
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Reason <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Will be sent to the employee…"
              rows={3}
              className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
              {loading ? 'Rejecting…' : 'Reject Order'}
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
