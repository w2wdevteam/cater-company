import { dashboardApi } from '@/api/endpoints/dashboard.api'
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

export async function getTodayStats(): Promise<DashboardStats> {
  const res = await dashboardApi.get()
  return {
    todayOrderCount: res.todayOrderCount,
    employeesNotOrdered: res.employeesNotOrdered,
    totalActiveEmployees: res.activeEmployeeCount,
  }
}

export async function getTodayMenu(): Promise<MenuItem[]> {
  const res = await dashboardApi.get()
  return res.todayMenu.map((m) => ({
    id: m.menuItemId,
    name: m.name,
    price: m.effectivePrice ?? m.price,
    image: m.imageUrl ?? undefined,
  }))
}

export async function getDeliveryStatus(): Promise<DeliveryStatusResponse> {
  const res = await dashboardApi.get()
  return {
    status: res.deliveryStatus as DeliveryStatus,
    updatedAt: new Date().toISOString(),
  }
}
