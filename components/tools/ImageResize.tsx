'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp'

type ResultImage = {
  name: string
  originalSize: number
  outputSize: number
  originalWidth: number
  originalHeight: number
  width: number
  height: number
  previewUrl: string
  downloadUrl: string
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
  return filename.replace(/\.[^.]+$/i, '') + extensionFor(format)
}

export default function ImageResize() {
  const t = useTranslations('tools.img-resize')
  const inputRef = useRef<HTMLInputElement>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [result, setResult] = useState<ResultImage | null>(null)
  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [lockRatio, setLockRatio] = useState(true)
  const [format, setFormat] = useState<OutputFormat>('image/png')
  const [quality, setQuality] = useState(85)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (result) {
        URL.revokeObjectURL(result.previewUrl)
        URL.revokeObjectURL(result.downloadUrl)
      }
    }
  }, [result])

  useEffect(() => {
    if (sourceFile && width > 0 && height > 0) void resizeFile(sourceFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, format, quality])

  const reduction = useMemo(() => {
    if (!result) return null
    return Math.round((1 - result.outputSize / result.originalSize) * 100)
  }, [result])

  function setWidthValue(nextWidth: number) {
    const safeWidth = Math.max(1, nextWidth || 1)
    setWidth(safeWidth)
    if (lockRatio && originalWidth > 0) {
      setHeight(Math.max(1, Math.round(safeWidth * originalHeight / originalWidth)))
    }
  }

  function setHeightValue(nextHeight: number) {
    const safeHeight = Math.max(1, nextHeight || 1)
    setHeight(safeHeight)
    if (lockRatio && originalHeight > 0) {
      setWidth(Math.max(1, Math.round(safeHeight * originalWidth / originalHeight)))
    }
  }

  async function resizeFile(file: File) {
    setError('')

    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      reset()
      setError(t('invalidFile'))
      return
    }

    setIsProcessing(true)
    let objectUrl: string | null = null

    try {
      const createdObjectUrl = URL.createObjectURL(file)
      objectUrl = createdObjectUrl
      const img = new Image()
      img.decoding = 'async'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = createdObjectUrl
      })

      const targetWidth = Math.max(1, Math.round(width || img.naturalWidth))
      const targetHeight = Math.max(1, Math.round(height || img.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')

      if (format === 'image/jpeg') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, targetWidth, targetHeight)
      }
      context.imageSmoothingQuality = 'high'
      context.drawImage(img, 0, 0, targetWidth, targetHeight)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((value) => {
          if (value) resolve(value)
          else reject(new Error('Resize failed'))
        }, format, quality / 100)
      })

      const outputUrl = URL.createObjectURL(blob)

      setResult((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.previewUrl)
          URL.revokeObjectURL(previous.downloadUrl)
        }

        return {
          name: outputName(file.name, format),
          originalSize: file.size,
          outputSize: blob.size,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          width: targetWidth,
          height: targetHeight,
          previewUrl: outputUrl,
          downloadUrl: outputUrl,
        }
      })
      URL.revokeObjectURL(createdObjectUrl)
      objectUrl = null
    } catch {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      reset()
      setError(t('convertError'))
    } finally {
      setIsProcessing(false)
    }
  }

  async function loadFile(file: File) {
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      reset()
      setError(t('invalidFile'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.decoding = 'async'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Image load failed'))
      img.src = objectUrl
    }).catch(() => {
      setError(t('convertError'))
    })
    URL.revokeObjectURL(objectUrl)

    if (!img.naturalWidth || !img.naturalHeight) return
    setSourceFile(file)
    setOriginalWidth(img.naturalWidth)
    setOriginalHeight(img.naturalHeight)
    setWidth(img.naturalWidth)
    setHeight(img.naturalHeight)
    void resizeFile(file)
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) void loadFile(file)
  }

  function applyPreset(scale: number) {
    if (!originalWidth || !originalHeight) return
    setWidth(Math.max(1, Math.round(originalWidth * scale)))
    setHeight(Math.max(1, Math.round(originalHeight * scale)))
  }

  function reset() {
    setResult((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.previewUrl)
        URL.revokeObjectURL(previous.downloadUrl)
      }
      return null
    })
    setSourceFile(null)
    setOriginalWidth(0)
    setOriginalHeight(0)
    setWidth(0)
    setHeight(0)
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
            className={`w-full min-h-[190px] rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
              PX
            </span>
            <span className="mt-5 block text-base font-semibold text-gray-900 dark:text-white">{t('dropTitle')}</span>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{t('dropHint')}</span>
            <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              {t('chooseFile')}
            </span>
          </button>

          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => handleFiles(event.target.files)} />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('width')}</span>
                <input type="number" min={1} value={width || ''} onChange={(event) => setWidthValue(Number(event.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('height')}</span>
                <input type="number" min={1} value={height || ''} onChange={(event) => setHeightValue(Number(event.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={lockRatio} onChange={(event) => setLockRatio(event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              {t('lockRatio')}
            </label>

            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 0.75, 1].map((scale) => (
                <button key={scale} type="button" onClick={() => applyPreset(scale)} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  {Math.round(scale * 100)}%
                </button>
              ))}
            </div>

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
          {result ? (
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.previewUrl} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('originalDimensions')}</span><span className="font-medium text-gray-900 dark:text-white">{result.originalWidth} x {result.originalHeight}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('newDimensions')}</span><span className="font-medium text-gray-900 dark:text-white">{result.width} x {result.height}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('originalSize')}</span><span className="font-medium text-gray-900 dark:text-white">{formatBytes(result.originalSize)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('outputSize')}</span><span className="font-medium text-gray-900 dark:text-white">{formatBytes(result.outputSize)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500 dark:text-gray-400">{t('reduction')}</span><span className="font-medium text-gray-900 dark:text-white">{reduction}%</span></div>
              </div>
              <div className="flex gap-2">
                <a href={result.downloadUrl} download={result.name} className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700">{t('download')}</a>
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
