import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  new: 'bg-status-new-bg text-status-new-text',
  active: 'bg-status-new-bg text-status-new-text',
  delivered: 'bg-status-new-bg text-status-new-text',
  approved: 'bg-status-new-bg text-status-new-text',
  pending: 'bg-status-pending-bg text-status-pending-text',
  on_the_way: 'bg-status-pending-bg text-status-pending-text',
  rejected: 'bg-status-rejected-bg text-status-rejected-text',
  not_delivered: 'bg-status-not-delivered-bg text-status-not-delivered-text',
  inactive: 'bg-status-not-delivered-bg text-gray-500',
  arrived: 'bg-status-arrived-bg text-status-arrived-text',
}

const statusLabels: Record<string, string> = {
  new: 'New',
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  on_the_way: 'On the Way',
  arrived: 'Arrived',
  delivered: 'Delivered',
  not_delivered: 'Not Delivered',
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        statusStyles[status] ?? 'bg-gray-100 text-gray-600',
        className,
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  )
}
