import type { Admin, AdminFormData } from '@/types/admin.types'

const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    name: 'Office Manager',
    email: 'admin@acmecorp.com',
    role: 'super_admin',
    status: 'active',
    createdAt: '2025-01-15T09:00:00Z',
    lastLoginAt: '2026-04-18T08:30:00Z',
  },
  {
    id: 'admin-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@acmecorp.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-06-01T10:00:00Z',
    lastLoginAt: '2026-04-17T14:20:00Z',
  },
  {
    id: 'admin-3',
    name: 'Mike Davis',
    email: 'mike.d@acmecorp.com',
    role: 'admin',
    status: 'inactive',
    createdAt: '2025-03-20T11:00:00Z',
    lastLoginAt: '2026-02-10T09:15:00Z',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getAdmins(): Promise<Admin[]> {
  await delay(500)
  return mockAdmins
}

export async function createAdmin(data: AdminFormData): Promise<Admin> {
  await delay(400)
  return {
    id: String(Date.now()),
    ...data,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  }
}

export async function updateAdmin(id: string, data: AdminFormData): Promise<Admin> {
  await delay(400)
  const existing = mockAdmins.find((a) => a.id === id)
  return { ...existing!, ...data }
}

export async function updateAdminStatus(id: string, status: 'active' | 'inactive'): Promise<void> {
  await delay(400)
  void id
  void status
}

export async function resetAdminPassword(id: string, newPassword: string): Promise<void> {
  await delay(400)
  void id
  void newPassword
}
