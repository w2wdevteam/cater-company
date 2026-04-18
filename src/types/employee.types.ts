import type { EmployeeStatus } from '@/lib/constants'

export interface Employee {
  id: string
  name: string
  phone: string
  email?: string
  employeeId?: string
  departmentId?: string
  departmentName?: string
  role?: string
  location?: string
  status: EmployeeStatus
  createdAt: string
  updatedAt: string
}

export interface EmployeeFormData {
  name: string
  phone: string
  email?: string
  employeeId?: string
  departmentId?: string
  role?: string
  location?: string
}

export interface EmployeeFilters {
  search?: string
  department?: string
  status?: string
  page?: number
  limit?: number
}

export interface EmployeeListResponse {
  data: Employee[]
  total: number
  page: number
  limit: number
}

export interface EmployeeImportRow {
  name: string
  phone: string
  department?: string
}

export interface EmployeeImportError {
  row: number
  message: string
}
