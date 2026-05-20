'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type OutputFormat = 'image/webp' | 'image/jpeg'

type SourceImage = {
  name: string
  size: number
  width: number
  height: number
  url: string
}

type ResultImage = {
  name: string
  size: number
  width: number
  height: number
  quality: number
  url: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function outputName(filename: string, format: OutputFormat) {
  return filename.replace(/\.[^.]+$/i, '') + '-reduced' + (format === 'image/webp' ? '.webp' : '.jpg')
}

function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value) resolve(value)
      else reject(new Error('Compression failed'))
    }, format, quality)
  })
}

export default function ImageSizeReduce() {
  const t = useTranslations('tools.img-size-reduce')
  const inputRef = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<SourceImage | null>(null)
  const [result, setResult] = useState<ResultImage | null>(null)
  const [targetKb, setTargetKb] = useState(200)
  const [format, setFormat] = useState<OutputFormat>('image/webp')
  const [minQuality, setMinQuality] = useState(35)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url)
      if (result) URL.revokeObjectURL(result.url)
    }
  }, [source, result])

  useEffect(() => {
    if (source) void reduceImage(source)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKb, format, minQuality])

  const reduction = useMemo(() => {
    if (!source || !result) return null
    return Math.round((1 - result.size / source.size) * 100)
  }, [source, result])

  async function exportAt(img: HTMLImageElement, width: number, height: number, quality: number) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')

    if (format === 'image/jpeg') {
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
    }
    context.imageSmoothingQuality = 'high'
    context.drawImage(img, 0, 0, width, height)
    return canvasToBlob(canvas, format, quality)
  }

  async function reduceImage(nextSource: SourceImage) {
    const targetBytes = Math.max(10, targetKb) * 1024
    setIsProcessing(true)
    setError('')

    try {
      const img = new Image()
      img.decoding = 'async'
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = nextSource.url
      })

      let scale = 1
      let bestBlob: Blob | null = null
      let bestQuality = 0.95
      let bestWidth = nextSource.width
      let bestHeight = nextSource.height
      const minQ = Math.max(0.1, Math.min(0.95, minQuality / 100))

      for (let pass = 0; pass < 12; pass += 1) {
        const width = Math.max(1, Math.round(nextSource.width * scale))
        const height = Math.max(1, Math.round(nextSource.height * scale))
        let low = minQ
        let high = 0.95
        let candidate = await exportAt(img, width, height, low)
        let candidateQuality = low

        if (candidate.size <= targetBytes) {
          for (let i = 0; i < 7; i += 1) {
            const mid = (low + high) / 2
            const blob = await exportAt(img, width, height, mid)
            if (blob.size <= targetBytes) {
              candidate = blob
              candidateQuality = mid
              low = mid
            } else {
              high = mid
            }
          }
        } else {
          candidateQuality = low
        }

        bestBlob = candidate
        bestQuality = candidateQuality
        bestWidth = width
        bestHeight = height

        if (candidate.size <= targetBytes || width <= 240 || height <= 240) break
        scale *= 0.86
      }

      if (!bestBlob) throw new Error('Compression failed')

      const url = URL.createObjectURL(bestBlob)
      setResult((previous) => {
        if (previous) URL.revokeObjectURL(previous.url)
        return {
          name: outputName(nextSource.name, format),
          size: bestBlob.size,
          width: bestWidth,
          height: bestHeight,
          quality: Math.round(bestQuality * 100),
          url,
        }
      })
    } catch {
      setError(t('convertError'))
    } finally {
      setIsProcessing(false)
    }
  }

  async function loadFile(file: File) {
    setError('')

    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      reset()
      setError(t('invalidFile'))
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.decoding = 'async'

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = url
      })

      const nextSource = {
        name: file.name,
        size: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        url,
      }

      setSource((previous) => {
        if (previous) URL.revokeObjectURL(previous.url)
        return nextSource
      })
      setTargetKb(Math.max(10, Math.round(file.size / 1024 / 2)))
      await reduceImage(nextSource)
    } catch {
      URL.revokeObjectURL(url)
      reset()
      setError(t('convertError'))
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) void loadFile(file)
  }

  function reset() {
    setSource((previous) => {
      if (previous) URL.revokeObjectURL(previous.url)
      return null
    })
    setResult((previous) => {
      if (previous) URL.revokeObjectURL(previous.url)
      return null
    })
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              handleFiles(event.dataTransfer.files)
            }}
            className={`w-full min-h-[220px] rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
              KB
            </span>
            <span className="mt-5 block text-base font-semibold text-gray-900 dark:text-white">{t('dropTitle')}</span>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{t('dropHint')}</span>
            <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              {t('chooseFile')}
            </span>
          </button>

          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => handleFiles(event.target.files)} />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('targetKb')}</span>
              <input type="number" min={10} value={targetKb} onChange={(event) => setTargetKb(Math.max(10, Number(event.target.value) || 10))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('format')}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['image/webp', 'image/jpeg'] as OutputFormat[]).map((value) => (
                  <button key={value} type="button" onClick={() => setFormat(value)} className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${format === value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                    {value === 'image/webp' ? 'WebP' : 'JPG'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('minQuality')}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{minQuality}%</span>
              </div>
              <input type="range" min={10} max={80} value={minQuality} onChange={(event) => setMinQuality(Number(event.target.value))} className="w-full accent-indigo-600" />
            </div>
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}
          {isProcessing ? <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">{t('processing')}</div> : null}
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          {source && result ? (
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('originalDimensions')}</span><span className="font-medium text-gray-900 dark:text-white">{source.width} x {source.height}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('outputDimensions')}</span><span className="font-medium text-gray-900 dark:text-white">{result.width} x {result.height}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('originalSize')}</span><span className="font-medium text-gray-900 dark:text-white">{formatBytes(source.size)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('outputSize')}</span><span className="font-medium text-gray-900 dark:text-white">{formatBytes(result.size)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('qualityUsed')}</span><span className="font-medium text-gray-900 dark:text-white">{result.quality}%</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('reduction')}</span><span className="font-medium text-gray-900 dark:text-white">{reduction}%</span></div>
              </div>
              <div className="flex gap-2">
                <a href={result.url} download={result.name} className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700">{t('download')}</a>
                <button type="button" onClick={reset} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">{t('clear')}</button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center text-center text-sm text-gray-400 dark:text-gray-500">{t('emptyPreview')}</div>
          )}
        </aside>
      </div>
    </div>
  )
}
