import { departmentsApi, type ApiDepartment } from '@/api/endpoints/departments.api'
import type { Department, DepartmentFormData } from '@/types/common.types'
import { useAuthStore } from '@/store/auth.store'

function mapDepartment(d: ApiDepartment): Department {
  return {
    id: d.id,
    name: d.name,
    locationId: d.locationId,
    location: d.locationName ?? undefined,
    contactPerson: d.contactPerson ?? undefined,
    buildingNotes: d.buildingNotes ?? undefined,
    employeeCount: d.employeeCount,
  }
}

function getCompanyId(): string {
  const id = useAuthStore.getState().user?.companyId
  if (!id) throw new Error('Not authenticated')
  return id
}

export async function getDepartments(): Promise<Department[]> {
  const result = await departmentsApi.list({ status: 'active', limit: 100 })
  return result.data.map(mapDepartment)
}

export async function createDepartment(data: DepartmentFormData): Promise<Department> {
  const companyId = getCompanyId()
  const created = await departmentsApi.create({
    name: data.name,
    contactPerson: data.contactPerson || undefined,
    buildingNotes: data.buildingNotes || undefined,
    companyId,
    locationId: data.locationId,
  })
  return mapDepartment(created)
}

export async function updateDepartment(
  id: string,
  data: DepartmentFormData,
): Promise<Department> {
  const updated = await departmentsApi.update(id, {
    name: data.name,
    contactPerson: data.contactPerson || undefined,
    buildingNotes: data.buildingNotes || undefined,
    locationId: data.locationId,
  })
  return mapDepartment(updated)
}

export async function deleteDepartment(id: string): Promise<void> {
  await departmentsApi.setStatus(id, 'inactive')
}
