'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

type Delim = ',' | '\t' | ';'

function parseCsv(csv: string, delim: Delim, hasHeader: boolean): { json: string; rows: number; cols: number; error: string } {
  try {
    const lines = csv.trim().split('\n').map((l) => l.split(delim).map((c) => c.trim().replace(/^"|"$/g, '')))
    if (lines.length === 0) return { json: '', rows: 0, cols: 0, error: '' }

    let result: unknown[]
    if (hasHeader) {
      const headers = lines[0]
      result = lines.slice(1).map((row) => {
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
        return obj
      })
    } else {
      result = lines.map((row) => row)
    }

    return {
      json: JSON.stringify(result, null, 2),
      rows: result.length,
      cols: lines[0].length,
      error: '',
    }
  } catch (e) {
    return { json: '', rows: 0, cols: 0, error: (e as Error).message }
  }
}

const DELIMITERS: { value: Delim; key: string }[] = [
  { value: ',', key: 'comma' },
  { value: '\t', key: 'tab' },
  { value: ';', key: 'semicolon' },
]

export default function CsvToJson() {
  const t = useTranslations('tools.csv-to-json')
  const [input, setInput] = useState('')
  const [delim, setDelim] = useState<Delim>(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [copied, setCopied] = useState(false)

  const { json, rows, cols, error } = useMemo(
    () => (input.trim() ? parseCsv(input, delim, hasHeader) : { json: '', rows: 0, cols: 0, error: '' }),
    [input, delim, hasHeader]
  )

  function copy() {
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 items-center">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('delimiterLabel')}</p>
          <div className="flex gap-2">
            {DELIMITERS.map(({ value, key }) => (
              <button key={key} onClick={() => setDelim(value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${delim === value ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300'}`}>
                {t(key)}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="sr-only" />
          <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${hasHeader ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${hasHeader ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('headerRow')}</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')} rows={14} spellCheck={false}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
            {rows > 0 && <span className="text-xs text-gray-400">{rows} {t('rows')} · {cols} {t('cols')}</span>}
          </div>
          <textarea value={error || json} readOnly rows={14} placeholder={t('outputPlaceholder')}
            className={`w-full rounded-xl border px-4 py-3 text-sm font-mono resize-none focus:outline-none placeholder:text-gray-400 ${error ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`} />
        </div>
      </div>

      {json && !error && (
        <button onClick={copy}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {copied ? t('copied') : t('copy')}
        </button>
      )}
    </div>
  )
}
