import { useEffect, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LocationPicker from '@/components/common/LocationPicker'
import { cn } from '@/lib/utils'
import type { Location } from '@/types/common.types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  isHeadquarter: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

interface LocationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location?: Location | null
  onSubmit: (values: FormValues) => void
  loading?: boolean
}

export default function LocationSheet({
  open,
  onOpenChange,
  location,
  onSubmit,
  loading,
}: LocationSheetProps) {
  const isEdit = !!location

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', address: '', lat: undefined, lng: undefined, isHeadquarter: false },
  })

  const currentLat = watch('lat')
  const currentLng = watch('lng')

  useEffect(() => {
    if (open && location) {
      reset({
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        isHeadquarter: location.isHeadquarter,
      })
    } else if (open) {
      reset({ name: '', address: '', lat: undefined, lng: undefined, isHeadquarter: false })
    }
  }, [open, location, reset])

  const handleLocationSelect = useCallback(
    (loc: { lat: number; lng: number; address: string }) => {
      setValue('address', loc.address, { shouldValidate: true })
      setValue('lat', loc.lat)
      setValue('lng', loc.lng)
    },
    [setValue],
  )

  const mapValue =
    currentLat != null && currentLng != null
      ? { lat: currentLat, lng: currentLng }
      : null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l bg-white shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {isEdit ? 'Edit Location' : 'Add Location'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-sm text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 space-y-4 p-6">
                <div>
                  <Label htmlFor="loc-name">Location Name *</Label>
                  <Input id="loc-name" {...register('name')} className="mt-1.5" />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label>Pick Location on Map</Label>
                  <div className="mt-1.5">
                    <LocationPicker
                      value={mapValue}
                      onLocationSelect={handleLocationSelect}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="loc-address">Address *</Label>
                  <Input
                    id="loc-address"
                    {...register('address')}
                    className="mt-1.5"
                    readOnly
                    placeholder="Select a location on the map above"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
                  )}
                </div>

                {(() => {
                  const isCurrentHq = isEdit && !!location?.isHeadquarter
                  return (
                    <label
                      htmlFor="loc-hq"
                      className={cn(
                        'flex items-start gap-2.5 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5',
                        isCurrentHq ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100',
                      )}
                    >
                      <input
                        id="loc-hq"
                        type="checkbox"
                        {...register('isHeadquarter')}
                        disabled={isCurrentHq}
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-default disabled:opacity-70"
                      />
                      <span className="text-sm">
                        <span className="font-medium text-gray-900">
                          {isCurrentHq ? 'Current company headquarter' : 'Set as company headquarter'}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {isCurrentHq
                            ? 'To change the headquarter, edit another location and set it as HQ.'
                            : 'This becomes the default delivery location for employees who have no personal or department location set.'}
                        </span>
                      </span>
                    </label>
                  )
                })()}
              </div>

              <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
                <Dialog.Close asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
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
  )
}
