'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0
  if (Array.isArray(obj)) return obj.reduce((s: number, v) => s + countKeys(v), 0)
  return Object.keys(obj).length + Object.values(obj).reduce((s: number, v) => s + countKeys(v), 0)
}

function maxDepth(obj: unknown, d = 0): number {
  if (typeof obj !== 'object' || obj === null) return d
  const children = Array.isArray(obj) ? obj : Object.values(obj)
  return children.reduce((max: number, v) => Math.max(max, maxDepth(v, d + 1)), d)
}

function validate(json: string): { parsed: unknown; error: string; formatted: string } {
  try {
    const parsed = JSON.parse(json)
    return { parsed, error: '', formatted: JSON.stringify(parsed, null, 2) }
  } catch (e) {
    return { parsed: null, error: (e as Error).message, formatted: '' }
  }
}

function byteSize(s: string): string {
  const b = new TextEncoder().encode(s).length
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`
}

export default function JsonValidator() {
  const t = useTranslations('tools.json-validator')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const { parsed, error, formatted } = useMemo(() => (input.trim() ? validate(input) : { parsed: null, error: '', formatted: '' }), [input])

  function copy() {
    navigator.clipboard.writeText(formatted)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isValid = input.trim() && !error
  const isInvalid = input.trim() && !!error

  return (
    <div className="space-y-6">
      {/* Status badge */}
      {input.trim() && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isValid ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          <span className={`text-lg ${isValid ? 'text-green-600' : 'text-red-500'}`}>{isValid ? '✓' : '✗'}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${isValid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {isValid ? t('valid') : t('invalid')}
            </p>
            {isInvalid && <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 font-mono truncate">{error}</p>}
          </div>
          {isValid && (
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 shrink-0">
              <span>{countKeys(parsed)} {t('keys')}</span>
              <span>{maxDepth(parsed)} {t('depth')}</span>
              <span>{byteSize(input)}</span>
            </div>
          )}
        </div>
      )}

      {/* Textarea */}
      <textarea value={input} onChange={(e) => setInput(e.target.value)}
        placeholder={t('placeholder')} rows={18} spellCheck={false}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400" />

      {isValid && (
        <button onClick={copy}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {copied ? t('copied') : t('copy')}
        </button>
      )}
    </div>
  )
}
