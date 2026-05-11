import { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees'
import { useDepartmentOptions } from '@/hooks/useDepartments'
import { getLocations } from '@/services/locations.service'
import type { Employee } from '@/types/employee.types'

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  employeeId: z.string().optional(),
  departmentId: z.string().optional(),
  role: z.string().optional(),
  locationId: z.string().optional(),
})

type FormValues = z.infer<typeof employeeSchema>

interface EmployeeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee | null
}

export default function EmployeeSheet({
  open,
  onOpenChange,
  employee,
}: EmployeeSheetProps) {
  const isEdit = !!employee
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  })
  const departments = useDepartmentOptions()
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()
  const mutation = isEdit ? updateMutation : createMutation

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      employeeId: '',
      departmentId: '',
      role: '',
      locationId: '',
    },
  })

  useEffect(() => {
    if (open && employee) {
      reset({
        name: employee.name,
        phone: employee.phone,
        email: employee.email ?? '',
        employeeId: employee.employeeId ?? '',
        departmentId: employee.departmentId ?? '',
        role: employee.role ?? '',
        locationId: employee.locationId ?? '',
      })
    } else if (open) {
      reset({ name: '', phone: '', email: '', employeeId: '', departmentId: '', role: '', locationId: '' })
    }
  }, [open, employee, reset])

  function onSubmit(values: FormValues) {
    const data = {
      ...values,
      email: values.email || undefined,
      employeeId: values.employeeId || undefined,
      departmentId: values.departmentId || undefined,
      role: values.role || undefined,
      locationId: values.locationId || undefined,
    }

    if (isEdit) {
      updateMutation.mutate(
        { id: employee!.id, data },
        {
          onSuccess: () => {
            toast.success('Employee updated')
            onOpenChange(false)
          },
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Employee created')
          onOpenChange(false)
        },
      })
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l bg-white shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {isEdit ? 'Edit Employee' : 'Add Employee'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-sm text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col overflow-y-auto"
            >
              <div className="flex-1 space-y-4 p-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register('name')} className="mt-1.5" />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" {...register('phone')} className="mt-1.5" />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1.5"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    {...register('employeeId')}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    {...register('role')}
                    className="mt-1.5"
                    placeholder="e.g. Manager, Developer"
                  />
                </div>

                <div>
                  <Label>Department</Label>
                  <Controller
                    name="departmentId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || '_none'}
                        onValueChange={(v) => field.onChange(v === '_none' ? '' : v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">No department</SelectItem>
                          {departments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label>Location</Label>
                  <Controller
                    name="locationId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || '_none'}
                        onValueChange={(v) => field.onChange(v === '_none' ? '' : v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">No location</SelectItem>
                          {locations?.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
                <Dialog.Close asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending
                    ? 'Saving…'
                    : isEdit
                      ? 'Update'
                      : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
