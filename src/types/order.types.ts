import type { OrderStatus } from '@/lib/constants'

export interface Order {
  id: string
  employeeId?: string
  employeeName: string
  menuItemId: string
  menuItemName: string
  menuItemPrice: number
  departmentId?: string
  departmentName?: string
  isCompanyLevel: boolean
  status: OrderStatus
  rejectionReason?: string
  createdAt: string
}

export interface OrderFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
  department?: string
  status?: string
  page?: number
  limit?: number
}

export interface OrderListResponse {
  data: Order[]
  total: number
  page: number
  limit: number
}

export interface PlaceOrderData {
  employeeId?: string
  menuItemId: string
  isCompanyLevel: boolean
}
