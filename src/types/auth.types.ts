export interface User {
  id: string
  phone: string
  name: string
  role: 'company-admin'
  companyId: string
  companyName: string
}

export interface LoginCredentials {
  phone: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
