import { accountApi, type ApiAuditLogEntry } from '@/api/endpoints/account.api'
import { authService } from '@/services/auth.service'

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

function mapEntry(e: ApiAuditLogEntry): AuditLogEntry {
  return {
    id: e.id,
    action: e.action,
    targetRecord: e.targetRecord ?? e.entityType ?? '—',
    performedBy: e.performedBy,
    timestamp: e.timestamp ?? e.createdAt,
  }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  await authService.changePassword(data.currentPassword, data.newPassword)
}

export const AUDIT_ACTION_TYPES = [
  'entity_created',
  'entity_updated',
  'entity_deleted',
  'order_placed',
  'order_cancelled',
  'order_rejected',
  'admin_password_changed',
  'login_success',
  'login_failed',
]

export async function getAuditLog(
  filters: AuditLogFilters = {},
): Promise<AuditLogResponse> {
  const result = await accountApi.auditLogs({
    page: filters.page,
    limit: filters.limit ?? 20,
    dateFrom: filters.from,
    dateTo: filters.to,
    action: filters.actionType,
  })
  return {
    data: result.data.map(mapEntry),
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
  }
}
