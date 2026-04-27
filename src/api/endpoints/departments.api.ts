import { apiClient } from '../client'
import { unwrap, unwrapList, type ListResult } from '../unwrap'

export type ApiEntityStatus = 'active' | 'inactive'

export interface ApiDepartment {
  id: string
  name: string
  contactPerson: string | null
  contactPhone: string | null
  buildingNotes: string | null
  companyId: string
  locationId: string
  locationName?: string | null
  status: ApiEntityStatus
  employeeCount: number
  createdAt: string
  updatedAt: string
}

export interface DepartmentListQuery {
  page?: number
  limit?: number
  search?: string
  status?: ApiEntityStatus
  locationId?: string
}

export interface CreateDepartmentBody {
  name: string
  contactPerson?: string
  contactPhone?: string
  buildingNotes?: string
  companyId: string
  locationId: string
}

export type UpdateDepartmentBody = Partial<
  Omit<CreateDepartmentBody, 'companyId'>
>

export interface DepartmentLookupItem {
  id: string
  name: string
}

export const departmentsApi = {
  list: (params: DepartmentListQuery = {}): Promise<ListResult<ApiDepartment>> =>
    apiClient
      .get('/company-admin/departments', { params })
      .then((r) => unwrapList<ApiDepartment>(r)),

  get: (id: string): Promise<ApiDepartment> =>
    apiClient
      .get<ApiDepartment>(`/company-admin/departments/${id}`)
      .then(unwrap<ApiDepartment>),

  create: (body: CreateDepartmentBody): Promise<ApiDepartment> =>
    apiClient
      .post<ApiDepartment>('/company-admin/departments', body)
      .then(unwrap<ApiDepartment>),

  update: (id: string, body: UpdateDepartmentBody): Promise<ApiDepartment> =>
    apiClient
      .patch<ApiDepartment>(`/company-admin/departments/${id}`, body)
      .then(unwrap<ApiDepartment>),

  setStatus: (id: string, status: ApiEntityStatus): Promise<ApiDepartment> =>
    apiClient
      .patch<ApiDepartment>(`/company-admin/departments/${id}/status`, { status })
      .then(unwrap<ApiDepartment>),

  lookup: (params: { search?: string } = {}): Promise<DepartmentLookupItem[]> =>
    apiClient
      .get<DepartmentLookupItem[]>('/company-admin/departments/lookup', { params })
      .then(unwrap<DepartmentLookupItem[]>),
}
