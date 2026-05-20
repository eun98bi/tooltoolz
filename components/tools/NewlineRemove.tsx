'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

type Mode = 'removeAll' | 'replaceSpace' | 'collapseBlank' | 'removeBlank' | 'crlf2lf' | 'lf2crlf' | 'custom'

function convert(text: string, mode: Mode, custom: string): string {
  // Normalize CRLF first for consistent processing (except lf2crlf mode)
  const normalized = mode === 'lf2crlf' ? text : text.replace(/\r\n/g, '\n')

  switch (mode) {
    case 'removeAll':
      return normalized.replace(/\n/g, '')
    case 'replaceSpace':
      return normalized.replace(/\n+/g, ' ').trim()
    case 'collapseBlank':
      return normalized.replace(/\n{3,}/g, '\n\n')
    case 'removeBlank':
      return normalized
        .split('\n')
        .filter((line) => line.trim() !== '')
        .join('\n')
    case 'crlf2lf':
      return text.replace(/\r\n/g, '\n')
    case 'lf2crlf':
      return text.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n')
    case 'custom':
      return normalized.replace(/\n/g, custom)
    default:
      return text
  }
}

const MODES: Mode[] = ['removeAll', 'replaceSpace', 'collapseBlank', 'removeBlank', 'crlf2lf', 'lf2crlf', 'custom']

export default function NewlineRemove() {
  const t = useTranslations('tools.newline-remove')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('removeAll')
  const [custom, setCustom] = useState('')
  const [copied, setCopied] = useState(false)

  const output = useMemo(
    () => (input ? convert(input, mode, custom) : ''),
    [input, mode, custom]
  )

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('modeLabel')}</p>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              {t(`modes.${m}`)}
            </button>
          ))}
        </div>

        {/* Custom replacement input */}
        {mode === 'custom' && (
          <div className="flex items-center gap-3 pt-1">
            <label className="text-sm text-gray-600 dark:text-gray-400 shrink-0">
              {t('customLabel')}
            </label>
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder={t('customPlaceholder')}
              className="flex-1 max-w-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
            />
          </div>
        )}
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            rows={14}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            rows={14}
            placeholder={t('outputPlaceholder')}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Copy */}
      {output && (
        <button
          onClick={copy}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {copied ? t('copied') : t('copy')}
        </button>
      )}
    </div>
  )
}
