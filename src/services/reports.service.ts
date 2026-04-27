import { reportsApi } from '@/api/endpoints/reports.api'
import { ordersApi } from '@/api/endpoints/orders.api'
import type {
  DailyReportDepartment,
  DailyReportMenuGroup,
  DailyReportLocationGroup,
  WeeklyReportRow,
  MonthlyReportRow,
  YtdRow,
  NotDeliveredSummaryRow,
  DailyStatusData,
  CancellationRow,
} from '@/types/report.types'
import type { RequestStatus } from '@/lib/constants'

export async function getDailyReport(params?: {
  date?: string
  from?: string
  to?: string
  department?: string
}): Promise<DailyReportDepartment[]> {
  const res = await reportsApi.dailyByDepartment({
    date: params?.date,
    departmentId:
      params?.department && params.department !== 'all' ? params.department : undefined,
  })
  return res.departments.map((d) => ({
    departmentName: d.departmentName,
    orderCount: d.orderCount,
    menuItems: d.menuBreakdown.map((m) => ({
      menuItemName: m.menuItemName,
      orderCount: m.quantity,
    })),
  }))
}

/** Monday of the current ISO week in UTC, as YYYY-MM-DD. Backend requires a Monday. */
function currentMondayUtc(): string {
  const now = new Date()
  const dow = now.getUTCDay() // 0=Sun, 1=Mon, ... 6=Sat
  const daysFromMonday = (dow + 6) % 7 // Mon->0, Sun->6
  const monday = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - daysFromMonday,
  ))
  return monday.toISOString().slice(0, 10)
}

export async function getWeeklyReport(params?: {
  from?: string
  to?: string
  department?: string
}): Promise<WeeklyReportRow[]> {
  // Backend requires either (dateFrom + dateTo) or weekStart. Default to this week's Monday.
  const hasRange = !!(params?.from && params?.to)
  const res = await reportsApi.weekly({
    dateFrom: hasRange ? params?.from : undefined,
    dateTo: hasRange ? params?.to : undefined,
    weekStart: hasRange ? undefined : currentMondayUtc(),
    departmentId:
      params?.department && params.department !== 'all' ? params.department : undefined,
  })
  return res.employees.map((e) => ({
    employeeName: e.employeeName,
    departmentName: e.departmentName ?? '—',
    // Backend does not tag per-day not-delivered on the weekly view; default to false.
    days: Object.fromEntries(
      Object.entries(e.days).map(([day, cell]) => [
        day,
        cell ? { menuItemName: cell.menuItemName, notDelivered: false } : null,
      ]),
    ),
    totalOrders: e.totalOrders,
    totalCost: e.totalCost,
  }))
}

export async function getMonthlyReport(params?: {
  month?: string
  department?: string
}): Promise<MonthlyReportRow[]> {
  // Backend requires `month`; fall back to current month if the page omitted it.
  const month = params?.month ?? new Date().toISOString().slice(0, 7)
  const res = await reportsApi.monthly({
    month,
    departmentId:
      params?.department && params.department !== 'all' ? params.department : undefined,
  })
  return res.employees.map((e) => ({
    employeeName: e.employeeName,
    departmentName: e.departmentName ?? '—',
    orderCount: e.orderCount,
    totalCost: e.totalCost,
    menuItems: e.menuBreakdown.map((m) => ({
      menuItemName: m.menuItemName,
      orderCount: m.quantity,
    })),
  }))
}

export async function getYtdReport(): Promise<YtdRow[]> {
  const res = await reportsApi.ytd()
  // Backend returns cost per month + one year-wide runningTotal. Convert to
  // the FE-shaped row-per-month with a client-computed running total and
  // null orderCount (backend does not expose counts on the YTD view).
  let running = 0
  const nowMonth = new Date().toISOString().slice(0, 7)
  return res.months.map((m) => {
    const isFuture = m.month > nowMonth
    const cost = isFuture ? null : m.cost
    if (cost != null) running += cost
    return {
      month: m.month,
      orderCount: null,
      totalCost: cost,
      runningTotal: cost == null ? null : running,
    }
  })
}

export async function getNotDeliveredSummary(params?: {
  from?: string
  to?: string
}): Promise<NotDeliveredSummaryRow[]> {
  const res = await reportsApi.notDeliveredSummary({
    dateFrom: params?.from,
    dateTo: params?.to,
  })
  return res.requests.map((r) => ({
    date: r.submittedAt.slice(0, 10),
    affectedOrders: r.affectedOrderCount,
    totalValue: r.totalValue,
    status: r.status as RequestStatus,
  }))
}

export async function getDailyStatus(): Promise<DailyStatusData> {
  const res = await ordersApi.todayStatus()
  return {
    ordered: res.ordered.map((o) => ({
      employeeName: o.employeeName,
      menuItemName: o.menuItemName,
    })),
    notOrdered: res.notOrdered.map((o) => ({
      employeeName: o.employeeName,
      departmentName: o.departmentName ?? '—',
    })),
    updatedAt: new Date().toISOString(),
  }
}

export async function getCancellationLog(params?: {
  from?: string
  to?: string
}): Promise<CancellationRow[]> {
  const res = await reportsApi.cancellationLog({
    dateFrom: params?.from,
    dateTo: params?.to,
  })
  return res.entries.map((e) => ({
    employeeName: e.employeeName ?? '—',
    menuItemName: e.menuItemName,
    orderDate: e.orderDate,
    cancelledAt: e.cancelledAt,
  }))
}

export async function getDailyReportByMenu(params?: {
  date?: string
  department?: string
}): Promise<DailyReportMenuGroup[]> {
  const res = await reportsApi.dailyByMenu({
    date: params?.date,
    departmentId:
      params?.department && params.department !== 'all' ? params.department : undefined,
  })
  return res.items
}

export async function getDailyReportByLocation(params?: {
  date?: string
}): Promise<DailyReportLocationGroup[]> {
  const res = await reportsApi.dailyByLocation({ date: params?.date })
  return res.locations.map((l) => ({
    locationName: l.locationName,
    orderCount: l.orderCount,
    menuItems: l.menuBreakdown.map((m) => ({
      menuItemName: m.menuItemName,
      orderCount: m.quantity,
    })),
  }))
}

export interface LocationReportDepartment {
  departmentName: string
  orderCount: number
  menuBreakdown: string
}

export interface LocationReportGroup {
  locationName: string
  departments: LocationReportDepartment[]
}

export async function getLocationReport(params?: {
  from?: string
  to?: string
}): Promise<LocationReportGroup[]> {
  const res = await reportsApi.byLocation({
    dateFrom: params?.from,
    dateTo: params?.to,
  })
  return res.locations.map((l) => ({
    locationName: l.locationName,
    departments: l.departments.map((d) => ({
      departmentName: d.departmentName,
      orderCount: d.totalOrders,
      // Page renders this field as a plain string, so flatten the items.
      menuBreakdown: d.menuBreakdown
        .map((m) => `${m.menuItemName} (${m.quantity})`)
        .join(', '),
    })),
  }))
}
