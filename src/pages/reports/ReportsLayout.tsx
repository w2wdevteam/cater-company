import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const reportLinks = [
  { to: '/reports/daily', label: 'Daily Report' },
  { to: '/reports/weekly', label: 'Weekly Report' },
  { to: '/reports/monthly', label: 'Monthly Report' },
  { to: '/reports/ytd', label: 'Year-to-Date' },
  { to: '/reports/not-delivered-summary', label: 'Not Delivered' },
  { to: '/reports/daily-status', label: 'Daily Status' },
  { to: '/reports/cancellations', label: 'Cancellations' },
]

export default function ReportsLayout() {
  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b">
        {reportLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
