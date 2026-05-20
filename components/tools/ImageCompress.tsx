'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type OutputFormat = 'image/webp' | 'image/jpeg'

type CompressedImage = {
  name: string
  originalSize: number
  outputSize: number
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

function outputName(filename: string, format: OutputFormat) {
  const ext = format === 'image/webp' ? '.webp' : '.jpg'
  return filename.replace(/\.[^.]+$/i, '') + ext
}

export default function ImageCompress() {
  const t = useTranslations('tools.img-compress')
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<CompressedImage | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(75)
  const [format, setFormat] = useState<OutputFormat>('image/webp')
  const [maxWidth, setMaxWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.previewUrl)
        URL.revokeObjectURL(image.downloadUrl)
      }
    }
  }, [image])

  useEffect(() => {
    if (sourceFile) void compressFile(sourceFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, format, maxWidth])

  const reduction = useMemo(() => {
    if (!image) return null
    return Math.round((1 - image.outputSize / image.originalSize) * 100)
  }, [image])

  async function compressFile(file: File) {
    setError('')

    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      reset()
      setError(t('invalidFile'))
      return
    }

    setIsConverting(true)
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

      const scale = maxWidth > 0 && img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1
      const width = Math.max(1, Math.round(img.naturalWidth * scale))
      const height = Math.max(1, Math.round(img.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')

      if (format === 'image/jpeg') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)
      }
      context.drawImage(img, 0, 0, width, height)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result)
          else reject(new Error('Image compression failed'))
        }, format, quality / 100)
      })

      const downloadUrl = URL.createObjectURL(blob)
      const previewUrl = URL.createObjectURL(blob)

      setImage((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.previewUrl)
          URL.revokeObjectURL(previous.downloadUrl)
        }

        return {
          name: outputName(file.name, format),
          originalSize: file.size,
          outputSize: blob.size,
          width,
          height,
          previewUrl,
          downloadUrl,
        }
      })
      URL.revokeObjectURL(createdObjectUrl)
      objectUrl = null
    } catch {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      reset()
      setError(t('convertError'))
    } finally {
      setIsConverting(false)
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    setSourceFile(file)
    void compressFile(file)
  }

  function reset() {
    setImage((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.previewUrl)
        URL.revokeObjectURL(previous.downloadUrl)
      }
      return null
    })
    setSourceFile(null)
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
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-xl font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
              %
            </span>
            <span className="mt-5 block text-base font-semibold text-gray-900 dark:text-white">{t('dropTitle')}</span>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{t('dropHint')}</span>
            <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              {t('chooseFile')}
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('format')}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['image/webp', 'image/jpeg'] as OutputFormat[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormat(value)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                      format === value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {value === 'image/webp' ? 'WebP' : 'JPG'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('quality')}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{quality}%</span>
              </div>
              <input type="range" min={35} max={95} step={1} value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-indigo-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('maxWidth')}</label>
              <input
                type="number"
                min={0}
                step={100}
                value={maxWidth}
                onChange={(event) => setMaxWidth(Math.max(0, Number(event.target.value) || 0))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('maxWidthHint')}</p>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          ) : null}

          {isConverting ? (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              {t('converting')}
            </div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          {image ? (
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.previewUrl} alt="" className="h-full w-full object-contain" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">{t('dimensions')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{image.width} x {image.height}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">{t('originalSize')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatBytes(image.originalSize)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">{t('compressedSize')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatBytes(image.outputSize)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">{t('reduction')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{reduction}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={image.downloadUrl} download={image.name} className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                  {t('download')}
                </a>
                <button type="button" onClick={reset} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  {t('clear')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center text-center text-sm text-gray-400 dark:text-gray-500">
              {t('emptyPreview')}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
