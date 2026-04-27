import { useQuery } from '@tanstack/react-query'
import { getDepartments } from '@/services/departments.service'

export interface DepartmentOption {
  id: string
  name: string
}

/**
 * Lightweight source for department dropdowns. Mirrors the old mock shape
 * (`{ id, name }[]`) that several pages depend on so the filter Selects keep
 * working without a page-level rewrite.
 */
export function useDepartmentOptions() {
  const { data = [] } = useQuery<DepartmentOption[]>({
    queryKey: ['departments', 'options'],
    queryFn: async () => {
      const rows = await getDepartments()
      return rows.map((d) => ({ id: d.id, name: d.name }))
    },
    staleTime: 5 * 60 * 1000,
  })
  return data
}
