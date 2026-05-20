'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

type KoreanMode = 'unicode' | 'remove'

function toSlug(text: string, sep: string, koreanMode: KoreanMode): string {
  let s = text

  // Normalize unicode (NFC)
  s = s.normalize('NFC')

  if (koreanMode === 'remove') {
    // Remove Korean characters
    s = s.replace(/[가-힯ᄀ-ᇿ㄰-㆏]/g, ' ')
  }

  s = s
    .toLowerCase()
    // Replace common special chars with separator
    .replace(/[&+]/g, `-and-`)
    // Remove characters that aren't alphanumeric, Korean, hyphens, or spaces
    .replace(/[^\w\s가-힯ᄀ-ᇿ㄰-㆏-]/g, ' ')
    // Replace whitespace runs with separator
    .replace(/[\s_]+/g, sep)
    // Replace multiple separators
    .replace(new RegExp(`${sep === '-' ? '-' : '_'}{2,}`, 'g'), sep)
    // Trim leading/trailing separator
    .replace(new RegExp(`^${sep === '-' ? '-' : '_'}+|${sep === '-' ? '-' : '_'}+$`, 'g'), '')

  return s
}

export default function SlugGenerator() {
  const t = useTranslations('tools.slug-generator')
  const [input, setInput] = useState('')
  const [sep, setSep] = useState<'-' | '_'>('-')
  const [koreanMode, setKoreanMode] = useState<KoreanMode>('unicode')
  const [copied, setCopied] = useState(false)

  const slug = useMemo(() => (input.trim() ? toSlug(input, sep, koreanMode) : ''), [input, sep, koreanMode])

  function copy() {
    navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap gap-6">
        {/* Separator */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('separatorLabel')}</p>
          <div className="flex gap-2">
            {(['-', '_'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSep(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-mono font-semibold transition-colors ${
                  sep === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300'
                }`}
              >
                {s === '-' ? t('hyphen') : t('underscore')}
              </button>
            ))}
          </div>
        </div>

        {/* Korean mode */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('koreanLabel')}</p>
          <div className="flex gap-2">
            {(['unicode', 'remove'] as KoreanMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setKoreanMode(m)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  koreanMode === m
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300'
                }`}
              >
                {t(`koreanModes.${m}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
        />
      </div>

      {/* Result */}
      {slug && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('resultLabel')}</p>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
            <code className="flex-1 text-indigo-700 dark:text-indigo-300 text-sm font-mono break-all">
              {slug}
            </code>
            <button
              onClick={copy}
              className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
