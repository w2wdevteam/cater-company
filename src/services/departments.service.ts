import { departmentsApi, type ApiDepartment } from '@/api/endpoints/departments.api'
import type { Department, DepartmentFormData } from '@/types/common.types'
import { useAuthStore } from '@/store/auth.store'

function mapDepartment(d: ApiDepartment): Department {
  return {
    id: d.id,
    name: d.name,
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

/**
 * The backend requires a `locationId` (UUID) when creating a department — the UI
 * still collects a free-text `location` label. When `location` is not a UUID the
 * backend will reject the request; pages that use this should be updated to
 * choose a location from the lookup endpoint.
 */
export async function createDepartment(data: DepartmentFormData): Promise<Department> {
  const companyId = getCompanyId()
  const locationId = data.location ?? ''
  const created = await departmentsApi.create({
    name: data.name,
    contactPerson: data.contactPerson || undefined,
    buildingNotes: data.buildingNotes || undefined,
    companyId,
    locationId,
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
    locationId: data.location || undefined,
  })
  return mapDepartment(updated)
}

export async function deleteDepartment(id: string): Promise<void> {
  await departmentsApi.setStatus(id, 'inactive')
}
