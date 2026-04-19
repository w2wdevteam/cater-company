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


function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getDailyReport(_params?: {
  date?: string
  from?: string
  to?: string
  department?: string
}): Promise<DailyReportDepartment[]> {
  await delay(600)
  return [
    {
      departmentName: 'Engineering',
      orderCount: 15,
      menuItems: [
        { menuItemName: 'Grilled Chicken Bowl', orderCount: 5 },
        { menuItemName: 'Beef Stroganoff', orderCount: 4 },
        { menuItemName: 'Caesar Salad', orderCount: 3 },
        { menuItemName: 'Pasta Primavera', orderCount: 3 },
      ],
    },
    {
      departmentName: 'Marketing',
      orderCount: 10,
      menuItems: [
        { menuItemName: 'Caesar Salad', orderCount: 4 },
        { menuItemName: 'Veggie Wrap', orderCount: 3 },
        { menuItemName: 'Pasta Primavera', orderCount: 3 },
      ],
    },
    {
      departmentName: 'Sales',
      orderCount: 8,
      menuItems: [
        { menuItemName: 'Fish & Chips', orderCount: 4 },
        { menuItemName: 'Grilled Chicken Bowl', orderCount: 4 },
      ],
    },
  ]
}

export async function getWeeklyReport(_params?: {
  from?: string
  to?: string
  department?: string
}): Promise<WeeklyReportRow[]> {
  await delay(600)
  return [
    {
      employeeName: 'John Smith',
      departmentName: 'Engineering',
      days: {
        Mon: { menuItemName: 'Chicken Bowl', notDelivered: false },
        Tue: { menuItemName: 'Caesar Salad', notDelivered: false },
        Wed: null,
        Thu: { menuItemName: 'Beef Stroganoff', notDelivered: false },
        Fri: { menuItemName: 'Fish & Chips', notDelivered: true },
      },
      totalOrders: 4,
      totalCost: 130000,
    },
    {
      employeeName: 'Sarah Johnson',
      departmentName: 'Marketing',
      days: {
        Mon: { menuItemName: 'Veggie Wrap', notDelivered: false },
        Tue: null,
        Wed: { menuItemName: 'Pasta Primavera', notDelivered: false },
        Thu: { menuItemName: 'Caesar Salad', notDelivered: false },
        Fri: null,
      },
      totalOrders: 3,
      totalCost: 79000,
    },
    {
      employeeName: 'Mike Chen',
      departmentName: 'Engineering',
      days: {
        Mon: { menuItemName: 'Beef Stroganoff', notDelivered: false },
        Tue: { menuItemName: 'Chicken Bowl', notDelivered: false },
        Wed: { menuItemName: 'Fish & Chips', notDelivered: false },
        Thu: null,
        Fri: { menuItemName: 'Veggie Wrap', notDelivered: false },
      },
      totalOrders: 4,
      totalCost: 129000,
    },
    {
      employeeName: 'Alex Turner',
      departmentName: 'Sales',
      days: {
        Mon: null,
        Tue: { menuItemName: 'Chicken Bowl', notDelivered: false },
        Wed: { menuItemName: 'Caesar Salad', notDelivered: true },
        Thu: { menuItemName: 'Pasta Primavera', notDelivered: false },
        Fri: { menuItemName: 'Fish & Chips', notDelivered: false },
      },
      totalOrders: 4,
      totalCost: 122000,
    },
  ]
}

export async function getMonthlyReport(_params?: {
  month?: string
  department?: string
}): Promise<MonthlyReportRow[]> {
  await delay(600)
  return [
    {
      employeeName: 'John Smith', departmentName: 'Engineering', orderCount: 18, totalCost: 585000,
      menuItems: [
        { menuItemName: 'Chicken Bowl', orderCount: 6 },
        { menuItemName: 'Beef Stroganoff', orderCount: 5 },
        { menuItemName: 'Caesar Salad', orderCount: 4 },
        { menuItemName: 'Fish & Chips', orderCount: 3 },
      ],
    },
    {
      employeeName: 'Mike Chen', departmentName: 'Engineering', orderCount: 16, totalCost: 522000,
      menuItems: [
        { menuItemName: 'Beef Stroganoff', orderCount: 7 },
        { menuItemName: 'Chicken Bowl', orderCount: 5 },
        { menuItemName: 'Veggie Wrap', orderCount: 4 },
      ],
    },
    {
      employeeName: 'Sarah Johnson', departmentName: 'Marketing', orderCount: 14, totalCost: 360000,
      menuItems: [
        { menuItemName: 'Caesar Salad', orderCount: 6 },
        { menuItemName: 'Veggie Wrap', orderCount: 5 },
        { menuItemName: 'Pasta Primavera', orderCount: 3 },
      ],
    },
    {
      employeeName: 'Alex Turner', departmentName: 'Sales', orderCount: 15, totalCost: 490000,
      menuItems: [
        { menuItemName: 'Fish & Chips', orderCount: 6 },
        { menuItemName: 'Chicken Bowl', orderCount: 5 },
        { menuItemName: 'Pasta Primavera', orderCount: 4 },
      ],
    },
    {
      employeeName: 'David Brown', departmentName: 'Sales', orderCount: 12, totalCost: 408000,
      menuItems: [
        { menuItemName: 'Chicken Bowl', orderCount: 8 },
        { menuItemName: 'Beef Stroganoff', orderCount: 4 },
      ],
    },
  ]
}

