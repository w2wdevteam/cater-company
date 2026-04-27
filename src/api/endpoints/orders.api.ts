import { apiClient } from '../client'
import { unwrap, unwrapList, type ListResult } from '../unwrap'

export type ApiOrderStatus =
  | 'new'
  | 'on_the_way'
  | 'arrived'
  | 'delivered'
  | 'cancelled'
  | 'rejected'
  | 'not_delivered'

export interface ApiOrder {
  id: string
  date: string
  status: ApiOrderStatus
  placedVia: 'bot' | 'company_admin' | 'cater_admin' | 'cater_admin_client'
  isCompanyLevel: boolean
  unitPrice: number
  quantity: number
  rejectionReason: string | null
  employeeId: string | null
  employeeName: string | null
  menuItemId: string
  menuItemName: string
  companyId: string | null
  companyName: string | null
  departmentId: string | null
  departmentName: string | null
  locationId: string | null
  cateringId: string
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderListQuery {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  search?: string
  date?: string
  dateFrom?: string
  dateTo?: string
  departmentId?: string
  menuItemId?: string
  status?: ApiOrderStatus
}

export interface CreateOrderBody {
  companyId: string
  menuItemId: string
  employeeId?: string
  date?: string
  isCompanyLevel?: boolean
  quantity?: number
}

export interface RejectOrderBody {
  rejectionReason?: string
}

export interface TodayStatusResponse {
  date: string
  cutoffTime: string | null
  cutoffPassed: boolean
  deliveryStatus: 'idle' | 'on_the_way' | 'arrived' | 'delivered'
  ordered: Array<{
    employeeId: string
    employeeName: string
    menuItemName: string
    orderId: string
  }>
  notOrdered: Array<{
    employeeId: string
    employeeName: string
    departmentName: string | null
  }>
}

export const ordersApi = {
  list: (params: OrderListQuery = {}): Promise<ListResult<ApiOrder>> =>
    apiClient.get('/company-admin/orders', { params }).then((r) => unwrapList<ApiOrder>(r)),

  get: (id: string): Promise<ApiOrder> =>
    apiClient.get<ApiOrder>(`/company-admin/orders/${id}`).then(unwrap<ApiOrder>),

  create: (body: CreateOrderBody): Promise<ApiOrder> =>
    apiClient.post<ApiOrder>('/company-admin/orders', body).then(unwrap<ApiOrder>),

  cancel: (id: string): Promise<ApiOrder> =>
    apiClient.patch<ApiOrder>(`/company-admin/orders/${id}/cancel`, {}).then(unwrap<ApiOrder>),

  reject: (id: string, body: RejectOrderBody = {}): Promise<ApiOrder> =>
    apiClient.patch<ApiOrder>(`/company-admin/orders/${id}/reject`, body).then(unwrap<ApiOrder>),

  todayStatus: (): Promise<TodayStatusResponse> =>
    apiClient
      .get<TodayStatusResponse>('/company-admin/orders/today-status')
      .then(unwrap<TodayStatusResponse>),
}
