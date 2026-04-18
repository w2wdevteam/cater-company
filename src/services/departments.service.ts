import type { Department, DepartmentFormData } from '@/types/common.types'

const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    location: 'Building A',
    contactPerson: 'John Smith',
    buildingNotes: '3rd Floor, Wing B',
    employeeCount: 25,
  },
  {
    id: 'dept-2',
    name: 'Marketing',
    location: 'Building A',
    contactPerson: 'Sarah Johnson',
    buildingNotes: '2nd Floor',
    employeeCount: 12,
  },
  {
    id: 'dept-3',
    name: 'Sales',
    location: 'Building B',
    contactPerson: 'David Brown',
    buildingNotes: '1st Floor',
    employeeCount: 18,
  },
  {
    id: 'dept-4',
    name: 'HR',
    location: 'Building A',
    contactPerson: 'Rachel Kim',
    buildingNotes: '4th Floor, Room 401',
    employeeCount: 8,
  },
  {
    id: 'dept-5',
    name: 'Finance',
    location: 'Building B',
    contactPerson: 'Mark Taylor',
    buildingNotes: '2nd Floor',
    employeeCount: 7,
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getDepartments(): Promise<Department[]> {
  await delay(500)
  return mockDepartments
}

export async function createDepartment(data: DepartmentFormData): Promise<Department> {
  await delay(400)
  return {
    id: String(Date.now()),
    ...data,
    employeeCount: 0,
  }
}

export async function updateDepartment(id: string, data: DepartmentFormData): Promise<Department> {
  await delay(400)
  const existing = mockDepartments.find((d) => d.id === id)
  return { ...existing!, ...data }
}

export async function deleteDepartment(id: string): Promise<void> {
  await delay(400)
  void id
}
