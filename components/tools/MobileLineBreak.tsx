'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

function charWidth(ch: string, cjkDouble: boolean): number {
  if (!cjkDouble) return 1
  const code = ch.codePointAt(0) ?? 0
  if (
    (code >= 0x1100 && code <= 0x11FF) || // Hangul Jamo
    (code >= 0x2E80 && code <= 0x2FFF) || // CJK Radicals
    (code >= 0x3000 && code <= 0x9FFF) || // CJK + Kana
    (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables
    (code >= 0xF900 && code <= 0xFAFF) || // CJK Compatibility
    (code >= 0xFF00 && code <= 0xFFEF)    // Fullwidth Forms
  ) return 2
  return 1
}

function measureStr(s: string, cjkDouble: boolean): number {
  return Array.from(s).reduce((sum, ch) => sum + charWidth(ch, cjkDouble), 0)
}

function breakText(text: string, maxWidth: number, cjkDouble: boolean): string {
  const result: string[] = []

  for (const line of text.split('\n')) {
    if (line.trim() === '') {
      result.push(line)
      continue
    }

    let current = ''
    let currentW = 0
    const chars = Array.from(line)
    let i = 0

    while (i < chars.length) {
      const ch = chars[i]
      const cw = charWidth(ch, cjkDouble)

      if (ch === ' ') {
        // Look ahead to next word to decide whether to break before this space
        let j = i + 1
        while (j < chars.length && chars[j] !== ' ') j++
        const nextWord = chars.slice(i + 1, j).join('')
        const nextWordW = measureStr(nextWord, cjkDouble)

        if (current !== '' && currentW + 1 + nextWordW > maxWidth) {
          result.push(current)
          current = ''
          currentW = 0
          i++ // skip the space
          continue
        }
      }

      if (currentW + cw > maxWidth && current !== '') {
        result.push(current)
        current = ch
        currentW = cw
      } else {
        current += ch
        currentW += cw
      }
      i++
    }

    if (current !== '') result.push(current)
  }

  return result.join('\n')
}

export default function MobileLineBreak() {
  const t = useTranslations('tools.mobile-line-break')
  const [input, setInput] = useState('')
  const [maxWidth, setMaxWidth] = useState(20)
  const [cjkDouble, setCjkDouble] = useState(true)
  const [copied, setCopied] = useState(false)

  const output = useMemo(
    () => (input ? breakText(input, maxWidth, cjkDouble) : ''),
    [input, maxWidth, cjkDouble]
  )

  const lineCount = output ? output.split('\n').length : 0

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Settings bar */}
      <div className="flex flex-wrap gap-6 items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Width slider */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
            {t('width')}
          </span>
          <input
            type="range"
            min={10}
            max={50}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-32 accent-indigo-600"
          />
          <span className="text-sm font-mono w-8 text-right text-indigo-600 dark:text-indigo-400 font-bold">
            {maxWidth}
          </span>
        </div>

        {/* CJK double-width toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={cjkDouble}
            onChange={(e) => setCjkDouble(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              cjkDouble ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                cjkDouble ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('cjkDouble')}</span>
        </label>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            rows={14}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('output')}
            </label>
            {output && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {lineCount}{t('lineUnit')}
              </span>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            rows={14}
            placeholder={t('outputPlaceholder')}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Copy button */}
      {output && (
        <button
          onClick={copy}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {copied ? t('copied') : t('copy')}
        </button>
      )}
    </div>
  )
}
