'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type ConvertedImage = {
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

function makeWebpName(filename: string) {
  return filename.replace(/\.[^.]+$/i, '') + '.webp'
}

export default function PngToWebp() {
  const t = useTranslations('tools.png-to-webp')
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<ConvertedImage | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(82)
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
    if (sourceFile) void convertFile(sourceFile, quality)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality])

  const reduction = useMemo(() => {
    if (!image) return null
    return Math.round((1 - image.outputSize / image.originalSize) * 100)
  }, [image])

  async function convertFile(file: File, nextQuality = quality) {
    setError('')

    if (!/^image\/png$/i.test(file.type) && !/\.png$/i.test(file.name)) {
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

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')
      context.drawImage(img, 0, 0)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result)
          else reject(new Error('WebP conversion failed'))
        }, 'image/webp', nextQuality / 100)
      })

      const downloadUrl = URL.createObjectURL(blob)
      const previewUrl = createdObjectUrl

      setImage((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.previewUrl)
          URL.revokeObjectURL(previous.downloadUrl)
        }

        return {
          name: makeWebpName(file.name),
          originalSize: file.size,
          outputSize: blob.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
          previewUrl,
          downloadUrl,
        }
      })
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
    void convertFile(file)
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
            className={`w-full min-h-[240px] rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
              PNG
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
            accept="image/png,.png"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('quality')}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">{quality}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={100}
              step={1}
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="w-full accent-indigo-600"
            />
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
                  <span className="text-gray-500 dark:text-gray-400">{t('webpSize')}</span>
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
