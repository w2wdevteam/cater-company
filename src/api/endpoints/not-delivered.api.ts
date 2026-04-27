import { apiClient } from '../client'
import { unwrap, unwrapList, type ListResult } from '../unwrap'

export type ApiRequestStatus = 'pending' | 'approved' | 'rejected'

export interface ApiNotDeliveredRequestSummary {
  id: string
  companyId: string
  companyName: string
  status: ApiRequestStatus
  note: string | null
  responseNote: string | null
  affectedOrderCount: number
  submittedAt: string
  resolvedAt: string | null
  submittedByName: string | null
}

export interface ApiFlaggedOrderDetail {
  orderId: string
  employeeName: string | null
  menuItemName: string
  date: string
  status: string
}

export interface ApiNotDeliveredRequestDetail extends ApiNotDeliveredRequestSummary {
  flaggedOrders: ApiFlaggedOrderDetail[]
}

export interface NotDeliveredListQuery {
  page?: number
  limit?: number
  status?: ApiRequestStatus
  dateFrom?: string
  dateTo?: string
}

export interface CreateNotDeliveredBody {
  orderIds: string[]
  note?: string
}

export const notDeliveredApi = {
  list: (
    params: NotDeliveredListQuery = {},
  ): Promise<ListResult<ApiNotDeliveredRequestSummary>> =>
    apiClient
      .get('/company-admin/not-delivered-requests', { params })
      .then((r) => unwrapList<ApiNotDeliveredRequestSummary>(r)),

  get: (id: string): Promise<ApiNotDeliveredRequestDetail> =>
    apiClient
      .get<ApiNotDeliveredRequestDetail>(`/company-admin/not-delivered-requests/${id}`)
      .then(unwrap<ApiNotDeliveredRequestDetail>),

  submit: (body: CreateNotDeliveredBody): Promise<ApiNotDeliveredRequestDetail> =>
    apiClient
      .post<ApiNotDeliveredRequestDetail>('/company-admin/not-delivered-requests', body)
      .then(unwrap<ApiNotDeliveredRequestDetail>),
}
