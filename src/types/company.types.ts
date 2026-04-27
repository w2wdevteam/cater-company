export type CompanyStatus = 'active' | 'inactive'
export type CompanyManagementMode = 'self_managed' | 'catering_managed'

/**
 * The company-admin's own company — returned by `GET /company-admin/account/company`.
 * `logoUrl` is a 1-hour presigned MinIO URL; refetch periodically.
 */
export interface MyCompany {
  id: string
  name: string
  address: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  notes: string | null
  status: CompanyStatus
  managementMode: CompanyManagementMode
  deliveryWindowStart: string | null
  deliveryWindowEnd: string | null
  telegramGroupChatId: string | null
  logoId: string | null
  logoUrl: string | null
  cateringId: string
  cateringName: string
}
