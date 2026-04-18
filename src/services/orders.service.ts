import type { OrderStatus } from '@/lib/constants'
import type {
  Order,
  OrderFilters,
  OrderListResponse,
  PlaceOrderData,
} from '@/types/order.types'

const mockOrders: Order[] = [
  {
    id: 'ord-1',
    employeeId: '1',
    employeeName: 'John Smith',
    menuItemId: 'm1',
    menuItemName: 'Grilled Chicken Bowl',
    menuItemPrice: 12.5,
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    isCompanyLevel: false,
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ord-2',
    employeeId: '2',
    employeeName: 'Sarah Johnson',
    menuItemId: 'm2',
    menuItemName: 'Caesar Salad',
    menuItemPrice: 9.0,
    departmentId: 'dept-2',
    departmentName: 'Marketing',
    isCompanyLevel: false,
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ord-3',
    employeeId: '3',
    employeeName: 'Mike Chen',
    menuItemId: 'm3',
    menuItemName: 'Beef Stroganoff',
    menuItemPrice: 14.0,
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    isCompanyLevel: false,
    status: 'delivered',
    createdAt: '2026-04-17T10:30:00Z',
  },
  {
    id: 'ord-4',
    employeeName: 'Company Order',
    menuItemId: 'm4',
    menuItemName: 'Veggie Wrap',
    menuItemPrice: 8.5,
    isCompanyLevel: true,
    status: 'on_the_way',
    createdAt: '2026-04-17T09:00:00Z',
  },
  {
    id: 'ord-5',
    employeeId: '5',
    employeeName: 'Emily Davis',
    menuItemId: 'm5',
    menuItemName: 'Pasta Primavera',
    menuItemPrice: 11.0,
    departmentId: 'dept-2',
    departmentName: 'Marketing',
    isCompanyLevel: false,
    status: 'rejected',
    rejectionReason: 'Item out of stock',
    createdAt: '2026-04-17T08:45:00Z',
  },
  {
    id: 'ord-6',
    employeeId: '6',
    employeeName: 'Alex Turner',
    menuItemId: 'm1',
    menuItemName: 'Grilled Chicken Bowl',
    menuItemPrice: 12.5,
    departmentId: 'dept-3',
    departmentName: 'Sales',
    isCompanyLevel: false,
    status: 'not_delivered',
    createdAt: '2026-04-16T11:00:00Z',
  },
  {
    id: 'ord-7',
    employeeId: '7',
    employeeName: 'David Brown',
    menuItemId: 'm6',
    menuItemName: 'Fish & Chips',
    menuItemPrice: 13.5,
    departmentId: 'dept-3',
    departmentName: 'Sales',
    isCompanyLevel: false,
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ord-8',
    employeeId: '8',
    employeeName: 'Rachel Kim',
    menuItemId: 'm2',
    menuItemName: 'Caesar Salad',
    menuItemPrice: 9.0,
    departmentId: 'dept-4',
    departmentName: 'HR',
    isCompanyLevel: false,
    status: 'delivered',
    createdAt: '2026-04-16T10:15:00Z',
  },
  {
    id: 'ord-9',
    employeeId: '4',
    employeeName: 'Lisa Wang',
    menuItemId: 'm3',
    menuItemName: 'Beef Stroganoff',
    menuItemPrice: 14.0,
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    isCompanyLevel: false,
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ord-10',
    employeeId: '10',
    employeeName: 'Jessica Lee',
    menuItemId: 'm4',
    menuItemName: 'Veggie Wrap',
    menuItemPrice: 8.5,
    departmentId: 'dept-2',
    departmentName: 'Marketing',
    isCompanyLevel: false,
    status: 'arrived',
    createdAt: '2026-04-16T09:30:00Z',
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getOrders(filters: OrderFilters = {}): Promise<OrderListResponse> {
  await delay(500)

  let filtered = [...mockOrders]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter((o) => o.employeeName.toLowerCase().includes(q))
  }

  if (filters.department) {
    filtered = filtered.filter((o) => o.departmentId === filters.department)
  }

  if (filters.status) {
    filtered = filtered.filter((o) => o.status === filters.status)
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom)
    filtered = filtered.filter((o) => new Date(o.createdAt) >= from)
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo + 'T23:59:59')
    filtered = filtered.filter((o) => new Date(o.createdAt) <= to)
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const start = (page - 1) * limit

  return {
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
  }
}

export async function placeOrder(data: PlaceOrderData): Promise<Order> {
  await delay(400)
  return {
    id: String(Date.now()),
    employeeId: data.employeeId,
    employeeName: data.isCompanyLevel ? 'Company Order' : 'Employee',
    menuItemId: data.menuItemId,
    menuItemName: 'Menu Item',
    menuItemPrice: 0,
    isCompanyLevel: data.isCompanyLevel,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
}

export async function cancelOrder(id: string): Promise<Order> {
  await delay(400)
  const existing = mockOrders.find((o) => o.id === id)
  return { ...existing!, status: 'rejected' as OrderStatus }
}

export async function rejectOrder(id: string, reason?: string): Promise<Order> {
  await delay(400)
  const existing = mockOrders.find((o) => o.id === id)
  return { ...existing!, status: 'rejected' as OrderStatus, rejectionReason: reason }
}
