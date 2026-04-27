import { useQuery } from '@tanstack/react-query'
import {
  ShoppingCart,
  UserX,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatCard from '@/components/common/StatCard'
import EmptyState from '@/components/common/EmptyState'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency } from '@/lib/utils'
import {
  getTodayStats,
  getTodayMenu,
  type MenuItem,
} from '@/services/dashboard.service'

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-14 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

function MenuCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="h-32 w-full animate-pulse bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-32 w-full object-cover"
        />
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-gray-100">
          <UtensilsCrossed className="h-8 w-8 text-gray-300" />
        </div>
      )}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900">{item.name}</p>
        <p className="mt-0.5 text-sm text-primary-600 font-semibold">
          {formatCurrency(item.price)}
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  usePageTitle('Dashboard')

  const statsQuery = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getTodayStats,
  })

  const menuQuery = useQuery({
    queryKey: ['todayMenu'],
    queryFn: getTodayMenu,
  })

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Today's overview"
      />

      {statsQuery.isError && (
        <div className="mb-4">
          <ErrorBanner message="Failed to load dashboard stats." onRetry={() => statsQuery.refetch()} />
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsQuery.isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Today's Orders"
              value={statsQuery.data?.todayOrderCount ?? 0}
              icon={ShoppingCart}
              iconColor="text-primary-600"
              iconBg="bg-primary-100"
            />
            <StatCard
              label="Not Yet Ordered"
              value={statsQuery.data?.employeesNotOrdered ?? 0}
              icon={UserX}
              iconColor="text-amber-600"
              iconBg="bg-amber-100"
              subLabel="employees without an order today"
            />
            <StatCard
              label="Active Employees"
              value={statsQuery.data?.totalActiveEmployees ?? 0}
              icon={Users}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
          </>
        )}
      </div>

      {/* Today's Menu */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900">Today's Menu</h2>
        {menuQuery.isError ? (
          <div className="mt-4">
            <ErrorBanner message="Failed to load today's menu." onRetry={() => menuQuery.refetch()} />
          </div>
        ) : menuQuery.isLoading ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        ) : menuQuery.data && menuQuery.data.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {menuQuery.data.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              icon={UtensilsCrossed}
              title="No menu available for today"
              description="The caterer hasn't published a menu for today yet."
            />
          </div>
        )}
      </div>
    </>
  )
}
