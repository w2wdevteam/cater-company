import type { RequestStatus } from '@/lib/constants'

export interface AffectedOrder {
  id: string
  employeeName: string
  menuItemName: string
}

export interface NotDeliveredRequest {
  id: string
  date: string
  affectedOrders: AffectedOrder[]
  note?: string
  responseNote?: string
  status: RequestStatus
  createdAt: string
}

export interface NotDeliveredCreateData {
  date: string
  orderIds: string[]
  note?: string
}
