import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowLeft,
  Minus,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/common/PageHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus'
import { usePlaceOrder } from '@/hooks/useOrders'
import { DELIVERY_BLOCKED_STATUSES } from '@/lib/constants'
import { cn, formatCurrency } from '@/lib/utils'
import { getApiErrorMessage } from '@/lib/api-errors'
import { getEmployees } from '@/services/employees.service'
import { getTodayMenu, type MenuItem } from '@/services/dashboard.service'
import MenuItemCard from './MenuItemCard'

interface CartItem {
  menuItemId: string
  quantity: number
}

export default function OrderCreatePage() {
  usePageTitle('Place Order')

  const navigate = useNavigate()
  const { data: deliveryData } = useDeliveryStatus()
  const placeMut = usePlaceOrder()

  const blocked = deliveryData
    ? DELIVERY_BLOCKED_STATUSES.includes(deliveryData.status)
    : false

  const [isCompanyLevel, setIsCompanyLevel] = useState(false)
  const [employeeId, setEmployeeId] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  const { data: employeesData } = useQuery({
    queryKey: ['employees', 'all', employeeSearch],
    queryFn: () => getEmployees({ search: employeeSearch, status: 'active', limit: 50 }),
  })

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['todayMenu'],
    queryFn: getTodayMenu,
  })

  const selectedEmployee = employeesData?.data.find((e) => e.id === employeeId)

  const menuById = useMemo(() => {
    const map = new Map<string, MenuItem>()
    ;(menuItems ?? []).forEach((m) => map.set(m.id, m))
    return map
  }, [menuItems])

  function setQuantity(menuItemId: string, quantity: number) {
    // Employee mode: one employee may only place one order — cart holds at most
    // one item at quantity 1, and picking a new item replaces the current one.
    if (!isCompanyLevel) {
      if (quantity <= 0) {
        setCart((prev) => prev.filter((it) => it.menuItemId !== menuItemId))
      } else {
        setCart([{ menuItemId, quantity: 1 }])
      }
      return
    }

    setCart((prev) => {
      if (quantity <= 0) return prev.filter((it) => it.menuItemId !== menuItemId)
      const existing = prev.find((it) => it.menuItemId === menuItemId)
      if (existing) {
        return prev.map((it) =>
          it.menuItemId === menuItemId ? { ...it, quantity } : it,
        )
      }
      return [...prev, { menuItemId, quantity }]
    })
  }

  function removeItem(menuItemId: string) {
    setCart((prev) => prev.filter((it) => it.menuItemId !== menuItemId))
  }

  const totalItems = cart.reduce((sum, it) => sum + it.quantity, 0)
  const totalAmount = cart.reduce((sum, it) => {
    const price = menuById.get(it.menuItemId)?.price ?? 0
    return sum + price * it.quantity
  }, 0)

  const canSubmit =
    !blocked &&
    !submitting &&
    cart.length > 0 &&
    (isCompanyLevel || !!employeeId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    const failures: { menuItemId: string; message: string }[] = []

    for (const item of cart) {
      try {
        await placeMut.mutateAsync({
          menuItemId: item.menuItemId,
          employeeId: isCompanyLevel ? undefined : employeeId,
          isCompanyLevel,
          quantity: item.quantity,
        })
      } catch (err) {
        failures.push({
          menuItemId: item.menuItemId,
          message: getApiErrorMessage(err, 'Failed to place order'),
        })
      }
    }

    setSubmitting(false)

    const succeeded = cart.length - failures.length
    if (failures.length === 0) {
      toast.success(
        succeeded === 1 ? 'Order placed successfully' : `${succeeded} orders placed`,
      )
      navigate('/orders')
      return
    }

    if (succeeded === 0) {
      toast.error(failures[0]?.message ?? 'Failed to place orders')
    } else {
      toast.warning(`${succeeded} placed, ${failures.length} failed`)
    }
    setCart((prev) =>
      prev.filter((it) => failures.some((f) => f.menuItemId === it.menuItemId)),
    )
  }

  return (
    <>
      <PageHeader
        title="Place Order"
        actions={
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        }
      />

      {blocked && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Delivery is already in progress</p>
            <p className="mt-0.5 text-amber-700">
              Orders can no longer be placed for today.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Order for</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={blocked}
                  onClick={() => {
                    setIsCompanyLevel(false)
                    setEmployeeId('')
                    setCart([])
                  }}
                  className={cn(
                    'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    !isCompanyLevel
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    blocked && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  Employee
                </button>
                <button
                  type="button"
                  disabled={blocked}
                  onClick={() => {
                    setIsCompanyLevel(true)
                    setEmployeeId('')
                    setCart([])
                  }}
                  className={cn(
                    'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    isCompanyLevel
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    blocked && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  Company-level
                </button>
              </div>
            </div>

            {!isCompanyLevel && (
              <div className="space-y-1.5">
                <Label>Employee *</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={
                      selectedEmployee
                        ? `${selectedEmployee.name} (${selectedEmployee.departmentName ?? 'No dept'})`
                        : employeeSearch
                    }
                    onChange={(e) => {
                      setEmployeeSearch(e.target.value)
                      setEmployeeId('')
                      setShowEmployeeDropdown(true)
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)}
                    onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 150)}
                    placeholder="Search employee…"
                    className="pl-9"
                    disabled={blocked}
                  />
                  {showEmployeeDropdown &&
                    !employeeId &&
                    employeesData &&
                    employeesData.data.length > 0 && (
                      <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                        {employeesData.data.map((emp) => (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => {
                              setEmployeeId(emp.id)
                              setEmployeeSearch('')
                              setShowEmployeeDropdown(false)
                            }}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            <span className="font-medium text-gray-900">{emp.name}</span>
                            <span className="text-xs text-gray-500">
                              {emp.departmentName ?? '—'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Menu for today</h2>
                <p className="text-xs text-gray-500">
                  Add one or more items to the order and set their quantities.
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {menuItems?.length ?? 0} item
                {(menuItems?.length ?? 0) === 1 ? '' : 's'}
              </span>
            </div>

            <MenuGrid
              loading={menuLoading}
              items={menuItems ?? []}
              cart={cart}
              disabled={blocked}
              singleSelect={!isCompanyLevel}
              onChange={setQuantity}
            />
          </section>

          <aside className="lg:sticky lg:top-4 h-fit rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Order summary</h2>
              {cart.length > 0 && (
                <span className="text-xs text-gray-500">
                  {totalItems} item{totalItems === 1 ? '' : 's'}
                </span>
              )}
            </div>

            <CartList
              cart={cart}
              menuById={menuById}
              disabled={blocked || submitting}
              singleSelect={!isCompanyLevel}
              onChange={setQuantity}
              onRemove={removeItem}
            />

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {submitting
                  ? 'Placing orders…'
                  : cart.length > 1
                    ? `Place ${cart.length} orders`
                    : 'Place Order'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/orders')}
              >
                Cancel
              </Button>
            </div>
          </aside>
        </div>
      </form>
    </>
  )
}

interface MenuGridProps {
  loading: boolean
  items: MenuItem[]
  cart: CartItem[]
  disabled: boolean
  singleSelect: boolean
  onChange: (menuItemId: string, quantity: number) => void
}

function MenuGrid({ loading, items, cart, disabled, singleSelect, onChange }: MenuGridProps) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <UtensilsCrossed className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-2 text-sm text-gray-600">
          No menu items available for today.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const inCart = cart.find((it) => it.menuItemId === item.id)
        return (
          <MenuItemCard
            key={item.id}
            item={item}
            selectedQuantity={inCart?.quantity ?? 0}
            disabled={disabled}
            singleSelect={singleSelect}
            onChange={(q) => onChange(item.id, q)}
          />
        )
      })}
    </div>
  )
}

interface CartListProps {
  cart: CartItem[]
  menuById: Map<string, MenuItem>
  disabled: boolean
  singleSelect: boolean
  onChange: (menuItemId: string, quantity: number) => void
  onRemove: (menuItemId: string) => void
}

function CartList({ cart, menuById, disabled, singleSelect, onChange, onRemove }: CartListProps) {
  if (cart.length === 0) {
    return (
      <div className="mt-4 rounded-lg bg-gray-50 p-4 text-center">
        <UtensilsCrossed className="mx-auto h-6 w-6 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">No items added yet.</p>
        <p className="text-xs text-gray-400">
          Tap a menu card to add it to the order.
        </p>
      </div>
    )
  }

  return (
    <ul className="mt-4 space-y-2">
      {cart.map((it) => {
        const menuItem = menuById.get(it.menuItemId)
        if (!menuItem) return null
        const subtotal = menuItem.price * it.quantity

        return (
          <li
            key={it.menuItemId}
            className="flex items-center gap-3 rounded-lg bg-gray-50 p-2"
          >
            {menuItem.image ? (
              <img
                src={menuItem.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gray-200 text-gray-400">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {menuItem.name}
              </p>
              <p className="text-xs text-gray-500">
                {singleSelect
                  ? formatCurrency(menuItem.price)
                  : (
                      <>
                        {formatCurrency(menuItem.price)} × {it.quantity} ={' '}
                        <span className="font-medium text-gray-700">
                          {formatCurrency(subtotal)}
                        </span>
                      </>
                    )}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {!singleSelect && (
                <div className="inline-flex items-center rounded-md border bg-white">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(it.menuItemId, it.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-medium">{it.quantity}</span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(it.menuItemId, it.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(it.menuItemId)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
