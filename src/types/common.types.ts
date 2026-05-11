export interface Department {
  id: string
  name: string
  locationId?: string
  location?: string
  contactPerson?: string
  buildingNotes?: string
  employeeCount: number
}

export interface DepartmentFormData {
  name: string
  locationId: string
  contactPerson?: string
  buildingNotes?: string
}

export interface Location {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  isHeadquarter: boolean
}

export interface LocationFormData {
  name: string
  address: string
  lat?: number
  lng?: number
  isHeadquarter?: boolean
}
