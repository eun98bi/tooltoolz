'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

type Mode = 'escape' | 'unescape'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function unescapeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => {
      const map: Record<string, string> = { nbsp: ' ', copy: '©', reg: '®', trade: '™', mdash: '—', ndash: '–' }
      return map[name.toLowerCase()] ?? match
    })
}

export default function HtmlEscape() {
  const t = useTranslations('tools.html-escape')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('escape')
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!input) return ''
    return mode === 'escape' ? escapeHtml(input) : unescapeHtml(input)
  }, [input, mode])

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['escape', 'unescape'] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === m ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300'}`}>
            {t(m)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')} rows={14}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
          <textarea value={output} readOnly rows={14} placeholder={t('outputPlaceholder')}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none placeholder:text-gray-400" />
        </div>
      </div>

      {output && (
        <button onClick={copy}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {copied ? t('copied') : t('copy')}
        </button>
      )}
    </div>
  )
}
