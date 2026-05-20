'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

type Mode = 'encode' | 'decode'

function encode(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

function decode(b64: string): string {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

function convert(text: string, mode: Mode): { result: string; error: boolean } {
  try {
    const result = mode === 'encode' ? encode(text) : decode(text.trim())
    return { result, error: false }
  } catch {
    return { result: '', error: true }
  }
}

type Mode2 = 'encode' | 'decode'
export default function Base64Converter() {
  const t = useTranslations('tools.base64-converter')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode2>('encode')
  const [copied, setCopied] = useState(false)

  const { result, error } = useMemo(() => (input ? convert(input, mode) : { result: '', error: false }), [input, mode])

  function copy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['encode', 'decode'] as Mode2[]).map((m) => (
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
          <textarea value={error ? t('error') : result} readOnly rows={14}
            placeholder={t('outputPlaceholder')}
            className={`w-full rounded-xl border px-4 py-3 text-sm font-mono resize-none focus:outline-none placeholder:text-gray-400 ${error ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`} />
        </div>
      </div>

      {result && !error && (
        <button onClick={copy}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {copied ? t('copied') : t('copy')}
        </button>
      )}
    </div>
  )
}
