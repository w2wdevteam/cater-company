import type { DeliveryStatus } from '@/lib/constants'

export interface DashboardStats {
  todayOrderCount: number
  employeesNotOrdered: number
  totalActiveEmployees: number
}

export interface MenuItem {
  id: string
  name: string
  price: number
  image?: string
}

export interface DeliveryStatusResponse {
  status: DeliveryStatus
  updatedAt: string
}

const mockStats: DashboardStats = {
  todayOrderCount: 47,
  employeesNotOrdered: 23,
  totalActiveEmployees: 70,
}

const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Grilled Chicken Bowl', price: 32000, image: undefined },
  { id: '2', name: 'Caesar Salad', price: 25000, image: undefined },
  { id: '3', name: 'Beef Stroganoff', price: 38000, image: undefined },
  { id: '4', name: 'Veggie Wrap', price: 24000, image: undefined },
  { id: '5', name: 'Pasta Primavera', price: 30000, image: undefined },
  { id: '6', name: 'Fish & Chips', price: 35000, image: undefined },
]

const mockDeliveryStatus: DeliveryStatusResponse = {
  status: 'on_the_way',
  updatedAt: new Date().toISOString(),
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getTodayStats(): Promise<DashboardStats> {
  await delay(600)
  return mockStats
}

export async function getTodayMenu(): Promise<MenuItem[]> {
  await delay(800)
  return mockMenuItems
}

export async function getDeliveryStatus(): Promise<DeliveryStatusResponse> {
  await delay(400)
  return mockDeliveryStatus
}
