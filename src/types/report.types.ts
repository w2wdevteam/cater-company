import type { RequestStatus } from '@/lib/constants'

export interface DailyReportEmployee {
  employeeName: string
  menuItemName: string
  cost: number
  notDelivered: boolean
}

export interface DailyReportDepartment {
  departmentName: string
  orderCount: number
  costTotal: number
  employees: DailyReportEmployee[]
}

export interface WeeklyReportRow {
  employeeName: string
  departmentName: string
  days: Record<string, { menuItemName: string; notDelivered: boolean } | null>
  totalOrders: number
  totalCost: number
}

export interface MonthlyReportRow {
  employeeName: string
  departmentName: string
  orderCount: number
  menuBreakdown: string
  totalCost: number
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
  price: number
  orderCount: number
  costTotal: number
  employees: Array<{
    employeeName: string
    departmentName: string
    notDelivered: boolean
  }>
}

export interface DailyReportLocationGroup {
  locationName: string
  orderCount: number
  costTotal: number
  departments: Array<{
    departmentName: string
    orderCount: number
    costTotal: number
    employees: Array<{
      employeeName: string
      menuItemName: string
      cost: number
      notDelivered: boolean
    }>
  }>
}
