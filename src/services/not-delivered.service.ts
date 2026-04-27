import {
  notDeliveredApi,
  type ApiNotDeliveredRequestDetail,
  type ApiNotDeliveredRequestSummary,
} from '@/api/endpoints/not-delivered.api'
import type {
  NotDeliveredRequest,
  NotDeliveredCreateData,
} from '@/types/not-delivered.types'
import type { RequestStatus } from '@/lib/constants'

function mapSummary(r: ApiNotDeliveredRequestSummary): NotDeliveredRequest {
  return {
    id: r.id,
    // Backend summary has no per-order "affected date", so surface the submission date.
    date: r.submittedAt.slice(0, 10),
    affectedOrderCount: r.affectedOrderCount,
    note: r.note ?? undefined,
    responseNote: r.responseNote ?? undefined,
    status: r.status as RequestStatus,
    createdAt: r.submittedAt,
  }
}

function mapDetail(r: ApiNotDeliveredRequestDetail): NotDeliveredRequest {
  return {
    ...mapSummary(r),
    affectedOrders: r.flaggedOrders.map((f) => ({
      id: f.orderId,
      employeeName: f.employeeName ?? '—',
      menuItemName: f.menuItemName,
    })),
  }
}

export async function getNotDeliveredRequests(): Promise<NotDeliveredRequest[]> {
  const result = await notDeliveredApi.list({ limit: 100 })
  return result.data.map(mapSummary)
}

export async function getNotDeliveredRequest(
  id: string,
): Promise<NotDeliveredRequest | undefined> {
  try {
    return mapDetail(await notDeliveredApi.get(id))
  } catch {
    return undefined
  }
}

export async function createNotDeliveredRequest(
  data: NotDeliveredCreateData,
): Promise<NotDeliveredRequest> {
  return mapDetail(
    await notDeliveredApi.submit({
      orderIds: data.orderIds,
      note: data.note,
    }),
  )
}
