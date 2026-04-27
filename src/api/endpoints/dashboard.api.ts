import { apiClient } from '../client'
import { unwrap } from '../unwrap'

export type DeliveryStatusValue = 'idle' | 'on_the_way' | 'arrived' | 'delivered'

export interface ApiDashboardMenuItem {
  menuItemId: string
  name: string
  price: number
  effectivePrice: number
  imageUrl: string | null
}

export interface ApiDashboardResponse {
  todayOrderCount: number
  employeesNotOrdered: number
  activeEmployeeCount: number
  todayMenu: ApiDashboardMenuItem[]
  deliveryStatus: DeliveryStatusValue
  cutoffTime: string | null
  cutoffStatus: 'open' | 'closed' | 'not_configured'
}

export const dashboardApi = {
  get: () =>
    apiClient
      .get<ApiDashboardResponse>('/company-admin/dashboard')
      .then(unwrap<ApiDashboardResponse>),
}
