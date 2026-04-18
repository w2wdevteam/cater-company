export interface AuditLogEntry {
  id: string
  action: string
  targetRecord: string
  performedBy: string
  timestamp: string
}

export interface AuditLogFilters {
  from?: string
  to?: string
  actionType?: string
  page?: number
  limit?: number
}

export interface AuditLogResponse {
  data: AuditLogEntry[]
  total: number
  page: number
  limit: number
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  await delay(600)
  if (data.currentPassword === 'wrong') {
    throw new Error('Current password is incorrect.')
  }
}

const mockAuditLog: AuditLogEntry[] = [
  { id: '1', action: 'Employee created', targetRecord: 'John Smith', performedBy: 'Office Manager', timestamp: '2026-04-18T14:30:00Z' },
  { id: '2', action: 'Order placed', targetRecord: 'Order #1042', performedBy: 'Office Manager', timestamp: '2026-04-18T13:15:00Z' },
  { id: '3', action: 'Employee deactivated', targetRecord: 'Tom Wilson', performedBy: 'Office Manager', timestamp: '2026-04-18T11:00:00Z' },
  { id: '4', action: 'Order cancelled', targetRecord: 'Order #1038', performedBy: 'Office Manager', timestamp: '2026-04-17T16:45:00Z' },
  { id: '5', action: 'Order rejected', targetRecord: 'Order #1035', performedBy: 'Office Manager', timestamp: '2026-04-17T15:20:00Z' },
  { id: '6', action: 'Request submitted', targetRecord: 'Not Delivered #NDR-2', performedBy: 'Office Manager', timestamp: '2026-04-17T14:00:00Z' },
  { id: '7', action: 'Password changed', targetRecord: 'Office Manager', performedBy: 'Office Manager', timestamp: '2026-04-17T10:30:00Z' },
  { id: '8', action: 'Employee created', targetRecord: 'Rachel Kim', performedBy: 'Office Manager', timestamp: '2026-04-16T09:00:00Z' },
  { id: '9', action: 'Location created', targetRecord: 'Warehouse Office', performedBy: 'Office Manager', timestamp: '2026-04-16T08:30:00Z' },
  { id: '10', action: 'Department updated', targetRecord: 'Engineering', performedBy: 'Office Manager', timestamp: '2026-04-15T16:00:00Z' },
  { id: '11', action: 'Employee updated', targetRecord: 'Sarah Johnson', performedBy: 'Office Manager', timestamp: '2026-04-15T14:30:00Z' },
  { id: '12', action: 'Order placed', targetRecord: 'Order #1030', performedBy: 'Office Manager', timestamp: '2026-04-15T11:00:00Z' },
  { id: '13', action: 'Order placed', targetRecord: 'Order #1029', performedBy: 'Office Manager', timestamp: '2026-04-15T10:45:00Z' },
  { id: '14', action: 'Employee created', targetRecord: 'Jessica Lee', performedBy: 'Office Manager', timestamp: '2026-04-14T09:15:00Z' },
  { id: '15', action: 'Request submitted', targetRecord: 'Not Delivered #NDR-3', performedBy: 'Office Manager', timestamp: '2026-04-14T15:45:00Z' },
  { id: '16', action: 'Location updated', targetRecord: 'Main Office', performedBy: 'Office Manager', timestamp: '2026-04-13T11:00:00Z' },
  { id: '17', action: 'Order cancelled', targetRecord: 'Order #1020', performedBy: 'Office Manager', timestamp: '2026-04-13T09:30:00Z' },
  { id: '18', action: 'Employee deactivated', targetRecord: 'Alex Turner', performedBy: 'Office Manager', timestamp: '2026-04-12T14:00:00Z' },
  { id: '19', action: 'Order placed', targetRecord: 'Order #1015', performedBy: 'Office Manager', timestamp: '2026-04-12T10:00:00Z' },
  { id: '20', action: 'Department created', targetRecord: 'Sales', performedBy: 'Office Manager', timestamp: '2026-04-11T09:00:00Z' },
  { id: '21', action: 'Employee created', targetRecord: 'David Brown', performedBy: 'Office Manager', timestamp: '2026-04-11T08:30:00Z' },
  { id: '22', action: 'Order rejected', targetRecord: 'Order #1010', performedBy: 'Office Manager', timestamp: '2026-04-10T16:00:00Z' },
  { id: '23', action: 'Employee updated', targetRecord: 'Mike Chen', performedBy: 'Office Manager', timestamp: '2026-04-10T11:00:00Z' },
  { id: '24', action: 'Order placed', targetRecord: 'Order #1005', performedBy: 'Office Manager', timestamp: '2026-04-09T10:30:00Z' },
  { id: '25', action: 'Location created', targetRecord: 'Building B - Cafeteria', performedBy: 'Office Manager', timestamp: '2026-04-09T09:00:00Z' },
]

export const AUDIT_ACTION_TYPES = [
  'Employee created',
  'Employee updated',
  'Employee deactivated',
  'Order placed',
  'Order cancelled',
  'Order rejected',
  'Request submitted',
  'Password changed',
  'Location created',
  'Location updated',
  'Department created',
  'Department updated',
]

export async function getAuditLog(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
  await delay(500)

  let filtered = [...mockAuditLog]

  if (filters.actionType) {
    filtered = filtered.filter((e) => e.action === filters.actionType)
  }

  if (filters.from) {
    const from = new Date(filters.from)
    filtered = filtered.filter((e) => new Date(e.timestamp) >= from)
  }

  if (filters.to) {
    const to = new Date(filters.to + 'T23:59:59')
    filtered = filtered.filter((e) => new Date(e.timestamp) <= to)
  }

  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const start = (page - 1) * limit

  return {
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  }
}
