import { adminsApi, type ApiAdmin } from '@/api/endpoints/admins.api'
import type { Admin, AdminFormData } from '@/types/admin.types'

function mapAdmin(a: ApiAdmin): Admin {
  return {
    id: a.id,
    name: a.fullName,
    email: a.email ?? '',
    // Backend role is always 'company_admin' within this scope; we surface a
    // coarser FE label that the settings UI understands.
    role: 'admin',
    status: a.status,
    createdAt: a.createdAt,
    lastLoginAt: a.lastLogin,
  }
}

export async function getAdmins(): Promise<Admin[]> {
  const result = await adminsApi.list({ limit: 100 })
  return result.data.map(mapAdmin)
}

export async function createAdmin(data: AdminFormData): Promise<Admin> {
  if (!data.password) throw new Error('Password is required')
  const created = await adminsApi.create({
    fullName: data.name,
    phone: data.email,
    email: data.email,
    password: data.password,
  })
  return mapAdmin(created)
}

export async function updateAdmin(id: string, data: AdminFormData): Promise<Admin> {
  const updated = await adminsApi.update(id, {
    fullName: data.name,
    email: data.email,
  })
  return mapAdmin(updated)
}

export async function updateAdminStatus(
  id: string,
  status: 'active' | 'inactive',
): Promise<void> {
  await adminsApi.setStatus(id, status)
}

export async function resetAdminPassword(id: string, newPassword: string): Promise<void> {
  await adminsApi.resetPassword(id, newPassword)
}
