import { apiClient } from '../client'
import { unwrap } from '../unwrap'

export type DailyViewMode = 'by_department' | 'by_menu' | 'by_location'

export interface DailyReportQuery {
  date?: string
  dateFrom?: string
  dateTo?: string
  departmentId?: string
  viewMode?: DailyViewMode
}

export interface WeeklyReportQuery {
  weekStart?: string
  dateFrom?: string
  dateTo?: string
  departmentId?: string
}

export interface MonthlyReportQuery {
  month: string
  departmentId?: string
}

export interface YtdReportQuery {
  year?: number
}

export interface RangeReportQuery {
  dateFrom?: string
  dateTo?: string
}

interface DateRangeMeta {
  date: string | null
  dateFrom: string | null
  dateTo: string | null
}

interface MenuBreakdownItem {
  menuItemName: string
  quantity: number
}

export interface ApiDailyByDepartmentResponse extends DateRangeMeta {
  viewMode: 'by_department'
  departments: Array<{
    departmentName: string
    orderCount: number
    menuBreakdown: MenuBreakdownItem[]
  }>
}

export interface ApiDailyByMenuResponse extends DateRangeMeta {
  viewMode: 'by_menu'
  items: Array<{ menuItemName: string; orderCount: number }>
}

export interface ApiDailyByLocationResponse extends DateRangeMeta {
  viewMode: 'by_location'
  locations: Array<{
    locationName: string
    orderCount: number
    menuBreakdown: MenuBreakdownItem[]
  }>
}

export interface ApiWeeklyEmployeeRow {
  employeeName: string
  departmentName: string | null
  days: Record<string, { menuItemName: string; cost: number } | null>
  totalOrders: number
  totalCost: number
}

export interface ApiWeeklyReportResponse {
  weekStart: string | null
  dateFrom: string | null
  dateTo: string | null
  days: string[]
  employees: ApiWeeklyEmployeeRow[]
  companyOrders: Record<string, { menuItemName: string; quantity: number; cost: number }>
  totals: { orders: number; cost: number }
}

export interface ApiMonthlyEmployeeRow {
  employeeId: string
  employeeName: string
  departmentId: string | null
  departmentName: string | null
  orderCount: number
  totalCost: number
  menuBreakdown: Array<{
    menuItemId: string
    menuItemName: string
    quantity: number
    unitPrice: number
    subtotal: number
  }>
}

export interface ApiMonthlyReportResponse {
  month: string
  employees: ApiMonthlyEmployeeRow[]
  companyOrders: {
    orderCount: number
    totalCost: number
    menuBreakdown: Array<{
      menuItemName: string
      quantity: number
      unitPrice: number
      subtotal: number
    }>
  }
  notDelivered: {
    count: number
    totalValue: number
    items: Array<{ employeeName: string | null; menuItemName: string; date: string }>
  }
  totals: { orders: number; cost: number }
}

export interface ApiYtdResponse {
  year: number
  months: Array<{ month: string; cost: number }>
  runningTotal: number
}

export interface ApiNotDeliveredSummaryResponse {
  dateFrom: string | null
  dateTo: string | null
  requests: Array<{
    requestId: string
    submittedAt: string
    affectedOrderCount: number
    totalValue: number
    status: 'pending' | 'approved' | 'rejected'
  }>
  totals: { requestCount: number; totalValue: number }
}

export interface ApiCancellationLogResponse {
  dateFrom: string | null
  dateTo: string | null
  entries: Array<{
    orderId: string
    employeeName: string | null
    menuItemName: string
    orderDate: string
    cancelledAt: string
    cancelledByName: string | null
  }>
}

export interface ApiCompanyByLocationResponse {
  dateFrom: string | null
  dateTo: string | null
  locations: Array<{
    locationName: string
    totalOrders: number
    departments: Array<{
      departmentName: string
      totalOrders: number
      menuBreakdown: MenuBreakdownItem[]
    }>
  }>
}

export const reportsApi = {
  dailyByDepartment: (params: Omit<DailyReportQuery, 'viewMode'> = {}) =>
    apiClient
      .get<ApiDailyByDepartmentResponse>('/company-admin/reports/daily', {
        params: { ...params, viewMode: 'by_department' },
      })
      .then(unwrap<ApiDailyByDepartmentResponse>),

  dailyByMenu: (params: Omit<DailyReportQuery, 'viewMode'> = {}) =>
    apiClient
      .get<ApiDailyByMenuResponse>('/company-admin/reports/daily', {
        params: { ...params, viewMode: 'by_menu' },
      })
      .then(unwrap<ApiDailyByMenuResponse>),

  dailyByLocation: (params: Omit<DailyReportQuery, 'viewMode'> = {}) =>
    apiClient
      .get<ApiDailyByLocationResponse>('/company-admin/reports/daily', {
        params: { ...params, viewMode: 'by_location' },
      })
      .then(unwrap<ApiDailyByLocationResponse>),

  weekly: (params: WeeklyReportQuery = {}) =>
    apiClient
      .get<ApiWeeklyReportResponse>('/company-admin/reports/weekly', { params })
      .then(unwrap<ApiWeeklyReportResponse>),

  monthly: (params: MonthlyReportQuery) =>
    apiClient
      .get<ApiMonthlyReportResponse>('/company-admin/reports/monthly', { params })
      .then(unwrap<ApiMonthlyReportResponse>),

  ytd: (params: YtdReportQuery = {}) =>
    apiClient
      .get<ApiYtdResponse>('/company-admin/reports/ytd', { params })
      .then(unwrap<ApiYtdResponse>),

  notDeliveredSummary: (params: RangeReportQuery = {}) =>
    apiClient
      .get<ApiNotDeliveredSummaryResponse>('/company-admin/reports/not-delivered-summary', {
        params,
      })
      .then(unwrap<ApiNotDeliveredSummaryResponse>),

  cancellationLog: (params: RangeReportQuery = {}) =>
    apiClient
      .get<ApiCancellationLogResponse>('/company-admin/reports/cancellation-log', { params })
      .then(unwrap<ApiCancellationLogResponse>),

  byLocation: (params: RangeReportQuery = {}) =>
    apiClient
      .get<ApiCompanyByLocationResponse>('/company-admin/reports/by-location', { params })
      .then(unwrap<ApiCompanyByLocationResponse>),
}
