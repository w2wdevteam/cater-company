import { apiClient } from '../client'
import { unwrap } from '../unwrap'

export interface ApiMenuItem {
  menuItemId: string
  name: string
  description: string | null
  price: number
  effectivePrice: number
  imageUrl: string | null
  cap: number | null
  currentOrderCount: number
  remainingCap: number | null
  isSoldOut: boolean
}

export interface ApiMenuDay {
  date: string
  isToday: boolean
  items: ApiMenuItem[]
}

export interface ApiMenuRangeResponse {
  days: ApiMenuDay[]
}

export interface MenuRangeQuery {
  dateFrom?: string
  dateTo?: string
}

export const menusApi = {
  range: (params: MenuRangeQuery = {}): Promise<ApiMenuRangeResponse> =>
    apiClient
      .get<ApiMenuRangeResponse>('/company-admin/menus', { params })
      .then(unwrap<ApiMenuRangeResponse>),
}
