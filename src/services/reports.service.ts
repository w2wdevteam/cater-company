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
      costTotal: 480000,
      employees: [
        { employeeName: 'John Smith', menuItemName: 'Grilled Chicken Bowl', cost: 32000, notDelivered: false },
        { employeeName: 'Mike Chen', menuItemName: 'Beef Stroganoff', cost: 38000, notDelivered: false },
        { employeeName: 'Tom Wilson', menuItemName: 'Caesar Salad', cost: 25000, notDelivered: true },
        { employeeName: 'Lisa Wang', menuItemName: 'Pasta Primavera', cost: 30000, notDelivered: false },
      ],
    },
    {
      departmentName: 'Marketing',
      orderCount: 10,
      costTotal: 260000,
      employees: [
        { employeeName: 'Sarah Johnson', menuItemName: 'Caesar Salad', cost: 25000, notDelivered: false },
        { employeeName: 'Jessica Lee', menuItemName: 'Veggie Wrap', cost: 24000, notDelivered: false },
        { employeeName: 'Emily Davis', menuItemName: 'Pasta Primavera', cost: 30000, notDelivered: true },
      ],
    },
    {
      departmentName: 'Sales',
      orderCount: 8,
      costTotal: 210000,
      employees: [
        { employeeName: 'Alex Turner', menuItemName: 'Fish & Chips', cost: 35000, notDelivered: false },
        { employeeName: 'David Brown', menuItemName: 'Grilled Chicken Bowl', cost: 32000, notDelivered: false },
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
    { employeeName: 'John Smith', departmentName: 'Engineering', orderCount: 18, menuBreakdown: 'Chicken Bowl ×6, Beef Stroganoff ×5, Caesar Salad ×4, Fish & Chips ×3', totalCost: 585000 },
    { employeeName: 'Mike Chen', departmentName: 'Engineering', orderCount: 16, menuBreakdown: 'Beef Stroganoff ×7, Chicken Bowl ×5, Veggie Wrap ×4', totalCost: 522000 },
    { employeeName: 'Sarah Johnson', departmentName: 'Marketing', orderCount: 14, menuBreakdown: 'Caesar Salad ×6, Veggie Wrap ×5, Pasta Primavera ×3', totalCost: 360000 },
    { employeeName: 'Alex Turner', departmentName: 'Sales', orderCount: 15, menuBreakdown: 'Fish & Chips ×6, Chicken Bowl ×5, Pasta Primavera ×4', totalCost: 490000 },
    { employeeName: 'David Brown', departmentName: 'Sales', orderCount: 12, menuBreakdown: 'Chicken Bowl ×8, Beef Stroganoff ×4', totalCost: 408000 },
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
    {
      menuItemName: 'Grilled Chicken Bowl',
      price: 32000,
      orderCount: 8,
      costTotal: 256000,
      employees: [
        { employeeName: 'John Smith', departmentName: 'Engineering', notDelivered: false },
        { employeeName: 'David Brown', departmentName: 'Sales', notDelivered: false },
        { employeeName: 'Rachel Kim', departmentName: 'HR', notDelivered: false },
      ],
    },
    {
      menuItemName: 'Caesar Salad',
      price: 25000,
      orderCount: 6,
      costTotal: 150000,
      employees: [
        { employeeName: 'Sarah Johnson', departmentName: 'Marketing', notDelivered: false },
        { employeeName: 'Tom Wilson', departmentName: 'Engineering', notDelivered: true },
      ],
    },
    {
      menuItemName: 'Beef Stroganoff',
      price: 38000,
      orderCount: 5,
      costTotal: 190000,
      employees: [
        { employeeName: 'Mike Chen', departmentName: 'Engineering', notDelivered: false },
        { employeeName: 'Alex Turner', departmentName: 'Sales', notDelivered: false },
      ],
    },
    {
      menuItemName: 'Pasta Primavera',
      price: 30000,
      orderCount: 4,
      costTotal: 120000,
      employees: [
        { employeeName: 'Lisa Wang', departmentName: 'Engineering', notDelivered: false },
        { employeeName: 'Emily Davis', departmentName: 'Marketing', notDelivered: true },
      ],
    },
    {
      menuItemName: 'Fish & Chips',
      price: 35000,
      orderCount: 5,
      costTotal: 175000,
      employees: [
        { employeeName: 'Alex Turner', departmentName: 'Sales', notDelivered: false },
        { employeeName: 'David Brown', departmentName: 'Sales', notDelivered: false },
      ],
    },
    {
      menuItemName: 'Veggie Wrap',
      price: 24000,
      orderCount: 5,
      costTotal: 120000,
      employees: [
        { employeeName: 'Jessica Lee', departmentName: 'Marketing', notDelivered: false },
      ],
    },
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
      costTotal: 720000,
      departments: [
        {
          departmentName: 'Engineering',
          orderCount: 15,
          costTotal: 480000,
          employees: [
            { employeeName: 'John Smith', menuItemName: 'Grilled Chicken Bowl', cost: 32000, notDelivered: false },
            { employeeName: 'Mike Chen', menuItemName: 'Beef Stroganoff', cost: 38000, notDelivered: false },
            { employeeName: 'Tom Wilson', menuItemName: 'Caesar Salad', cost: 25000, notDelivered: true },
            { employeeName: 'Lisa Wang', menuItemName: 'Pasta Primavera', cost: 30000, notDelivered: false },
          ],
        },
        {
          departmentName: 'Marketing',
          orderCount: 7,
          costTotal: 240000,
          employees: [
            { employeeName: 'Sarah Johnson', menuItemName: 'Caesar Salad', cost: 25000, notDelivered: false },
            { employeeName: 'Jessica Lee', menuItemName: 'Veggie Wrap', cost: 24000, notDelivered: false },
          ],
        },
      ],
    },
    {
      locationName: 'Building B - Cafeteria',
      orderCount: 8,
      costTotal: 260000,
      departments: [
        {
          departmentName: 'Sales',
          orderCount: 6,
          costTotal: 210000,
          employees: [
            { employeeName: 'Alex Turner', menuItemName: 'Fish & Chips', cost: 35000, notDelivered: false },
            { employeeName: 'David Brown', menuItemName: 'Grilled Chicken Bowl', cost: 32000, notDelivered: false },
          ],
        },
        {
          departmentName: 'HR',
          orderCount: 2,
          costTotal: 50000,
          employees: [
            { employeeName: 'Rachel Kim', menuItemName: 'Caesar Salad', cost: 25000, notDelivered: false },
          ],
        },
      ],
    },
    {
      locationName: 'Warehouse Office',
      orderCount: 3,
      costTotal: 102000,
      departments: [
        {
          departmentName: 'Operations',
          orderCount: 3,
          costTotal: 102000,
          employees: [
            { employeeName: 'James Park', menuItemName: 'Beef Stroganoff', cost: 38000, notDelivered: false },
            { employeeName: 'Nina Patel', menuItemName: 'Grilled Chicken Bowl', cost: 32000, notDelivered: false },
          ],
        },
      ],
    },
  ]
}
