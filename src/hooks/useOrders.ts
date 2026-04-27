import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { OrderFilters, PlaceOrderData } from '@/types/order.types'
import {
  getOrders,
  placeOrder,
  cancelOrder,
  rejectOrder,
} from '@/services/orders.service'
import { getApiErrorMessage } from '@/lib/api-errors'

export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
  })
}

export function usePlaceOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: PlaceOrderData) => placeOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order cancelled.')
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to cancel order')),
  })
}

export function useRejectOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectOrder(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order rejected. Employee has been notified.')
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to reject order')),
  })
}
