export interface MenuItem {
  id: string
  name: string
  price: number
  image?: string
  description?: string
}

export interface MenuDay {
  date: string
  label: string
  items: MenuItem[]
}
