'use client'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

export default function QrCode() {
  const t = useTranslations('tools.qr-code')
  const [text, setText] = useState('https://tooltoolz.com')
  const [size, setSize] = useState(256)
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!text.trim()) return
    import('qrcode').then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        errorCorrectionLevel: level,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).catch(() => {})
    })
  }, [text, size, level])

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const levels: Array<'L' | 'M' | 'Q' | 'H'> = ['L', 'M', 'Q', 'H']

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL / Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('placeholder')}
              rows={4}
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Size */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('size')}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">{size}px</span>
            </div>
            <input
              type="range" min={128} max={512} step={64} value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Error correction level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('errorLevel')}
            </label>
            <div className="flex gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    level === l
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t(`levels.${l}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview + Download */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white">
            <canvas ref={canvasRef} className="block" />
          </div>
          <button
            onClick={download}
            disabled={!text.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium transition-colors text-sm"
          >
            {t('download')}
          </button>
        </div>
      </div>
    </div>
  )
}
