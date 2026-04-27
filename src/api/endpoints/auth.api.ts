import { apiClient } from '../client'
import { unwrap } from '../unwrap'

export type ApiUserRole = 'company_admin'

export interface ApiProfile {
  id: string
  fullName: string
  phone: string
  email: string | null
  role: ApiUserRole
  status: 'active' | 'inactive'
  cateringId: string
  cateringName: string
  companyId: string
  companyName: string
  lastLogin: string | null
}

export interface ApiLoginResponse {
  accessToken: string
  refreshToken: string
  admin: ApiProfile
}

export interface LoginBody {
  phone: string
  password: string
}

export interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const authApi = {
  login: (body: LoginBody) =>
    apiClient
      .post<ApiLoginResponse>('/company-admin/auth/login', body)
      .then(unwrap<ApiLoginResponse>),

  refresh: (refreshToken: string) =>
    apiClient
      .post<{ accessToken: string; refreshToken: string }>('/company-admin/auth/refresh', {
        refreshToken,
      })
      .then(unwrap<{ accessToken: string; refreshToken: string }>),

  changePassword: (body: ChangePasswordBody) =>
    apiClient
      .patch<{ message: string }>('/company-admin/auth/change-password', body)
      .then(unwrap<{ message: string }>),

  profile: () =>
    apiClient.get<ApiProfile>('/company-admin/account/profile').then(unwrap<ApiProfile>),
}
