import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  importEmployees,
} from '@/services/employees.service'
import type { EmployeeFilters, EmployeeFormData, EmployeeImportRow } from '@/types/employee.types'
import type { EmployeeStatus } from '@/lib/constants'

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => getEmployees(filters),
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EmployeeFormData) => createEmployee(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      updateEmployee(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useUpdateEmployeeStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EmployeeStatus }) =>
      updateEmployeeStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useImportEmployees() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (rows: EmployeeImportRow[]) => importEmployees(rows),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  })
}
