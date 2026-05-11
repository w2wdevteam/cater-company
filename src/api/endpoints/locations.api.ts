import { apiClient } from '../client'
import { unwrap, unwrapList, type ListResult } from '../unwrap'

export type ApiEntityStatus = 'active' | 'inactive'

export interface ApiLocation {
  id: string
  name: string
  address: string
  lat: number | null
  lng: number | null
  contactPerson: string | null
  notes: string | null
  companyId: string
  status: ApiEntityStatus
  isHeadquarter: boolean
  createdAt: string
  updatedAt: string
}

export interface LocationListQuery {
  page?: number
  limit?: number
  search?: string
  status?: ApiEntityStatus
}

export interface CreateLocationBody {
  name: string
  address: string
  lat?: number
  lng?: number
  contactPerson?: string
  notes?: string
  companyId: string
  isHeadquarter?: boolean
}

export type UpdateLocationBody = Partial<Omit<CreateLocationBody, 'companyId'>>

export interface LocationLookupItem {
  id: string
  name: string
}

export const locationsApi = {
  list: (params: LocationListQuery = {}): Promise<ListResult<ApiLocation>> =>
    apiClient
      .get('/company-admin/locations', { params })
      .then((r) => unwrapList<ApiLocation>(r)),

  get: (id: string): Promise<ApiLocation> =>
    apiClient.get<ApiLocation>(`/company-admin/locations/${id}`).then(unwrap<ApiLocation>),

  create: (body: CreateLocationBody): Promise<ApiLocation> =>
    apiClient
      .post<ApiLocation>('/company-admin/locations', body)
      .then(unwrap<ApiLocation>),

  update: (id: string, body: UpdateLocationBody): Promise<ApiLocation> =>
    apiClient
      .patch<ApiLocation>(`/company-admin/locations/${id}`, body)
      .then(unwrap<ApiLocation>),

  setStatus: (id: string, status: ApiEntityStatus): Promise<ApiLocation> =>
    apiClient
      .patch<ApiLocation>(`/company-admin/locations/${id}/status`, { status })
      .then(unwrap<ApiLocation>),

  lookup: (params: { search?: string } = {}): Promise<LocationLookupItem[]> =>
    apiClient
      .get<LocationLookupItem[]>('/company-admin/locations/lookup', { params })
      .then(unwrap<LocationLookupItem[]>),
}
