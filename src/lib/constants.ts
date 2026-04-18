export const ORDER_STATUSES = {
  new: 'New',
  rejected: 'Rejected',
  on_the_way: 'On the Way',
  arrived: 'Arrived',
  delivered: 'Delivered',
  not_delivered: 'Not Delivered',
} as const

export type OrderStatus = keyof typeof ORDER_STATUSES

export const DELIVERY_STATUSES = {
  idle: 'Idle',
  on_the_way: 'On the Way',
  arrived: 'Arrived',
  delivered: 'Delivered',
} as const

export type DeliveryStatus = keyof typeof DELIVERY_STATUSES

export const REQUEST_STATUSES = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export type RequestStatus = keyof typeof REQUEST_STATUSES

export const EMPLOYEE_STATUSES = {
  active: 'Active',
  inactive: 'Inactive',
} as const

export type EmployeeStatus = keyof typeof EMPLOYEE_STATUSES

export const DELIVERY_BLOCKED_STATUSES: DeliveryStatus[] = [
  'on_the_way',
  'arrived',
  'delivered',
]
