'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp'

type SourceImage = {
  name: string
  size: number
  width: number
  height: number
  url: string
}

type CropBox = {
  x: number
  y: number
  width: number
  height: number
}

type CropResult = {
  name: string
  size: number
  url: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function extensionFor(format: OutputFormat) {
  if (format === 'image/jpeg') return '.jpg'
  if (format === 'image/webp') return '.webp'
  return '.png'
}

function outputName(filename: string, format: OutputFormat) {
  return filename.replace(/\.[^.]+$/i, '') + '-crop' + extensionFor(format)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function ImageCrop() {
  const t = useTranslations('tools.img-crop')
  const inputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const [source, setSource] = useState<SourceImage | null>(null)
  const [crop, setCrop] = useState<CropBox | null>(null)
  const [result, setResult] = useState<CropResult | null>(null)
  const [format, setFormat] = useState<OutputFormat>('image/png')
  const [quality, setQuality] = useState(90)
  const [isDragging, setIsDragging] = useState(false)
  const [isFileDragging, setIsFileDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url)
      if (result) URL.revokeObjectURL(result.url)
    }
  }, [source, result])

  useEffect(() => {
    if (source && crop) void renderCrop(source, crop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, format, quality])

  const cropStyle = useMemo(() => {
    if (!source || !crop) return null
    return {
      left: `${(crop.x / source.width) * 100}%`,
      top: `${(crop.y / source.height) * 100}%`,
      width: `${(crop.width / source.width) * 100}%`,
      height: `${(crop.height / source.height) * 100}%`,
    }
  }, [source, crop])

  const reduction = useMemo(() => {
    if (!source || !result) return null
    return Math.round((1 - result.size / source.size) * 100)
  }, [source, result])

  function pointToNatural(clientX: number, clientY: number) {
    const img = imageRef.current
    if (!img || !source) return null
    const rect = img.getBoundingClientRect()
    const x = clamp(((clientX - rect.left) / rect.width) * source.width, 0, source.width)
    const y = clamp(((clientY - rect.top) / rect.height) * source.height, 0, source.height)
    return { x, y }
  }

  async function renderCrop(nextSource: SourceImage, nextCrop: CropBox) {
    if (nextCrop.width < 1 || nextCrop.height < 1) return
    setIsProcessing(true)

    try {
      const img = new Image()
      img.decoding = 'async'
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = nextSource.url
      })

      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(nextCrop.width))
      canvas.height = Math.max(1, Math.round(nextCrop.height))

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')

      if (format === 'image/jpeg') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      context.imageSmoothingQuality = 'high'
      context.drawImage(
        img,
        Math.round(nextCrop.x),
        Math.round(nextCrop.y),
        Math.round(nextCrop.width),
        Math.round(nextCrop.height),
        0,
        0,
        canvas.width,
        canvas.height
      )

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((value) => {
          if (value) resolve(value)
          else reject(new Error('Crop failed'))
        }, format, quality / 100)
      })

      const url = URL.createObjectURL(blob)
      setResult((previous) => {
        if (previous) URL.revokeObjectURL(previous.url)
        return {
          name: outputName(nextSource.name, format),
          size: blob.size,
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

      setSource((previous) => {
        if (previous) URL.revokeObjectURL(previous.url)
        return {
          name: file.name,
          size: file.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
          url,
        }
      })

      const width = Math.round(img.naturalWidth * 0.75)
      const height = Math.round(img.naturalHeight * 0.75)
      setCrop({
        x: Math.round((img.naturalWidth - width) / 2),
        y: Math.round((img.naturalHeight - height) / 2),
        width,
        height,
      })
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

  function beginCrop(event: React.PointerEvent<HTMLDivElement>) {
    const point = pointToNatural(event.clientX, event.clientY)
    if (!point) return
    dragStartRef.current = point
    setIsDragging(true)
    setCrop({ x: point.x, y: point.y, width: 1, height: 1 })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveCrop(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStartRef.current || !source) return
    const point = pointToNatural(event.clientX, event.clientY)
    if (!point) return
    const start = dragStartRef.current
    const x = Math.min(start.x, point.x)
    const y = Math.min(start.y, point.y)
    const width = Math.max(1, Math.abs(point.x - start.x))
    const height = Math.max(1, Math.abs(point.y - start.y))
    setCrop({
      x: clamp(x, 0, source.width - 1),
      y: clamp(y, 0, source.height - 1),
      width: clamp(width, 1, source.width - x),
      height: clamp(height, 1, source.height - y),
    })
  }

  function endCrop(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(false)
    dragStartRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
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
    setCrop(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          {!source ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault()
                setIsFileDragging(true)
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsFileDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setIsFileDragging(false)
                handleFiles(event.dataTransfer.files)
              }}
              className={`w-full min-h-[260px] rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                isFileDragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                CROP
              </span>
              <span className="mt-5 block text-base font-semibold text-gray-900 dark:text-white">{t('dropTitle')}</span>
              <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{t('dropHint')}</span>
              <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                {t('chooseFile')}
              </span>
            </button>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div
                className="relative mx-auto max-h-[560px] max-w-full cursor-crosshair select-none overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                onPointerDown={beginCrop}
                onPointerMove={moveCrop}
                onPointerUp={endCrop}
                onPointerCancel={endCrop}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imageRef} src={source.url} alt="" className="block max-h-[560px] w-full object-contain" draggable={false} />
                {cropStyle ? (
                  <>
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" style={cropStyle}>
                      <div className="absolute inset-0 border border-indigo-500" />
                    </div>
                  </>
                ) : null}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{t('dragHint')}</p>
            </div>
          )}

          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => handleFiles(event.target.files)} />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('format')}</label>
              <div className="grid grid-cols-3 gap-2">
                {(['image/png', 'image/jpeg', 'image/webp'] as OutputFormat[]).map((value) => (
                  <button key={value} type="button" onClick={() => setFormat(value)} className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${format === value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                    {value === 'image/png' ? 'PNG' : value === 'image/jpeg' ? 'JPG' : 'WebP'}
                  </button>
                ))}
              </div>
            </div>

            {format !== 'image/png' ? (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('quality')}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{quality}%</span>
                </div>
                <input type="range" min={35} max={100} value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-indigo-600" />
              </div>
            ) : null}
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}
          {isProcessing ? <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">{t('processing')}</div> : null}
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          {source && crop && result ? (
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('originalDimensions')}</span><span className="font-medium text-gray-900 dark:text-white">{source.width} x {source.height}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('cropDimensions')}</span><span className="font-medium text-gray-900 dark:text-white">{Math.round(crop.width)} x {Math.round(crop.height)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('originalSize')}</span><span className="font-medium text-gray-900 dark:text-white">{formatBytes(source.size)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('outputSize')}</span><span className="font-medium text-gray-900 dark:text-white">{formatBytes(result.size)}</span></div>
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
