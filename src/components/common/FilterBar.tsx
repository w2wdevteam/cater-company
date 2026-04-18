import type { ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface FilterBarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

export default function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters,
  actions,
  hasActiveFilters = false,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {onSearchChange && (
        <div className="relative w-60">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      )}

      {filters}

      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}

      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  )
}
