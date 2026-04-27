import { apiClient } from '../client'
import { unwrap, unwrapList, type ListResult } from '../unwrap'

export type ApiEmployeeStatus = 'active' | 'inactive'

export interface ApiEmployee {
  id: string
  name: string
  phone: string
  email: string | null
  employeeId: string | null
  role: string | null
  status: ApiEmployeeStatus
  companyId: string
  companyName?: string
  departmentId: string | null
  departmentName: string | null
  locationId: string | null
  locationName?: string | null
  createdAt: string
  updatedAt: string
}

export interface EmployeeListQuery {
  page?: number
  limit?: number
  search?: string
  departmentId?: string
  locationId?: string
  status?: ApiEmployeeStatus
}

export interface CreateEmployeeBody {
  name: string
  phone: string
  email?: string
  employeeId?: string
  role?: string
  departmentId?: string | null
  locationId?: string | null
}

export type UpdateEmployeeBody = Partial<CreateEmployeeBody>

export interface BulkImportEmployeesBody {
  employees: CreateEmployeeBody[]
}

export interface BulkImportResult {
  imported: number
  errors?: Array<{ row: number; message: string }>
}

export interface EmployeeLookupItem {
  id: string
  name: string
  status: 'active' | 'inactive'
  phone: string
  companyId: string
  departmentId: string | null
  departmentName: string | null
}

export const employeesApi = {
  list: (params: EmployeeListQuery = {}): Promise<ListResult<ApiEmployee>> =>
    apiClient
      .get('/company-admin/employees', { params })
      .then((r) => unwrapList<ApiEmployee>(r)),

  get: (id: string): Promise<ApiEmployee> =>
    apiClient.get<ApiEmployee>(`/company-admin/employees/${id}`).then(unwrap<ApiEmployee>),

  create: (body: CreateEmployeeBody): Promise<ApiEmployee> =>
    apiClient.post<ApiEmployee>('/company-admin/employees', body).then(unwrap<ApiEmployee>),

  update: (id: string, body: UpdateEmployeeBody): Promise<ApiEmployee> =>
    apiClient
      .patch<ApiEmployee>(`/company-admin/employees/${id}`, body)
      .then(unwrap<ApiEmployee>),

  setStatus: (id: string, status: ApiEmployeeStatus): Promise<ApiEmployee> =>
    apiClient
      .patch<ApiEmployee>(`/company-admin/employees/${id}/status`, { status })
      .then(unwrap<ApiEmployee>),

  bulkImport: (body: BulkImportEmployeesBody): Promise<BulkImportResult> =>
    apiClient
      .post<BulkImportResult>('/company-admin/employees/bulk-import', body)
      .then(unwrap<BulkImportResult>),

  bulkImportPreview: (body: BulkImportEmployeesBody): Promise<BulkImportResult> =>
    apiClient
      .post<BulkImportResult>('/company-admin/employees/bulk-import/preview', body)
      .then(unwrap<BulkImportResult>),

  lookup: (params: { search?: string; status?: ApiEmployeeStatus } = {}): Promise<
    EmployeeLookupItem[]
  > =>
    apiClient
      .get<EmployeeLookupItem[]>('/company-admin/employees/lookup', { params })
      .then(unwrap<EmployeeLookupItem[]>),
}
