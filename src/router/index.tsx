import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import EmployeesPage from '@/pages/employees/EmployeesPage'
import EmployeeImportPage from '@/pages/employees/EmployeeImportPage'
import DepartmentsPage from '@/pages/departments/DepartmentsPage'
import LocationsPage from '@/pages/locations/LocationsPage'
import MenusPage from '@/pages/menus/MenusPage'
import OrdersPage from '@/pages/orders/OrdersPage'
import OrderCreatePage from '@/pages/orders/OrderCreatePage'
import NotDeliveredPage from '@/pages/not-delivered/NotDeliveredPage'
import NotDeliveredCreatePage from '@/pages/not-delivered/NotDeliveredCreatePage'
import ReportsLayout from '@/pages/reports/ReportsLayout'
import DailyReportPage from '@/pages/reports/DailyReportPage'
import WeeklyReportPage from '@/pages/reports/WeeklyReportPage'
import MonthlyReportPage from '@/pages/reports/MonthlyReportPage'
import YtdReportPage from '@/pages/reports/YtdReportPage'
import NotDeliveredSummaryPage from '@/pages/reports/NotDeliveredSummaryPage'
import DailyStatusPage from '@/pages/reports/DailyStatusPage'
import CancellationLogPage from '@/pages/reports/CancellationLogPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import AuditLogPage from '@/pages/settings/AuditLogPage'
import AdminsPage from '@/pages/settings/AdminsPage'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'

function Placeholder({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        title="Coming soon"
        description={`The ${title} page will be built in a later stage.`}
      />
    </>
  )
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },

          // Management
          { path: '/employees', element: <EmployeesPage /> },
          { path: '/employees/import', element: <EmployeeImportPage /> },
          { path: '/departments', element: <DepartmentsPage /> },
          { path: '/locations', element: <LocationsPage /> },

          // Operations
          { path: '/menus', element: <MenusPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/orders/create', element: <OrderCreatePage /> },
          { path: '/not-delivered', element: <NotDeliveredPage /> },
          { path: '/not-delivered/create', element: <NotDeliveredCreatePage /> },

          // Reports
          { path: '/reports', element: <Navigate to="/reports/daily" replace /> },
          {
            element: <ReportsLayout />,
            children: [
              { path: '/reports/daily', element: <DailyReportPage /> },
              { path: '/reports/weekly', element: <WeeklyReportPage /> },
              { path: '/reports/monthly', element: <MonthlyReportPage /> },
              { path: '/reports/ytd', element: <YtdReportPage /> },
              { path: '/reports/not-delivered-summary', element: <NotDeliveredSummaryPage /> },
              { path: '/reports/daily-status', element: <DailyStatusPage /> },
              { path: '/reports/cancellations', element: <CancellationLogPage /> },
            ],
          },

          // Account
          { path: '/settings', element: <SettingsPage /> },
          { path: '/settings/admins', element: <AdminsPage /> },
          { path: '/settings/audit-log', element: <AuditLogPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
