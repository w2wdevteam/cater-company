import { useState } from 'react'
import { FileSpreadsheet, FileText, FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Format = 'excel' | 'csv' | 'pdf'

interface ExportButtonsProps {
  onExport?: (format: Format) => Promise<void>
}

export default function ExportButtons({ onExport }: ExportButtonsProps) {
  const [loading, setLoading] = useState<Format | null>(null)

  async function handleExport(format: Format) {
    setLoading(format)
    try {
      if (onExport) {
        await onExport(format)
      } else {
        await new Promise((r) => setTimeout(r, 800))
      }
      toast.success(`${format.toUpperCase()} file downloaded.`)
    } finally {
      setLoading(null)
    }
  }

  const formats: { key: Format; label: string; icon: typeof FileSpreadsheet }[] = [
    { key: 'excel', label: 'Excel', icon: FileSpreadsheet },
    { key: 'csv', label: 'CSV', icon: FileText },
    { key: 'pdf', label: 'PDF', icon: FileDown },
  ]

  return (
    <div className="flex gap-2">
      {formats.map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant="outline"
          size="sm"
          onClick={() => handleExport(key)}
          disabled={loading !== null}
        >
          {loading === key ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
          {label}
        </Button>
      ))}
    </div>
  )
}
