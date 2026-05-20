'use client'
import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  const n = parseInt(clean, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rf = r / 255, gf = g / 255, bf = b / 255
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rf) h = (gf - bf) / d + (gf < bf ? 6 : 0)
  else if (max === gf) h = (bf - rf) / d + 2
  else h = (rf - gf) / d + 4
  return [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sf = s / 100, lf = l / 100
  const c = (1 - Math.abs(2 * lf - 1)) * sf
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lf - c / 2
  let rf = 0, gf = 0, bf = 0
  if (h < 60)       { rf = c; gf = x; bf = 0 }
  else if (h < 120) { rf = x; gf = c; bf = 0 }
  else if (h < 180) { rf = 0; gf = c; bf = x }
  else if (h < 240) { rf = 0; gf = x; bf = c }
  else if (h < 300) { rf = x; gf = 0; bf = c }
  else              { rf = c; gf = 0; bf = x }
  return [Math.round((rf + m) * 255), Math.round((gf + m) * 255), Math.round((bf + m) * 255)]
}

export default function ColorConverter() {
  const t = useTranslations('tools.color-converter')
  const [hex,  setHex]  = useState('#6366f1')
  const [rgb,  setRgb]  = useState<[number,number,number]>([99, 102, 241])
  const [hsl,  setHsl]  = useState<[number,number,number]>([239, 84, 67])
  const [hexError, setHexError] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const syncFromHex = useCallback((value: string) => {
    setHex(value)
    const rgb = hexToRgb(value)
    if (rgb) {
      setRgb(rgb)
      setHsl(rgbToHsl(...rgb))
      setHexError(false)
    } else {
      setHexError(value.replace('#', '').length === 6)
    }
  }, [])

  const syncFromRgb = useCallback((r: number, g: number, b: number) => {
    const clamped: [number, number, number] = [
      Math.min(255, Math.max(0, r)),
      Math.min(255, Math.max(0, g)),
      Math.min(255, Math.max(0, b)),
    ]
    setRgb(clamped)
    setHex(rgbToHex(...clamped))
    setHsl(rgbToHsl(...clamped))
    setHexError(false)
  }, [])

  const syncFromHsl = useCallback((h: number, s: number, l: number) => {
    const clamped: [number, number, number] = [
      Math.min(360, Math.max(0, h)),
      Math.min(100, Math.max(0, s)),
      Math.min(100, Math.max(0, l)),
    ]
    setHsl(clamped)
    const rgb = hslToRgb(...clamped)
    setRgb(rgb)
    setHex(rgbToHex(...rgb))
    setHexError(false)
  }, [])

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const hexStr = hex.toUpperCase()
  const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  const hslStr = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-4">
          <div
            className="h-48 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 transition-colors"
            style={{ backgroundColor: hex }}
          />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">{t('preview')}</p>

          {/* Color picker */}
          <div className="flex items-center justify-center">
            <input
              type="color"
              value={hexError ? '#000000' : hex}
              onChange={(e) => syncFromHex(e.target.value)}
              className="w-16 h-16 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* HEX */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('hex')}</span>
              <button
                onClick={() => copy(hexStr, 'hex')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedKey === 'hex' ? t('copied') : t('copy')}
              </button>
            </div>
            <input
              type="text"
              value={hex}
              onChange={(e) => syncFromHex(e.target.value)}
              className={`w-full p-2 rounded-xl border text-sm font-mono bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hexError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
              }`}
            />
            {hexError && <p className="text-xs text-red-500">{t('invalidHex')}</p>}
          </div>

          {/* RGB */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('rgb')}</span>
              <button
                onClick={() => copy(rgbStr, 'rgb')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedKey === 'rgb' ? t('copied') : t('copy')}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([t('red'), t('green'), t('blue')] as string[]).map((label, i) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                  <input
                    type="number" min={0} max={255}
                    value={rgb[i]}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0
                      const next = [...rgb] as [number,number,number]
                      next[i] = v
                      syncFromRgb(...next)
                    }}
                    className="w-full p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-mono bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* HSL */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('hsl')}</span>
              <button
                onClick={() => copy(hslStr, 'hsl')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedKey === 'hsl' ? t('copied') : t('copy')}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([t('hue'), t('saturation'), t('lightness')] as string[]).map((label, i) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {label}{i > 0 ? ' %' : '°'}
                  </label>
                  <input
                    type="number" min={0} max={i === 0 ? 360 : 100}
                    value={hsl[i]}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0
                      const next = [...hsl] as [number,number,number]
                      next[i] = v
                      syncFromHsl(...next)
                    }}
                    className="w-full p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-mono bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
