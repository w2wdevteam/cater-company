import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { CalendarIcon } from 'lucide-react'
import { format, parse } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from './calendar'

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const isValidDate = selected && !isNaN(selected.getTime())

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
            !value && 'text-gray-400',
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          {isValidDate ? format(selected, 'MMM d, yyyy') : <span>{placeholder}</span>}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 rounded-md border bg-white p-0 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={isValidDate ? selected : undefined}
            onSelect={(date) => {
              if (date) {
                onChange?.(format(date, 'yyyy-MM-dd'))
              } else {
                onChange?.('')
              }
              setOpen(false)
            }}
            defaultMonth={isValidDate ? selected : undefined}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

interface MonthPickerProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function MonthPicker({ value, onChange, className }: MonthPickerProps) {
  const [open, setOpen] = useState(false)

  const currentDate = value ? parse(value + '-01', 'yyyy-MM-dd', new Date()) : new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]

  const [viewYear, setViewYear] = useState(year)

  function handleSelect(m: number) {
    const val = `${viewYear}-${String(m + 1).padStart(2, '0')}`
    onChange?.(val)
    setOpen(false)
  }

  return (
    <Popover.Root open={open} onOpenChange={(o) => { setOpen(o); if (o) setViewYear(year) }}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
            !value && 'text-gray-400',
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          {value ? format(currentDate, 'MMMM yyyy') : 'Pick a month'}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-64 rounded-md border bg-white p-3 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          align="start"
          sideOffset={4}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-medium">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => handleSelect(i)}
                className={cn(
                  'rounded-md px-2 py-1.5 text-sm transition-colors',
                  i === month && viewYear === year
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-gray-100 text-gray-700',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
