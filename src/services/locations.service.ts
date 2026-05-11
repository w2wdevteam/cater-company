import { locationsApi, type ApiLocation } from '@/api/endpoints/locations.api'
import type { Location, LocationFormData } from '@/types/common.types'
import { useAuthStore } from '@/store/auth.store'

function mapLocation(l: ApiLocation): Location {
  return {
    id: l.id,
    name: l.name,
    address: l.address,
    lat: l.lat ?? undefined,
    lng: l.lng ?? undefined,
    isHeadquarter: l.isHeadquarter,
  }
}

function getCompanyId(): string {
  const id = useAuthStore.getState().user?.companyId
  if (!id) throw new Error('Not authenticated')
  return id
}

export async function getLocations(): Promise<Location[]> {
  const result = await locationsApi.list({ status: 'active', limit: 100 })
  return result.data.map(mapLocation)
}

export async function createLocation(data: LocationFormData): Promise<Location> {
  const created = await locationsApi.create({
    name: data.name,
    address: data.address,
    lat: data.lat,
    lng: data.lng,
    companyId: getCompanyId(),
    isHeadquarter: data.isHeadquarter,
  })
  return mapLocation(created)
}

export async function updateLocation(id: string, data: LocationFormData): Promise<Location> {
  const updated = await locationsApi.update(id, {
    name: data.name,
    address: data.address,
    lat: data.lat,
    lng: data.lng,
    isHeadquarter: data.isHeadquarter,
  })
  return mapLocation(updated)
}

export async function deleteLocation(id: string): Promise<void> {
  await locationsApi.setStatus(id, 'inactive')
}
