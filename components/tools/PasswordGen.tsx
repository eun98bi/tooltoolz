'use client'
import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMS  = '0123456789'
const SYMS  = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function calcStrength(pw: string): 0 | 1 | 2 | 3 {
  if (pw.length === 0) return 0
  let score = 0
  if (pw.length >= 12) score++
  if (pw.length >= 16) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return 0
  if (score <= 2) return 1
  if (score <= 3) return 2
  return 3
}

export default function PasswordGen() {
  const t = useTranslations('tools.password-gen')
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNums,  setUseNums]  = useState(true)
  const [useSyms,  setUseSyms]  = useState(false)
  const [password, setPassword] = useState('')
  const [copied,   setCopied]   = useState(false)

  const generate = useCallback(() => {
    let chars = ''
    if (useUpper) chars += UPPER
    if (useLower) chars += LOWER
    if (useNums)  chars += NUMS
    if (useSyms)  chars += SYMS
    if (!chars)   chars = LOWER

    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    setPassword(Array.from(arr, (n) => chars[n % chars.length]).join(''))
  }, [length, useUpper, useLower, useNums, useSyms])

  useEffect(() => { generate() }, [generate])

  async function copy() {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = calcStrength(password)
  const strengthLabels = [t('weak'), t('medium'), t('strong'), t('veryStrong')]
  const strengthColors = [
    'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      <div className="max-w-xl space-y-6">
        {/* Password display */}
        <div className="relative">
          <div className="p-4 pr-28 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm break-all text-gray-900 dark:text-gray-100 min-h-[3.5rem] flex items-center">
            {password}
          </div>
          <button
            onClick={copy}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{t('strength')}</span>
              <span className="font-medium">{strengthLabels[strength]}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${strengthColors[strength]}`}
                style={{ width: `${((strength + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Length slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{t('length')}</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{length}</span>
          </div>
          <input
            type="range" min={4} max={64} value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          {[
            { label: t('uppercase'), checked: useUpper, set: setUseUpper },
            { label: t('lowercase'), checked: useLower, set: setUseLower },
            { label: t('numbers'),   checked: useNums,  set: setUseNums  },
            { label: t('symbols'),   checked: useSyms,  set: setUseSyms  },
          ].map(({ label, checked, set }) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" checked={checked}
                onChange={(e) => set(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
        >
          {t('generate')}
        </button>
      </div>
    </div>
  )
}
