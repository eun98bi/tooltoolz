'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

type DiffLine = { type: 'added' | 'removed' | 'unchanged'; text: string }

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
  return dp
}

function diff(a: string, b: string): DiffLine[] {
  const aLines = a.split('\n')
  const bLines = b.split('\n')
  const dp = lcs(aLines, bLines)
  const result: DiffLine[] = []
  let i = aLines.length, j = bLines.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: 'unchanged', text: aLines[--i] }); j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: bLines[--j] })
    } else {
      result.unshift({ type: 'removed', text: aLines[--i] })
    }
  }
  return result
}

export default function DiffChecker() {
  const t = useTranslations('tools.diff-checker')
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')

  const lines = useMemo(() => (original || modified) ? diff(original, modified) : null, [original, modified])

  const stats = useMemo(() => {
    if (!lines) return null
    return lines.reduce((acc, l) => ({ ...acc, [l.type]: (acc as Record<string, number>)[l.type] + 1 }), { added: 0, removed: 0, unchanged: 0 }) as { added: number; removed: number; unchanged: number }
  }, [lines])

  const noChanges = stats && stats.added === 0 && stats.removed === 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('original')}</label>
          <textarea value={original} onChange={(e) => setOriginal(e.target.value)}
            placeholder={t('placeholder')} rows={12}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('modified')}</label>
          <textarea value={modified} onChange={(e) => setModified(e.target.value)}
            placeholder={t('placeholder')} rows={12}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400" />
        </div>
      </div>

      {lines && (
        <div className="space-y-3">
          {/* Stats */}
          {stats && !noChanges && (
            <div className="flex gap-3 text-sm">
              <span className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">+{stats.added} {t('added')}</span>
              <span className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">−{stats.removed} {t('removed')}</span>
              <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{stats.unchanged} {t('unchanged')}</span>
            </div>
          )}

          {noChanges ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">{t('noChanges')}</div>
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">{t('result')}</div>
              <div className="font-mono text-sm overflow-x-auto">
                {lines.map((line, i) => (
                  <div key={i}
                    className={`px-4 py-0.5 flex gap-3 ${line.type === 'added' ? 'bg-green-50 dark:bg-green-900/20' : line.type === 'removed' ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                    <span className={`select-none w-4 shrink-0 ${line.type === 'added' ? 'text-green-500' : line.type === 'removed' ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
                    </span>
                    <span className={`whitespace-pre-wrap break-all ${line.type === 'added' ? 'text-green-800 dark:text-green-300' : line.type === 'removed' ? 'text-red-800 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {line.text || ' '}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!lines && (
        <p className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">{t('emptyHint')}</p>
      )}
    </div>
  )
}
