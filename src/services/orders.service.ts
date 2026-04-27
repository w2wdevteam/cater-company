import { ordersApi, type ApiOrder } from '@/api/endpoints/orders.api'
import type { OrderStatus } from '@/lib/constants'
import type {
  Order,
  OrderFilters,
  OrderListResponse,
  PlaceOrderData,
} from '@/types/order.types'
import { useAuthStore } from '@/store/auth.store'

function mapOrder(o: ApiOrder): Order {
  return {
    id: o.id,
    employeeId: o.employeeId ?? undefined,
    employeeName: o.employeeName ?? (o.isCompanyLevel ? 'Company Order' : '—'),
    menuItemId: o.menuItemId,
    menuItemName: o.menuItemName,
    menuItemPrice: o.unitPrice,
    departmentId: o.departmentId ?? undefined,
    departmentName: o.departmentName ?? undefined,
    isCompanyLevel: o.isCompanyLevel,
    status: o.status as OrderStatus,
    rejectionReason: o.rejectionReason ?? undefined,
    createdAt: o.createdAt,
  }
}

export async function getOrders(filters: OrderFilters = {}): Promise<OrderListResponse> {
  const result = await ordersApi.list({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
    departmentId: filters.department && filters.department !== 'all' ? filters.department : undefined,
    status:
      filters.status && filters.status !== 'all'
        ? (filters.status as ApiOrder['status'])
        : undefined,
  })
  return {
    data: result.data.map(mapOrder),
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
  }
}

export async function placeOrder(data: PlaceOrderData): Promise<Order> {
  const companyId = useAuthStore.getState().user?.companyId
  if (!companyId) throw new Error('Not authenticated')
  const order = await ordersApi.create({
    companyId,
    menuItemId: data.menuItemId,
    employeeId: data.isCompanyLevel ? undefined : data.employeeId,
    isCompanyLevel: data.isCompanyLevel,
    quantity: Math.max(1, data.quantity ?? 1),
  })
  return mapOrder(order)
}

export async function cancelOrder(id: string): Promise<Order> {
  return mapOrder(await ordersApi.cancel(id))
}

export async function rejectOrder(id: string, reason?: string): Promise<Order> {
  return mapOrder(await ordersApi.reject(id, { rejectionReason: reason }))
}
