import type { RequestStatus } from '@/lib/constants'

export interface DailyReportMenuBreakdown {
  menuItemName: string
  orderCount: number
}

export interface DailyReportDepartment {
  departmentName: string
  orderCount: number
  menuItems: DailyReportMenuBreakdown[]
}

export interface WeeklyReportRow {
  employeeName: string
  departmentName: string
  days: Record<string, { menuItemName: string; notDelivered: boolean } | null>
  totalOrders: number
  totalCost: number
}

export interface MonthlyReportMenuLine {
  menuItemId: string
  menuItemName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface MonthlyReportRow {
  employeeId: string
  employeeName: string
  departmentId: string | null
  departmentName: string
  orderCount: number
  totalCost: number
  menuItems: MonthlyReportMenuLine[]
}

export interface YtdRow {
  month: string
  orderCount: number | null
  totalCost: number | null
  runningTotal: number | null
}

export interface NotDeliveredSummaryRow {
  date: string
  affectedOrders: number
  totalValue: number
  status: RequestStatus
}

export interface DailyStatusData {
  ordered: Array<{ employeeName: string; menuItemName: string }>
  notOrdered: Array<{ employeeName: string; departmentName: string }>
  updatedAt: string
}

export interface CancellationRow {
  employeeName: string
  menuItemName: string
  orderDate: string
  cancelledAt: string
}

export interface DailyReportMenuGroup {
  menuItemName: string
  orderCount: number
}

export interface DailyReportLocationGroup {
  locationName: string
  orderCount: number
  menuItems: DailyReportMenuBreakdown[]
}
