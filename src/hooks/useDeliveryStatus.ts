import { useQuery } from '@tanstack/react-query'
import { getDeliveryStatus } from '@/services/dashboard.service'

export function useDeliveryStatus() {
  return useQuery({
    queryKey: ['deliveryStatus'],
    queryFn: getDeliveryStatus,
    refetchInterval: 60_000,
  })
}
