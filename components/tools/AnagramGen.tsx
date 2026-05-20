'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

function getAllPermutations(str: string): string[] {
  if (str.length <= 1) return [str]
  const result = new Set<string>()
  for (let i = 0; i < str.length; i++) {
    const rest = str.slice(0, i) + str.slice(i + 1)
    for (const perm of getAllPermutations(rest)) {
      result.add(str[i] + perm)
    }
  }
  return Array.from(result).sort()
}

function shuffleArray(arr: string[]): string[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function getRandomShuffles(chars: string[], count: number, original: string): string[] {
  const results = new Set<string>()
  let attempts = 0
  while (results.size < count && attempts < 100000) {
    attempts++
    const shuffled = shuffleArray(chars).join('')
    if (shuffled !== original) results.add(shuffled)
  }
  return Array.from(results)
}

function countUnique(str: string): number {
  const freq: Record<string, number> = {}
  for (const c of str) freq[c] = (freq[c] ?? 0) + 1
  let denom = 1
  for (const count of Object.values(freq)) denom *= factorial(count)
  return Math.round(factorial(str.length) / denom)
}

const MAX_PERMUTATION_LEN = 7

export default function AnagramGen() {
  const t = useTranslations('tools.anagram-gen')
  const [input, setInput] = useState('')
  const [seed, setSeed] = useState(0)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const cleaned = input.replace(/\s+/g, '').toLowerCase()

  const results = useMemo(() => {
    if (!cleaned) return []
    if (cleaned.length <= MAX_PERMUTATION_LEN) {
      return getAllPermutations(cleaned).filter(p => p !== cleaned)
    }
    return getRandomShuffles(cleaned.split(''), 30, cleaned)
    // seed triggers re-shuffle for long words
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleaned, seed])

  const totalCount = useMemo(() => {
    if (!cleaned) return 0
    return countUnique(cleaned)
  }, [cleaned])

  function copy(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1200)
  }

  const isLong = cleaned.length > MAX_PERMUTATION_LEN

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
          {t('inputLabel')}
        </label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-gray-400"
        />
      </div>

      {cleaned && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isLong
              ? t('showingRandom', { count: results.length })
              : t('totalCount', { count: totalCount.toLocaleString() })}
          </p>
          {isLong && (
            <button
              onClick={() => setSeed(s => s + 1)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              {t('shuffle')}
            </button>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {results.map((r, i) => (
            <button
              key={r}
              onClick={() => copy(r, i)}
              title={t('copyHint')}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono text-gray-800 dark:text-gray-200 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left truncate"
            >
              {copiedIdx === i ? '✓' : r}
            </button>
          ))}
        </div>
      )}

      {cleaned && results.length === 0 && (
        <p className="text-sm text-gray-400">{t('noResults')}</p>
      )}
    </div>
  )
}
