import { accountApi, type ApiCompany } from '@/api/endpoints/account.api'
import type { MyCompany } from '@/types/company.types'

function mapCompany(api: ApiCompany): MyCompany {
  return {
    id: api.id,
    name: api.name,
    address: api.address,
    contactName: api.contactName,
    contactEmail: api.contactEmail,
    contactPhone: api.contactPhone,
    notes: api.notes,
    status: api.status,
    managementMode: api.managementMode,
    deliveryWindowStart: api.deliveryWindowStart,
    deliveryWindowEnd: api.deliveryWindowEnd,
    telegramGroupChatId: api.telegramGroupChatId,
    logoId: api.logoId,
    logoUrl: api.logoUrl,
    cateringId: api.cateringId,
    cateringName: api.cateringName,
  }
}

export const companyService = {
  async getMyCompany(): Promise<MyCompany> {
    const data = await accountApi.company()
    return mapCompany(data)
  },
}
