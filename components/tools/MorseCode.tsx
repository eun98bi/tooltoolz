'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

const MORSE_MAP: Record<string, string> = {
  A: '.-',    B: '-...',  C: '-.-.',  D: '-..',   E: '.',
  F: '..-.',  G: '--.',   H: '....',  I: '..',    J: '.---',
  K: '-.-',   L: '.-..',  M: '--',    N: '-.',    O: '---',
  P: '.--.',  Q: '--.-',  R: '.-.',   S: '...',   T: '-',
  U: '..-',   V: '...-',  W: '.--',   X: '-..-',  Y: '-.--',
  Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..',  '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.',  ')': '-.--.-', '&': '.-...',  ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
}

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
)

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(c => {
      if (c === ' ') return '/'
      return MORSE_MAP[c] ?? ''
    })
    .filter(Boolean)
    .join(' ')
}

function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map(word =>
      word
        .trim()
        .split(/\s+/)
        .map(code => (REVERSE_MAP[code] ?? '?'))
        .join('')
    )
    .join(' ')
    .toLowerCase()
}

type Mode = 'encode' | 'decode'

const REFERENCE_ENTRIES = Object.entries(MORSE_MAP)

export default function MorseCode() {
  const t = useTranslations('tools.morse-code')
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!input.trim()) return ''
    return mode === 'encode' ? textToMorse(input) : morseToText(input)
  }, [input, mode])

  function switchMode(m: Mode) {
    setMode(m)
    setInput('')
  }

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'
            }`}
          >
            {t(m)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('input')}</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t('placeholderEncode') : t('placeholderDecode')}
            rows={12}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            rows={12}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono resize-none focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {output && (
        <button
          onClick={copy}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            copied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {copied ? t('copied') : t('copy')}
        </button>
      )}

      <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">{t('referenceTitle')}</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-1">
          {REFERENCE_ENTRIES.map(([char, code]) => (
            <div key={char} className="flex gap-2 text-xs font-mono text-gray-600 dark:text-gray-400">
              <span className="font-bold w-4">{char}</span>
              <span>{code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
