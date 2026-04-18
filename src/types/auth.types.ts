export interface User {
  id: string
  email: string
  name: string
  role: 'company-admin'
  companyId: string
  companyName: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
