import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  UtensilsCrossed,
  ShoppingCart,
  PackageX,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Activity,
  XCircle,
  Settings,
  ClipboardList,
  Shield,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useMyCompany } from '@/hooks/useMyCompany'
import { Button } from '@/components/ui/button'

interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navigation: (NavItem | NavGroup)[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    title: 'Management',
    items: [
      { label: 'Employees', path: '/employees', icon: Users },
      { label: 'Departments', path: '/departments', icon: Building2 },
      { label: 'Locations', path: '/locations', icon: MapPin },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Menus', path: '/menus', icon: UtensilsCrossed },
      { label: 'Orders', path: '/orders', icon: ShoppingCart },
      {
        label: 'Not Delivered',
        path: '/not-delivered',
        icon: PackageX,
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Daily Report', path: '/reports/daily', icon: CalendarDays },
      { label: 'Weekly Report', path: '/reports/weekly', icon: CalendarRange },
      {
        label: 'Monthly Report',
        path: '/reports/monthly',
        icon: CalendarCheck,
      },
      { label: 'Year-to-Date', path: '/reports/ytd', icon: TrendingUp },
      {
        label: 'Not Delivered',
        path: '/reports/not-delivered-summary',
        icon: AlertTriangle,
      },
      { label: 'Daily Status', path: '/reports/daily-status', icon: Activity },
      {
        label: 'Cancellations',
        path: '/reports/cancellations',
        icon: XCircle,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', path: '/settings', icon: Settings },
      { label: 'Admins', path: '/settings/admins', icon: Shield },
      { label: 'Audit Log', path: '/settings/audit-log', icon: ClipboardList },
    ],
  },
]

function isGroup(item: NavItem | NavGroup): item is NavGroup {
  return 'items' in item
}

export default function Sidebar() {
  const location = useLocation()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebar)
  const profileCompanyName = useAuthStore((s) => s.user?.companyName ?? 'Company')
  const { data: company } = useMyCompany()
  const companyName = company?.name ?? profileCompanyName
  const logoUrl = company?.logoUrl ?? null

  function isActive(path: string) {
    if (path === '/dashboard') return location.pathname === '/dashboard'
    if (path === '/settings') return location.pathname === '/settings'
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-white transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 items-center border-b px-4',
          collapsed ? 'justify-center' : 'gap-3',
        )}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="h-8 w-8 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
        )}
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-gray-900">
            {companyName}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navigation.map((item, i) => {
          if (isGroup(item)) {
            return (
              <div key={item.title} className={cn(i > 0 && 'mt-4')}>
                {!collapsed && (
                  <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {item.title}
                  </p>
                )}
                {collapsed && i > 0 && (
                  <div className="mx-3 mb-2 border-t" />
                )}
                <div className="space-y-0.5">
                  {item.items.map((nav) => (
                    <NavLink
                      key={nav.path}
                      item={nav}
                      active={isActive(nav.path)}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </div>
            )
          }
          return (
            <NavLink
              key={item.path}
              item={item}
              active={isActive(item.path)}
              collapsed={collapsed}
            />
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn('w-full', collapsed ? 'justify-center' : 'justify-start')}
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="ml-2 text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        collapsed && 'justify-center px-0',
        active
          ? 'bg-primary-50 text-primary-600'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      )}
    >
      <Icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-primary-600')} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )
}
