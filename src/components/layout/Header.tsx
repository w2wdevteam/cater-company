import { useLocation } from 'react-router-dom'
import { ChevronRight, LogOut, Truck, User } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DELIVERY_STATUSES, type DeliveryStatus } from '@/lib/constants'
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus'

const deliveryStatusStyles: Record<DeliveryStatus, string> = {
  idle: 'bg-gray-100 text-gray-600',
  on_the_way: 'bg-amber-100 text-amber-700 animate-pulse-slow',
  arrived: 'bg-status-arrived-bg text-status-arrived-text',
  delivered: 'bg-status-new-bg text-status-new-text',
}

function DeliveryStatusBadge() {
  const { data, isLoading } = useDeliveryStatus()

  if (isLoading) {
    return <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
  }

  const status = data?.status ?? 'idle'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        deliveryStatusStyles[status],
      )}
    >
      <Truck className="h-3.5 w-3.5" />
      {DELIVERY_STATUSES[status]}
    </span>
  )
}

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/employees/create': 'Create Employee',
  '/employees/import': 'Bulk Import',
  '/departments': 'Departments',
  '/locations': 'Locations',
  '/menus': 'Menus',
  '/orders': 'Orders',
  '/orders/create': 'Place Order',
  '/not-delivered': 'Not Delivered Requests',
  '/not-delivered/create': 'New Request',
  '/reports/daily': 'Daily Report',
  '/reports/weekly': 'Weekly Report',
  '/reports/monthly': 'Monthly Report',
  '/reports/ytd': 'Year-to-Date',
  '/reports/not-delivered-summary': 'Not Delivered Summary',
  '/reports/daily-status': 'Daily Order Status',
  '/reports/cancellations': 'Cancellation Log',
  '/settings': 'Settings',
  '/settings/admins': 'Admins',
  '/settings/audit-log': 'Audit Log',
}

function getBreadcrumbs(pathname: string) {
  const crumbs: { label: string; path: string }[] = []

  if (routeLabels[pathname]) {
    const segments = pathname.split('/').filter(Boolean)
    let built = ''
    for (const seg of segments) {
      built += '/' + seg
      const label = routeLabels[built]
      if (label) crumbs.push({ label, path: built })
    }
  }

  if (crumbs.length === 0) {
    crumbs.push({ label: 'Dashboard', path: '/dashboard' })
  }

  return crumbs
}

export default function Header() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const crumbs = getBreadcrumbs(location.pathname)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
            <span
              className={
                i === crumbs.length - 1
                  ? 'font-medium text-gray-900'
                  : 'text-gray-500'
              }
            >
              {c.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <DeliveryStatusBadge />

        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden text-sm font-medium text-gray-700 sm:inline-block">
              {user?.fullName ?? 'Admin'}
            </span>
          </Button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                <div className="border-b px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.phone}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
