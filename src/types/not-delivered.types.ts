import type { RequestStatus } from '@/lib/constants'

export interface AffectedOrder {
  id: string
  employeeName: string
  menuItemName: string
}

export interface NotDeliveredRequest {
  id: string
  date: string
  affectedOrderCount: number
  /** Populated only on the detail endpoint; the list endpoint leaves this `undefined`. */
  affectedOrders?: AffectedOrder[]
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
