import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Papa from 'papaparse'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/common/PageHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useImportEmployees } from '@/hooks/useEmployees'
import type { EmployeeImportRow, EmployeeImportError } from '@/types/employee.types'

type MappableField = 'name' | 'phone' | 'department' | 'skip'
const FIELD_OPTIONS: { value: MappableField; label: string }[] = [
  { value: 'skip', label: 'Skip' },
  { value: 'name', label: 'Name' },
  { value: 'phone', label: 'Phone' },
  { value: 'department', label: 'Department' },
]

const STEPS = ['Upload', 'Map Columns', 'Validate', 'Import']

export default function EmployeeImportPage() {
  usePageTitle('Bulk Import')

  const [step, setStep] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<string[][]>([])
  const [columnMap, setColumnMap] = useState<MappableField[]>([])
  const [parsedRows, setParsedRows] = useState<EmployeeImportRow[]>([])
  const [errors, setErrors] = useState<EmployeeImportError[]>([])
  const importMutation = useImportEmployees()

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.name.endsWith('.csv')) processFile(f)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }, [])

  function processFile(f: File) {
    setFile(f)
    Papa.parse<string[]>(f, {
      skipEmptyLines: true,
      complete: (result) => {
        setRawData(result.data)
        const headers = result.data[0] ?? []
        setColumnMap(
          headers.map((h) => {
            const lower = h.toLowerCase().trim()
            if (lower.includes('name')) return 'name'
            if (lower.includes('phone') || lower.includes('mobile')) return 'phone'
            if (lower.includes('dept') || lower.includes('department')) return 'department'
            return 'skip'
          }),
        )
        setStep(1)
      },
    })
  }

  function handleMapColumn(index: number, value: MappableField) {
    setColumnMap((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const nameIdx = columnMap.indexOf('name')
  const phoneIdx = columnMap.indexOf('phone')
  const canProceedMapping = nameIdx !== -1 && phoneIdx !== -1

  function runValidation() {
    const dataRows = rawData.slice(1)
    const deptIdx = columnMap.indexOf('department')
    const rows: EmployeeImportRow[] = []
    const errs: EmployeeImportError[] = []

    dataRows.forEach((row, i) => {
      const name = nameIdx >= 0 ? row[nameIdx]?.trim() : ''
      const phone = phoneIdx >= 0 ? row[phoneIdx]?.trim() : ''
      const department = deptIdx >= 0 ? row[deptIdx]?.trim() : undefined

      if (!name) errs.push({ row: i + 2, message: 'Name is missing' })
      if (!phone) errs.push({ row: i + 2, message: 'Phone number is missing' })

      rows.push({ name, phone, department })
    })

    setParsedRows(rows)
    setErrors(errs)
    setStep(2)
  }

  function handleImport() {
    const validRows = parsedRows.filter((r) => r.name && r.phone)
    importMutation.mutate(validRows, {
      onSuccess: (result) => {
        toast.success(`${result.imported} employees imported`)
        setStep(3)
      },
    })
  }

  const errorRowNumbers = new Set(errors.map((e) => e.row))

  return (
    <>
      <PageHeader
        title="Bulk Import"
        subtitle="Import employees from a CSV file"
        actions={
          <Button variant="outline" asChild>
            <Link to="/employees">
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </Link>
          </Button>
        }
      />

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium',
                i < step
                  ? 'bg-primary-600 text-white'
                  : i === step
                    ? 'border-2 border-primary-600 text-primary-600'
                    : 'border border-gray-300 text-gray-400',
              )}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-sm',
                i <= step ? 'font-medium text-gray-900' : 'text-gray-400',
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-px w-8 bg-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Upload */}
      {step === 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-16 text-center transition-colors hover:border-primary-400"
        >
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-700">
            Drag and drop your CSV file here
          </p>
          <p className="mt-1 text-xs text-gray-500">or</p>
          <label className="mt-3 cursor-pointer">
            <Button variant="outline" asChild>
              <span>Browse file</span>
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Step 1: Column Mapping */}
      {step === 1 && (
        <div>
          {file && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {rawData[0]?.map((header, i) => (
                    <th key={i} className="px-4 py-2">
                      <div className="space-y-1.5">
                        <p className="text-xs text-gray-500">{header}</p>
                        <Select
                          value={columnMap[i]}
                          onValueChange={(v) =>
                            handleMapColumn(i, v as MappableField)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rawData.slice(1, 6).map((row, i) => (
                  <tr key={i} className="border-b">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 text-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!canProceedMapping && (
            <p className="mt-3 text-sm text-amber-600">
              Please map both Name and Phone columns before proceeding.
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={runValidation} disabled={!canProceedMapping}>
              Validate
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Validation */}
      {step === 2 && (
        <div>
          {errors.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.length} error{errors.length > 1 ? 's' : ''} found. Fix
                your CSV and re-upload.
              </div>

              <div className="mb-4 space-y-1">
                {errors.map((err, i) => (
                  <p key={i} className="text-sm text-red-600">
                    Row {err.row}: {err.message}
                  </p>
                ))}
              </div>

              <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Row
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawData.slice(1).map((row, i) => (
                      <tr
                        key={i}
                        className={cn(
                          'border-b',
                          errorRowNumbers.has(i + 2) && 'bg-red-50',
                        )}
                      >
                        <td className="px-4 py-2 text-gray-500">{i + 2}</td>
                        <td className="px-4 py-2">
                          {nameIdx >= 0 ? row[nameIdx] : '—'}
                        </td>
                        <td className="px-4 py-2">
                          {phoneIdx >= 0 ? row[phoneIdx] : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => { setStep(0); setFile(null); setRawData([]) }}>
                  Re-upload
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {parsedRows.length} employees ready to import
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleImport} disabled={importMutation.isPending}>
                  {importMutation.isPending ? 'Importing…' : 'Import'}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h3 className="mt-3 text-lg font-semibold text-gray-900">
            Import Complete
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {parsedRows.length} employees were imported successfully.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/employees">Back to Employees</Link>
          </Button>
        </div>
      )}
    </>
  )
}
