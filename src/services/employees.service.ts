import type {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  EmployeeListResponse,
  EmployeeImportRow,
} from '@/types/employee.types'
import type { EmployeeStatus } from '@/lib/constants'

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1 555-0101',
    email: 'john.smith@acme.com',
    employeeId: 'EMP-001',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    status: 'active',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1 555-0102',
    email: 'sarah.j@acme.com',
    employeeId: 'EMP-002',
    departmentId: 'dept-2',
    departmentName: 'Marketing',
    status: 'active',
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-02-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Mike Davis',
    phone: '+1 555-0103',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    status: 'active',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: '4',
    name: 'Emily Chen',
    phone: '+1 555-0104',
    email: 'emily.c@acme.com',
    employeeId: 'EMP-004',
    departmentId: 'dept-3',
    departmentName: 'Sales',
    status: 'inactive',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
  },
  {
    id: '5',
    name: 'Alex Turner',
    phone: '+1 555-0105',
    departmentId: 'dept-2',
    departmentName: 'Marketing',
    status: 'active',
    createdAt: '2025-03-01T08:00:00Z',
    updatedAt: '2025-03-01T08:00:00Z',
  },
  {
    id: '6',
    name: 'Lisa Wang',
    phone: '+1 555-0106',
    email: 'lisa.w@acme.com',
    employeeId: 'EMP-006',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    status: 'active',
    createdAt: '2025-02-10T08:00:00Z',
    updatedAt: '2025-02-10T08:00:00Z',
  },
  {
    id: '7',
    name: 'David Brown',
    phone: '+1 555-0107',
    departmentId: 'dept-3',
    departmentName: 'Sales',
    status: 'active',
    createdAt: '2025-01-25T08:00:00Z',
    updatedAt: '2025-01-25T08:00:00Z',
  },
  {
    id: '8',
    name: 'Rachel Kim',
    phone: '+1 555-0108',
    email: 'rachel.k@acme.com',
    departmentId: 'dept-4',
    departmentName: 'HR',
    status: 'active',
    createdAt: '2025-03-05T08:00:00Z',
    updatedAt: '2025-03-05T08:00:00Z',
  },
  {
    id: '9',
    name: 'Tom Wilson',
    phone: '+1 555-0109',
    employeeId: 'EMP-009',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    status: 'inactive',
    createdAt: '2025-01-05T08:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
  },
  {
    id: '10',
    name: 'Jessica Lee',
    phone: '+1 555-0110',
    email: 'jessica.l@acme.com',
    departmentId: 'dept-2',
    departmentName: 'Marketing',
    status: 'active',
    createdAt: '2025-02-20T08:00:00Z',
    updatedAt: '2025-02-20T08:00:00Z',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getEmployees(
  filters: EmployeeFilters = {},
): Promise<EmployeeListResponse> {
  await delay(500)

  let filtered = [...mockEmployees]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.phone.includes(q),
    )
  }

  if (filters.department) {
    filtered = filtered.filter((e) => e.departmentId === filters.department)
  }

  if (filters.status) {
    filtered = filtered.filter((e) => e.status === filters.status)
  }

  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const start = (page - 1) * limit

  return {
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  }
}

export async function createEmployee(
  data: EmployeeFormData,
): Promise<Employee> {
  await delay(400)
  return {
    id: String(Date.now()),
    ...data,
    status: 'active' as EmployeeStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function updateEmployee(
  id: string,
  data: EmployeeFormData,
): Promise<Employee> {
  await delay(400)
  const existing = mockEmployees.find((e) => e.id === id)
  return {
    ...existing!,
    ...data,
    updatedAt: new Date().toISOString(),
  }
}

export async function updateEmployeeStatus(
  id: string,
  status: EmployeeStatus,
): Promise<Employee> {
  await delay(400)
  const existing = mockEmployees.find((e) => e.id === id)
  return {
    ...existing!,
    status,
    updatedAt: new Date().toISOString(),
  }
}

export async function importEmployees(
  rows: EmployeeImportRow[],
): Promise<{ imported: number }> {
  await delay(800)
  return { imported: rows.length }
}

export const mockDepartments = [
  { id: 'dept-1', name: 'Engineering' },
  { id: 'dept-2', name: 'Marketing' },
  { id: 'dept-3', name: 'Sales' },
  { id: 'dept-4', name: 'HR' },
]
