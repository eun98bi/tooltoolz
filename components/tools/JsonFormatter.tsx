'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function JsonFormatter() {
  const t = useTranslations('tools.json-format')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  function format() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) {
      setError(`${t('errorPrefix')}${(e as Error).message}`)
      setOutput('')
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(`${t('errorPrefix')}${(e as Error).message}`)
      setOutput('')
    }
  }

  async function copy() {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={format}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          {t('format')}
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
        >
          {t('minify')}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ml-auto">
          <span>{t('indent')}</span>
          {[2, 4].map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`w-8 h-8 rounded-lg text-sm font-mono font-medium transition-colors ${
                indent === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {n}
            </button>
          ))}
          <span>{t('spaces')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            className="h-80 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Output</label>
            {output && (
              <button
                onClick={copy}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copied ? t('copied') : t('copy')}
              </button>
            )}
          </div>
          {error ? (
            <div className="h-80 p-4 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-mono overflow-auto">
              {error}
            </div>
          ) : (
            <pre className="h-80 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm font-mono overflow-auto whitespace-pre-wrap break-all">
              {output || <span className="text-gray-300 dark:text-gray-600">formatted JSON will appear here</span>}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
