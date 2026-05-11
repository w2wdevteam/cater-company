import {
  employeesApi,
  type ApiEmployee,
  type BulkImportEmployeesBody,
  type CreateEmployeeBody,
} from '@/api/endpoints/employees.api'
import type {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  EmployeeListResponse,
  EmployeeImportRow,
} from '@/types/employee.types'
import type { EmployeeStatus } from '@/lib/constants'

function mapEmployee(e: ApiEmployee): Employee {
  return {
    id: e.id,
    name: e.name,
    phone: e.phone,
    email: e.email ?? undefined,
    employeeId: e.employeeId ?? undefined,
    departmentId: e.departmentId ?? undefined,
    departmentName: e.departmentName ?? undefined,
    role: e.role ?? undefined,
    locationId: e.locationId ?? undefined,
    location: e.locationName ?? undefined,
    status: e.status as EmployeeStatus,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }
}

function toCreateBody(data: EmployeeFormData): CreateEmployeeBody {
  return {
    name: data.name,
    phone: data.phone,
    email: data.email || undefined,
    employeeId: data.employeeId || undefined,
    role: data.role || undefined,
    departmentId: data.departmentId || undefined,
    // Explicit null clears the location on edit; undefined would let the
    // backend keep the existing value (NestJS PartialType + service treats
    // `undefined` as "no change", `null` as "clear").
    locationId: data.locationId ? data.locationId : null,
  }
}

export async function getEmployees(
  filters: EmployeeFilters = {},
): Promise<EmployeeListResponse> {
  const result = await employeesApi.list({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    departmentId:
      filters.department && filters.department !== 'all' ? filters.department : undefined,
    status:
      filters.status && filters.status !== 'all' ? (filters.status as 'active' | 'inactive') : undefined,
  })
  return {
    data: result.data.map(mapEmployee),
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
  }
}

export async function createEmployee(data: EmployeeFormData): Promise<Employee> {
  return mapEmployee(await employeesApi.create(toCreateBody(data)))
}

export async function updateEmployee(
  id: string,
  data: EmployeeFormData,
): Promise<Employee> {
  return mapEmployee(await employeesApi.update(id, toCreateBody(data)))
}

export async function updateEmployeeStatus(
  id: string,
  status: EmployeeStatus,
): Promise<Employee> {
  return mapEmployee(await employeesApi.setStatus(id, status as 'active' | 'inactive'))
}

/**
 * The backend bulk-import endpoint requires full employee rows (name, phone,
 * plus optional department/email/etc.). If the importer only gives us name/phone/department
 * strings, we upload those as-is; the backend will 400 on any row missing required fields.
 */
export async function importEmployees(
  rows: EmployeeImportRow[],
): Promise<{ imported: number }> {
  const body: BulkImportEmployeesBody = {
    employees: rows.map((r) => ({
      name: r.name,
      phone: r.phone,
      // `department` from the CSV is a name; backend needs `departmentId`. Callers
      // that pre-resolve ids should switch to feeding full CreateEmployeeBody rows.
    })),
  }
  const result = await employeesApi.bulkImport(body)
  return { imported: result.imported }
}

export async function employeeLookup(params: { search?: string } = {}) {
  return employeesApi.lookup({ ...params, status: 'active' })
}
