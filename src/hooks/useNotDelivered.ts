import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { NotDeliveredCreateData } from '@/types/not-delivered.types'
import {
  getNotDeliveredRequests,
  createNotDeliveredRequest,
} from '@/services/not-delivered.service'

export function useNotDeliveredRequests() {
  return useQuery({
    queryKey: ['notDeliveredRequests'],
    queryFn: getNotDeliveredRequests,
  })
}

export function useCreateNotDeliveredRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: NotDeliveredCreateData) => createNotDeliveredRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notDeliveredRequests'] })
      toast.success('Request submitted. Status: Pending.')
    },
  })
}
