import { apiClient } from '../client'
import { unwrap, unwrapList, type ListResult } from '../unwrap'

export type ApiEntityStatus = 'active' | 'inactive'

export interface ApiAdmin {
  id: string
  fullName: string
  phone: string
  email: string | null
  role: 'company_admin'
  status: ApiEntityStatus
  companyId: string
  cateringId: string
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminListQuery {
  page?: number
  limit?: number
  search?: string
  status?: ApiEntityStatus
}

export interface CreateAdminBody {
  fullName: string
  phone: string
  email?: string
  password: string
}

export type UpdateAdminBody = Partial<Pick<CreateAdminBody, 'fullName' | 'phone' | 'email'>>

export const adminsApi = {
  list: (params: AdminListQuery = {}): Promise<ListResult<ApiAdmin>> =>
    apiClient.get('/company-admin/admins', { params }).then((r) => unwrapList<ApiAdmin>(r)),

  get: (id: string): Promise<ApiAdmin> =>
    apiClient.get<ApiAdmin>(`/company-admin/admins/${id}`).then(unwrap<ApiAdmin>),

  create: (body: CreateAdminBody): Promise<ApiAdmin> =>
    apiClient.post<ApiAdmin>('/company-admin/admins', body).then(unwrap<ApiAdmin>),

  update: (id: string, body: UpdateAdminBody): Promise<ApiAdmin> =>
    apiClient.patch<ApiAdmin>(`/company-admin/admins/${id}`, body).then(unwrap<ApiAdmin>),

  setStatus: (id: string, status: ApiEntityStatus): Promise<ApiAdmin> =>
    apiClient
      .patch<ApiAdmin>(`/company-admin/admins/${id}/status`, { status })
      .then(unwrap<ApiAdmin>),

  resetPassword: (id: string, newPassword: string): Promise<{ message: string }> =>
    apiClient
      .patch<{ message: string }>(`/company-admin/admins/${id}/password`, { newPassword })
      .then(unwrap<{ message: string }>),
}
