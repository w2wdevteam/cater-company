import { apiClient } from '../client'
import { unwrap, unwrapList, type ListResult } from '../unwrap'

export interface ApiCompany {
  id: string
  name: string
  address: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  notes: string | null
  status: 'active' | 'inactive'
  managementMode: 'self_managed' | 'catering_managed'
  deliveryWindowStart: string | null
  deliveryWindowEnd: string | null
  telegramGroupChatId: string | null
  logoId: string | null
  logoUrl: string | null
  cateringId: string
  cateringName: string
}

export interface ApiAuditLogEntry {
  id: string
  action: string
  entityType: string | null
  entityId: string | null
  targetRecord?: string | null
  performedBy: string
  performedById: string | null
  companyId: string | null
  cateringId: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
  timestamp?: string
}

export interface AuditLogQuery {
  page?: number
  limit?: number
  dateFrom?: string
  dateTo?: string
  action?: string
  entityType?: string
}

export const accountApi = {
  company: () =>
    apiClient.get<ApiCompany>('/company-admin/account/company').then(unwrap<ApiCompany>),

  auditLogs: (params: AuditLogQuery = {}): Promise<ListResult<ApiAuditLogEntry>> =>
    apiClient
      .get('/company-admin/account/audit-logs', { params })
      .then((r) => unwrapList<ApiAuditLogEntry>(r)),
}
