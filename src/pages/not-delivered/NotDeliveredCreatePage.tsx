import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import { cn, formatDate } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'
import { useCreateNotDeliveredRequest } from '@/hooks/useNotDelivered'
import { getOrders } from '@/services/orders.service'
import type { Order } from '@/types/order.types'

const steps = ['Select Date', 'Select Orders', 'Review & Submit']

export default function NotDeliveredCreatePage() {
  usePageTitle('New Request')

  const navigate = useNavigate()
  const createMut = useCreateNotDeliveredRequest()

  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'byDate', selectedDate],
    queryFn: () => getOrders({ dateFrom: selectedDate, dateTo: selectedDate, limit: 100 }),
    enabled: !!selectedDate && step >= 1,
  })

  const orders = ordersData?.data ?? []

  function toggleOrder(id: string) {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selectedOrderIds.size === orders.length) {
      setSelectedOrderIds(new Set())
    } else {
      setSelectedOrderIds(new Set(orders.map((o) => o.id)))
    }
  }

  const selectedOrders = orders.filter((o) => selectedOrderIds.has(o.id))

  function handleSubmit() {
    createMut.mutate(
      { date: selectedDate, orderIds: Array.from(selectedOrderIds), note: note.trim() || undefined },
      { onSuccess: () => navigate('/not-delivered') },
    )
  }

  return (
    <>
      <PageHeader
        title="New Not Delivered Request"
        actions={
          <Button variant="ghost" onClick={() => navigate('/not-delivered')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                i < step
                  ? 'bg-green-100 text-green-700'
                  : i === step
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-400',
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                i === step ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className="mx-2 h-px w-8 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="max-w-md space-y-4">
          <div>
            <Label>Select Date</Label>
            <DatePicker
              value={selectedDate}
              onChange={(v) => setSelectedDate(v)}
              className="mt-1.5"
            />
          </div>
          <Button
            disabled={!selectedDate}
            onClick={() => setStep(1)}
          >
            Next
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select orders from <span className="font-medium">{formatDate(selectedDate)}</span> that were not delivered.
          </p>

          {ordersLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-md bg-gray-100" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-md border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              No orders found for this date.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2.5 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.size === orders.length && orders.length > 0}
                        onChange={toggleAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600">Employee</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600">Menu Item</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: Order) => (
                    <tr
                      key={order.id}
                      className={cn(
                        'border-b last:border-0 cursor-pointer hover:bg-gray-50',
                        selectedOrderIds.has(order.id) && 'bg-primary-50',
                      )}
                      onClick={() => toggleOrder(order.id)}
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.has(order.id)}
                          onChange={(e) => { e.stopPropagation(); toggleOrder(order.id) }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-medium text-gray-900">{order.employeeName}</td>
                      <td className="px-4 py-2.5 text-gray-700">{order.menuItemName}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {ORDER_STATUSES[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
            <Button
              disabled={selectedOrderIds.size === 0}
              onClick={() => setStep(2)}
            >
              Next ({selectedOrderIds.size} selected)
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-lg space-y-6">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-900">{formatDate(selectedDate)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Selected Orders ({selectedOrders.length})
            </p>
            <div className="mt-2 divide-y rounded-md border">
              {selectedOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="font-medium text-gray-900">{order.employeeName}</span>
                  <span className="text-gray-500">{order.menuItemName}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Note for the catering company <span className="font-normal text-gray-400">(optional)</span></Label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Describe what happened…"
              className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button
              onClick={handleSubmit}
              disabled={createMut.isPending}
            >
              {createMut.isPending ? 'Submitting…' : 'Submit Request'}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
