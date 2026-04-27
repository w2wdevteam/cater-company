import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator } from '@/components/ui/select'
import { getLocations, createLocation } from '@/services/locations.service'
import { getApiErrorMessage } from '@/lib/api-errors'
import type { Department, LocationFormData } from '@/types/common.types'
import LocationSheet from '@/pages/locations/LocationSheet'

const CREATE_NEW = '__create_new__'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().optional(),
  contactPerson: z.string().optional(),
  buildingNotes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface DepartmentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department?: Department | null
  onSubmit: (values: FormValues) => void
  loading?: boolean
}

export default function DepartmentSheet({
  open,
  onOpenChange,
  department,
  onSubmit,
  loading,
}: DepartmentSheetProps) {
  const isEdit = !!department
  const qc = useQueryClient()

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  })

  const [locationSheetOpen, setLocationSheetOpen] = useState(false)

  const createLocMut = useMutation({
    mutationFn: (data: LocationFormData) => createLocation(data),
    onSuccess: (newLoc) => {
      qc.invalidateQueries({ queryKey: ['locations'] })
      toast.success('Location created')
      setLocationSheetOpen(false)
      setValue('location', newLoc.name)
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to create location')),
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', location: '', contactPerson: '', buildingNotes: '' },
  })

  useEffect(() => {
    if (open && department) {
      reset({
        name: department.name,
        location: department.location ?? '',
        contactPerson: department.contactPerson ?? '',
        buildingNotes: department.buildingNotes ?? '',
      })
    } else if (open) {
      reset({ name: '', location: '', contactPerson: '', buildingNotes: '' })
    }
  }, [open, department, reset])

  function handleSelectChange(value: string) {
    if (value === CREATE_NEW) {
      setLocationSheetOpen(true)
    } else {
      setValue('location', value)
    }
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l bg-white shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {isEdit ? 'Edit Department' : 'Add Department'}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="rounded-sm text-gray-400 hover:text-gray-500" aria-label="Close">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex-1 space-y-4 p-6">
                  <div>
                    <Label htmlFor="dept-name">Name *</Label>
                    <Input id="dept-name" {...register('name')} className="mt-1.5" />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dept-location">Location</Label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || '_none'}
                          onValueChange={(val) => {
                            if (val === CREATE_NEW) {
                              handleSelectChange(val)
                            } else {
                              field.onChange(val === '_none' ? '' : val)
                            }
                          }}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">No location</SelectItem>
                            {locations?.map((loc) => (
                              <SelectItem key={loc.id} value={loc.name}>
                                {loc.name}
                              </SelectItem>
                            ))}
                            <SelectSeparator />
                            <SelectItem value={CREATE_NEW}>+ Create new location</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dept-contact">Contact Person</Label>
                    <Input id="dept-contact" {...register('contactPerson')} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="dept-notes">Building / Floor Notes</Label>
                    <Input id="dept-notes" {...register('buildingNotes')} className="mt-1.5" placeholder="e.g. 3rd Floor, Wing B" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
                  <Dialog.Close asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                  </Dialog.Close>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving…' : isEdit ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <LocationSheet
        open={locationSheetOpen}
        onOpenChange={setLocationSheetOpen}
        onSubmit={(values) => createLocMut.mutate(values)}
        loading={createLocMut.isPending}
      />
    </>
  )
}
