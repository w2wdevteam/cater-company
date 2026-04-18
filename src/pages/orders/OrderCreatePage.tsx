import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, AlertTriangle, Search } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus'
import { usePlaceOrder } from '@/hooks/useOrders'
import { DELIVERY_BLOCKED_STATUSES } from '@/lib/constants'
import { formatCurrency, cn } from '@/lib/utils'
import { getEmployees } from '@/services/employees.service'
import { getTodayMenu, type MenuItem } from '@/services/dashboard.service'

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
  const [menuItemId, setMenuItemId] = useState('')

  const { data: employeesData } = useQuery({
    queryKey: ['employees', 'all', employeeSearch],
    queryFn: () => getEmployees({ search: employeeSearch, status: 'active', limit: 50 }),
  })

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['todayMenu'],
    queryFn: getTodayMenu,
  })

  const selectedEmployee = employeesData?.data.find((e) => e.id === employeeId)
  const selectedMenuItem = menuItems?.find((m: MenuItem) => m.id === menuItemId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (blocked) return
    if (!menuItemId) return
    if (!isCompanyLevel && !employeeId) return

    placeMut.mutate(
      { employeeId: isCompanyLevel ? undefined : employeeId, menuItemId, isCompanyLevel },
      { onSuccess: () => navigate('/orders') },
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
            <p className="mt-0.5 text-amber-700">Orders can no longer be placed for today.</p>
          </div>
        </div>
      )}

      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Order for</Label>
            <div className="mt-1.5 flex gap-2">
              <button
                type="button"
                disabled={blocked}
                onClick={() => { setIsCompanyLevel(false); setEmployeeId('') }}
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
                onClick={() => { setIsCompanyLevel(true); setEmployeeId('') }}
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
            <div>
              <Label>Employee</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.departmentName ?? 'No dept'})` : employeeSearch}
                  onChange={(e) => {
                    setEmployeeSearch(e.target.value)
                    setEmployeeId('')
                    setShowEmployeeDropdown(true)
                  }}
                  onFocus={() => setShowEmployeeDropdown(true)}
                  placeholder="Search employee…"
                  className="pl-9"
                  disabled={blocked}
                />
                {showEmployeeDropdown && !employeeId && employeesData && employeesData.data.length > 0 && (
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
                        <span className="text-xs text-gray-500">{emp.departmentName ?? '—'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <Label>Menu Item</Label>
            {menuLoading ? (
              <div className="mt-1.5 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-md bg-gray-100" />
                ))}
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <div className="mt-1.5 space-y-2">
                {menuItems.map((item: MenuItem) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={blocked}
                    onClick={() => setMenuItemId(item.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors',
                      menuItemId === item.id
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                      blocked && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-gray-500">{formatCurrency(item.price)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-gray-500">No menu items available for today.</p>
            )}
          </div>

          {selectedMenuItem && (
            <div className="rounded-md bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-500">Total: </span>
              <span className="font-semibold text-gray-900">{formatCurrency(selectedMenuItem.price)}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={blocked || placeMut.isPending || !menuItemId || (!isCompanyLevel && !employeeId)}
            className="w-full"
          >
            {placeMut.isPending ? 'Placing Order…' : 'Confirm Order'}
          </Button>
        </form>
      </div>
    </>
  )
}
