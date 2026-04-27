import { format } from 'date-fns'
import { menusApi, type ApiMenuDay } from '@/api/endpoints/menus.api'
import type { MenuDay } from '@/types/menu.types'

function labelFor(dateStr: string, isToday: boolean): string {
  if (isToday) return 'Today'
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (dateStr === format(tomorrow, 'yyyy-MM-dd')) return 'Tomorrow'
  if (dateStr === format(yesterday, 'yyyy-MM-dd')) return 'Yesterday'
  return format(new Date(dateStr), 'EEE, MMM d')
}

function mapDay(day: ApiMenuDay): MenuDay {
  return {
    date: day.date,
    label: labelFor(day.date, day.isToday),
    items: day.items.map((i) => ({
      id: i.menuItemId,
      name: i.name,
      price: i.effectivePrice ?? i.price,
      image: i.imageUrl ?? undefined,
      description: i.description ?? undefined,
    })),
  }
}

export async function getMenus(): Promise<MenuDay[]> {
  const res = await menusApi.range()
  return res.days.map(mapDay)
}