export async function getYtdReport(): Promise<YtdRow[]> {
  await delay(600)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let running = 0
  return months.map((month, i) => {
    if (i > 3) return { month, orderCount: null, totalCost: null, runningTotal: null }
    const count = [320, 295, 340, 180][i]
    const cost = [10240000, 9440000, 10880000, 5760000][i]
    running += cost
    return { month, orderCount: count, totalCost: cost, runningTotal: running }
  })
}

export async function getNotDeliveredSummary(_params?: {
  from?: string
  to?: string
}): Promise<NotDeliveredSummaryRow[]> {
  await delay(600)
  return [
    { date: '2026-04-16', affectedOrders: 2, totalValue: 57000, status: 'approved' },
    { date: '2026-04-15', affectedOrders: 1, totalValue: 38000, status: 'pending' },
    { date: '2026-04-14', affectedOrders: 3, totalValue: 92000, status: 'rejected' },
    { date: '2026-04-10', affectedOrders: 1, totalValue: 32000, status: 'approved' },
    { date: '2026-04-07', affectedOrders: 4, totalValue: 130000, status: 'approved' },
  ]
}

export async function getDailyStatus(): Promise<DailyStatusData> {
  await delay(500)
  return {
    ordered: [
      { employeeName: 'John Smith', menuItemName: 'Grilled Chicken Bowl' },
      { employeeName: 'Sarah Johnson', menuItemName: 'Caesar Salad' },
      { employeeName: 'Mike Chen', menuItemName: 'Beef Stroganoff' },
      { employeeName: 'David Brown', menuItemName: 'Fish & Chips' },
      { employeeName: 'Lisa Wang', menuItemName: 'Pasta Primavera' },
    ],
    notOrdered: [
      { employeeName: 'Emily Davis', departmentName: 'Marketing' },
      { employeeName: 'Alex Turner', departmentName: 'Sales' },
      { employeeName: 'Rachel Kim', departmentName: 'HR' },
    ],
    updatedAt: new Date().toISOString(),
  }
}

export async function getCancellationLog(_params?: {
  from?: string
  to?: string
}): Promise<CancellationRow[]> {
  await delay(600)
  return [
    { employeeName: 'Emily Davis', menuItemName: 'Pasta Primavera', orderDate: '2026-04-17', cancelledAt: '2026-04-17T09:15:00Z' },
    { employeeName: 'Tom Wilson', menuItemName: 'Veggie Wrap', orderDate: '2026-04-16', cancelledAt: '2026-04-16T08:45:00Z' },
    { employeeName: 'Jessica Lee', menuItemName: 'Caesar Salad', orderDate: '2026-04-15', cancelledAt: '2026-04-15T10:00:00Z' },
    { employeeName: 'Alex Turner', menuItemName: 'Chicken Bowl', orderDate: '2026-04-14', cancelledAt: '2026-04-14T09:30:00Z' },
  ]
}

export async function getDailyReportByMenu(_params?: {
  date?: string
  department?: string
}): Promise<DailyReportMenuGroup[]> {
  await delay(600)
  return [
    { menuItemName: 'Grilled Chicken Bowl', orderCount: 8 },
    { menuItemName: 'Caesar Salad', orderCount: 6 },
    { menuItemName: 'Beef Stroganoff', orderCount: 5 },
    { menuItemName: 'Pasta Primavera', orderCount: 4 },
    { menuItemName: 'Fish & Chips', orderCount: 5 },
    { menuItemName: 'Veggie Wrap', orderCount: 5 },
  ]
}

export async function getDailyReportByLocation(_params?: {
  date?: string
}): Promise<DailyReportLocationGroup[]> {
  await delay(600)
  return [
    {
      locationName: 'Main Office',
      orderCount: 22,
      menuItems: [
        { menuItemName: 'Grilled Chicken Bowl', orderCount: 6 },
        { menuItemName: 'Caesar Salad', orderCount: 5 },
        { menuItemName: 'Beef Stroganoff', orderCount: 4 },
        { menuItemName: 'Pasta Primavera', orderCount: 4 },
        { menuItemName: 'Veggie Wrap', orderCount: 3 },
      ],
    },
    {
      locationName: 'Building B - Cafeteria',
      orderCount: 8,
      menuItems: [
        { menuItemName: 'Fish & Chips', orderCount: 4 },
        { menuItemName: 'Grilled Chicken Bowl', orderCount: 2 },
        { menuItemName: 'Caesar Salad', orderCount: 2 },
      ],
    },
    {
      locationName: 'Warehouse Office',
      orderCount: 3,
      menuItems: [
        { menuItemName: 'Beef Stroganoff', orderCount: 1 },
        { menuItemName: 'Grilled Chicken Bowl', orderCount: 1 },
        { menuItemName: 'Veggie Wrap', orderCount: 1 },
      ],
    },
  ]
}
