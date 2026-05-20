'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type ConvertedImage = {
  name: string
  originalSize: number
  pngSize: number
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

function makePngName(filename: string) {
  return filename.replace(/\.(jpe?g)$/i, '') + '.png'
}

export default function JpgToPng() {
  const t = useTranslations('tools.jpg-to-png')
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<ConvertedImage | null>(null)
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

  const sizeDelta = useMemo(() => {
    if (!image) return null
    const diff = image.pngSize - image.originalSize
    const sign = diff > 0 ? '+' : ''
    return `${sign}${formatBytes(diff)}`
  }, [image])

  async function convertFile(file: File) {
    setError('')

    if (!/^image\/jpe?g$/i.test(file.type) && !/\.(jpe?g)$/i.test(file.name)) {
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
          else reject(new Error('PNG conversion failed'))
        }, 'image/png')
      })

      const downloadUrl = URL.createObjectURL(blob)
      const previewUrl = createdObjectUrl

      setImage((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.previewUrl)
          URL.revokeObjectURL(previous.downloadUrl)
        }

        return {
          name: makePngName(file.name),
          originalSize: file.size,
          pngSize: blob.size,
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
    if (file) void convertFile(file)
  }

  function reset() {
    setImage((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.previewUrl)
        URL.revokeObjectURL(previous.downloadUrl)
      }
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
            className={`w-full min-h-[260px] rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
              JPG
            </span>
            <span className="mt-5 block text-base font-semibold text-gray-900 dark:text-white">
              {t('dropTitle')}
            </span>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
              {t('dropHint')}
            </span>
            <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              {t('chooseFile')}
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,.jpg,.jpeg"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />

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
                  <span className="font-medium text-gray-900 dark:text-white">
                    {image.width} x {image.height}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">{t('originalSize')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatBytes(image.originalSize)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">{t('pngSize')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatBytes(image.pngSize)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">{t('change')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{sizeDelta}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={image.downloadUrl}
                  download={image.name}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {t('download')}
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
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
