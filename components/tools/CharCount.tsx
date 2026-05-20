'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function CharCount() {
  const t = useTranslations('tools.char-count')
  const [text, setText] = useState('')
  const [excludeSpaces, setExcludeSpaces] = useState(false)

  const charCount = excludeSpaces ? text.replace(/\s/g, '').length : text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const lineCount = text ? text.split('\n').length : 0
  const byteCount = new TextEncoder().encode(text).length

  const stats = [
    { label: t('charsFull'), value: charCount, color: 'blue' as const },
    { label: t('wordsFull'), value: wordCount, color: 'green' as const },
    { label: t('linesFull'), value: lineCount, color: 'purple' as const },
    { label: t('bytesFull'), value: byteCount, color: 'amber' as const },
  ]

  const colorMap = {
    blue:   { card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',     num: 'text-blue-600 dark:text-blue-400' },
    green:  { card: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800', num: 'text-green-600 dark:text-green-400' },
    purple: { card: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800', num: 'text-purple-600 dark:text-purple-400' },
    amber:  { card: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800', num: 'text-amber-600 dark:text-amber-400' },
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Textarea */}
        <div className="lg:col-span-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full h-72 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2 px-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeSpaces}
                onChange={(e) => setExcludeSpaces(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              {t('excludeSpaces')}
            </label>
            <button
              onClick={() => setText('')}
              className="text-sm text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              {t('clear')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {stats.map(({ label, value, color }) => {
            const { card, num } = colorMap[color]
            return (
              <div key={label} className={`p-4 rounded-2xl border ${card}`}>
                <div className={`text-3xl font-bold tabular-nums ${num}`}>
                  {value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
