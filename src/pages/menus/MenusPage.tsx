import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Info, UtensilsCrossed, ImageOff } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ErrorBanner from '@/components/common/ErrorBanner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { getMenus } from '@/services/menus.service'

export default function MenusPage() {
  usePageTitle('Menus')

  const [selectedIdx, setSelectedIdx] = useState(1)

  const { data: menuDays, isLoading, isError, refetch } = useQuery({
    queryKey: ['menus'],
    queryFn: getMenus,
  })

  const selectedDay = menuDays?.[selectedIdx]

  return (
    <>
      <PageHeader title="Menus" />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Menu items are published by your catering company.
      </div>

      {isError ? (
        <ErrorBanner message="Failed to load menus." onRetry={refetch} />
      ) : isLoading ? (
        <>
          <div className="mb-6 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <div className="aspect-video animate-pulse bg-gray-200" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 flex gap-1 overflow-x-auto">
            {menuDays?.map((day, idx) => (
              <button
                key={day.date}
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  'shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  idx === selectedIdx
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                )}
              >
                {day.label}
              </button>
            ))}
          </div>

          {selectedDay && selectedDay.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {selectedDay.items.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-gray-100">
                      <ImageOff className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UtensilsCrossed}
              title="No menu published"
              description="No menu has been published for this date yet."
            />
          )}
        </>
      )}
    </>
  )
}
