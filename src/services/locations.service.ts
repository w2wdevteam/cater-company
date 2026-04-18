import type { Location, LocationFormData } from '@/types/common.types'

const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Main Office',
    address: '123 Corporate Ave, Suite 100, New York, NY 10001',
    lat: 40.7484,
    lng: -73.9857,
  },
  {
    id: 'loc-2',
    name: 'Building B - Cafeteria',
    address: '125 Corporate Ave, Ground Floor, New York, NY 10001',
    lat: 40.7488,
    lng: -73.9855,
  },
  {
    id: 'loc-3',
    name: 'Warehouse Office',
    address: '200 Industrial Blvd, Brooklyn, NY 11201',
    lat: 40.6892,
    lng: -73.9857,
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getLocations(): Promise<Location[]> {
  await delay(500)
  return mockLocations
}

export async function createLocation(data: LocationFormData): Promise<Location> {
  await delay(400)
  return { id: String(Date.now()), ...data }
}

export async function updateLocation(id: string, data: LocationFormData): Promise<Location> {
  await delay(400)
  const existing = mockLocations.find((l) => l.id === id)
  return { ...existing!, ...data }
}

export async function deleteLocation(id: string): Promise<void> {
  await delay(400)
  void id
}
