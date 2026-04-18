import type {
  NotDeliveredRequest,
  NotDeliveredCreateData,
} from '@/types/not-delivered.types'

const mockRequests: NotDeliveredRequest[] = [
  {
    id: 'ndr-1',
    date: '2026-04-16',
    affectedOrders: [
      { id: 'ord-6', employeeName: 'Alex Turner', menuItemName: 'Grilled Chicken Bowl' },
      { id: 'ord-10', employeeName: 'Jessica Lee', menuItemName: 'Veggie Wrap' },
    ],
    note: 'Driver did not arrive at Building B before cutoff.',
    responseNote: 'Confirmed with driver. Refund issued for affected orders.',
    status: 'approved',
    createdAt: '2026-04-16T16:30:00Z',
  },
  {
    id: 'ndr-2',
    date: '2026-04-15',
    affectedOrders: [
      { id: 'ord-99', employeeName: 'Mike Chen', menuItemName: 'Beef Stroganoff' },
    ],
    note: 'Order was missing from the delivery.',
    status: 'pending',
    createdAt: '2026-04-15T17:00:00Z',
  },
  {
    id: 'ndr-3',
    date: '2026-04-14',
    affectedOrders: [
      { id: 'ord-100', employeeName: 'Sarah Johnson', menuItemName: 'Caesar Salad' },
      { id: 'ord-101', employeeName: 'David Brown', menuItemName: 'Fish & Chips' },
      { id: 'ord-102', employeeName: 'Rachel Kim', menuItemName: 'Pasta Primavera' },
    ],
    note: 'Entire delivery was not received at the warehouse location.',
    responseNote: 'This was a scheduling error on our side. We cannot process a refund for this date.',
    status: 'rejected',
    createdAt: '2026-04-14T15:45:00Z',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getNotDeliveredRequests(): Promise<NotDeliveredRequest[]> {
  await delay(500)
  return mockRequests
}

export async function getNotDeliveredRequest(id: string): Promise<NotDeliveredRequest | undefined> {
  await delay(300)
  return mockRequests.find((r) => r.id === id)
}

export async function createNotDeliveredRequest(data: NotDeliveredCreateData): Promise<NotDeliveredRequest> {
  await delay(500)
  return {
    id: String(Date.now()),
    date: data.date,
    affectedOrders: data.orderIds.map((oid) => ({
      id: oid,
      employeeName: 'Employee',
      menuItemName: 'Menu Item',
    })),
    note: data.note,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
}
