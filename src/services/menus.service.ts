import { addDays, subDays, format } from 'date-fns'
import type { MenuDay } from '@/types/menu.types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildMockMenus(): MenuDay[] {
  const today = new Date()

  return [
    {
      date: format(subDays(today, 1), 'yyyy-MM-dd'),
      label: 'Yesterday',
      items: [
        { id: 'm0a', name: 'Chicken Shawarma Plate', price: 35000 },
        { id: 'm0b', name: 'Minestrone Soup & Bread', price: 25000 },
        { id: 'm0c', name: 'Steak Burrito Bowl', price: 38000 },
        { id: 'm0d', name: 'Garden Salad', price: 22000 },
      ],
    },
    {
      date: format(today, 'yyyy-MM-dd'),
      label: 'Today',
      items: [
        { id: 'm1', name: 'Grilled Chicken Bowl', price: 32000 },
        { id: 'm2', name: 'Caesar Salad', price: 25000 },
        { id: 'm3', name: 'Beef Stroganoff', price: 38000 },
        { id: 'm4', name: 'Veggie Wrap', price: 24000 },
        { id: 'm5', name: 'Pasta Primavera', price: 30000 },
        { id: 'm6', name: 'Fish & Chips', price: 35000 },
      ],
    },
    {
      date: format(addDays(today, 1), 'yyyy-MM-dd'),
      label: 'Tomorrow',
      items: [
        { id: 'm7', name: 'Teriyaki Salmon', price: 40000 },
        { id: 'm8', name: 'Mushroom Risotto', price: 33000 },
        { id: 'm9', name: 'BBQ Pulled Pork Sandwich', price: 30000 },
        { id: 'm10', name: 'Greek Salad', price: 23000 },
      ],
    },
    {
      date: format(addDays(today, 2), 'yyyy-MM-dd'),
      label: format(addDays(today, 2), 'EEE, MMM d'),
      items: [
        { id: 'm11', name: 'Chicken Tikka Masala', price: 35000 },
        { id: 'm12', name: 'Falafel Plate', price: 28000 },
        { id: 'm13', name: 'Spaghetti Bolognese', price: 30000 },
        { id: 'm14', name: 'Tuna Poke Bowl', price: 39000 },
        { id: 'm15', name: 'Margherita Pizza', price: 27000 },
      ],
    },
    {
      date: format(addDays(today, 3), 'yyyy-MM-dd'),
      label: format(addDays(today, 3), 'EEE, MMM d'),
      items: [
        { id: 'm16', name: 'Lamb Kofta Wrap', price: 33000 },
        { id: 'm17', name: 'Quinoa Power Bowl', price: 29000 },
        { id: 'm18', name: 'Crispy Chicken Burger', price: 28000 },
      ],
    },
    {
      date: format(addDays(today, 4), 'yyyy-MM-dd'),
      label: format(addDays(today, 4), 'EEE, MMM d'),
      items: [],
    },
  ]
}

export async function getMenus(): Promise<MenuDay[]> {
  await delay(700)
  return buildMockMenus()
}
