import { useQuery } from '@tanstack/react-query'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'
import { REQUEST_STATUSES } from '@/lib/constants'
import type { RequestStatus } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import { getNotDeliveredRequest } from '@/services/not-delivered.service'
import type { NotDeliveredRequest } from '@/types/not-delivered.types'

const statusColors: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

interface NotDeliveredDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: NotDeliveredRequest | null
}

export default function NotDeliveredDetailSheet({
  open,
  onOpenChange,
  request,
}: NotDeliveredDetailSheetProps) {
  // List endpoint only returns summary — the list-item `request` has no
  // `affectedOrders`. Fetch the full detail when the sheet opens.
  const { data: detail, isLoading } = useQuery({
    queryKey: ['notDeliveredRequest', request?.id],
    queryFn: () => getNotDeliveredRequest(request!.id),
    enabled: open && !!request,
  })

  if (!request) return null

  const view = detail ?? request
  const affectedOrders = view.affectedOrders ?? []

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l bg-white shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Request Details
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-sm text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(view.date)}</p>
                </div>
                <span
                  className={cn(
                    'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                    statusColors[view.status],
                  )}
                >
                  {REQUEST_STATUSES[view.status]}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Affected Orders ({view.affectedOrderCount})
                </p>
                <div className="mt-2 divide-y rounded-md border">
                  {isLoading && !detail ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading orders…
                    </div>
                  ) : affectedOrders.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">No order details available.</div>
                  ) : (
                    affectedOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="font-medium text-gray-900">{order.employeeName}</span>
                        <span className="text-gray-500">{order.menuItemName}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {view.note && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Your Note</p>
                  <p className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    {view.note}
                  </p>
                </div>
              )}

              {view.responseNote && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Catering Company Response</p>
                  <p className={cn(
                    'mt-1 rounded-md px-3 py-2 text-sm',
                    view.status === 'approved'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700',
                  )}>
                    {view.responseNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
