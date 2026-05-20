'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type SourceImage = {
  name: string
  size: number
  width: number
  height: number
  url: string
  dataUrl: string
}

type GeneratedFile = {
  label: string
  filename: string
  size: number
  url: string
}

type GeneratedSet = {
  pngs: GeneratedFile[]
  ico: GeneratedFile
  svg: GeneratedFile
}

const PNG_SIZES = [16, 32, 48, 64, 128, 180, 192, 512]
const ICO_SIZES = [16, 32, 48]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function baseName(filename: string) {
  return filename.replace(/\.[^.]+$/i, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'favicon'
}

function blobFromCanvas(canvas: HTMLCanvasElement, type = 'image/png') {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export failed'))
    }, type)
  })
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true)
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true)
}

async function createIcoBlob(entries: Array<{ size: number; blob: Blob }>) {
  const buffers = await Promise.all(entries.map((entry) => entry.blob.arrayBuffer()))
  const headerSize = 6
  const directorySize = entries.length * 16
  const totalSize = headerSize + directorySize + buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0)
  const output = new ArrayBuffer(totalSize)
  const view = new DataView(output)
  const bytes = new Uint8Array(output)

  writeUint16(view, 0, 0)
  writeUint16(view, 2, 1)
  writeUint16(view, 4, entries.length)

  let imageOffset = headerSize + directorySize
  entries.forEach((entry, index) => {
    const directoryOffset = headerSize + index * 16
    const buffer = buffers[index]
    view.setUint8(directoryOffset, entry.size >= 256 ? 0 : entry.size)
    view.setUint8(directoryOffset + 1, entry.size >= 256 ? 0 : entry.size)
    view.setUint8(directoryOffset + 2, 0)
    view.setUint8(directoryOffset + 3, 0)
    writeUint16(view, directoryOffset + 4, 1)
    writeUint16(view, directoryOffset + 6, 32)
    writeUint32(view, directoryOffset + 8, buffer.byteLength)
    writeUint32(view, directoryOffset + 12, imageOffset)
    bytes.set(new Uint8Array(buffer), imageOffset)
    imageOffset += buffer.byteLength
  })

  return new Blob([output], { type: 'image/x-icon' })
}

export default function FaviconGen() {
  const t = useTranslations('tools.favicon-gen')
  const inputRef = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<SourceImage | null>(null)
  const [generated, setGenerated] = useState<GeneratedSet | null>(null)
  const [padding, setPadding] = useState(12)
  const [transparent, setTransparent] = useState(true)
  const [background, setBackground] = useState('#ffffff')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url)
      if (generated) revokeGenerated(generated)
    }
  }, [source, generated])

  useEffect(() => {
    if (source) void generate(source)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padding, transparent, background])

  const recommendedMarkup = useMemo(() => {
    if (!generated) return ''
    return [
      '<link rel="icon" href="/favicon.ico" sizes="any">',
      '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
      '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
      '<link rel="manifest" href="/site.webmanifest">',
    ].join('\n')
  }, [generated])

  function revokeGenerated(files: GeneratedSet) {
    files.pngs.forEach((file) => URL.revokeObjectURL(file.url))
    URL.revokeObjectURL(files.ico.url)
    URL.revokeObjectURL(files.svg.url)
  }

  function drawIcon(img: HTMLImageElement, size: number) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')

    if (!transparent) {
      context.fillStyle = background
      context.fillRect(0, 0, size, size)
    }

    const inset = Math.round(size * (padding / 100))
    const target = Math.max(1, size - inset * 2)
    const scale = Math.min(target / img.naturalWidth, target / img.naturalHeight)
    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))
    const x = Math.round((size - width) / 2)
    const y = Math.round((size - height) / 2)

    context.imageSmoothingQuality = 'high'
    context.drawImage(img, x, y, width, height)
    return canvas
  }

  async function generate(nextSource: SourceImage) {
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

      const name = baseName(nextSource.name)
      const pngEntries = await Promise.all(
        PNG_SIZES.map(async (size) => {
          const blob = await blobFromCanvas(drawIcon(img, size))
          return {
            label: `${size} x ${size}`,
            filename: size === 180 ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`,
            size: blob.size,
            url: URL.createObjectURL(blob),
          }
        })
      )

      const icoPngs = await Promise.all(
        ICO_SIZES.map(async (size) => ({
          size,
          blob: await blobFromCanvas(drawIcon(img, size)),
        }))
      )
      const icoBlob = await createIcoBlob(icoPngs)
      const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">',
        transparent ? '' : `<rect width="512" height="512" fill="${background}"/>`,
        `<image href="${nextSource.dataUrl}" x="${padding * 2.56}" y="${padding * 2.56}" width="${512 - padding * 5.12}" height="${512 - padding * 5.12}" preserveAspectRatio="xMidYMid meet"/>`,
        '</svg>',
      ].join('')
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' })

      setGenerated((previous) => {
        if (previous) revokeGenerated(previous)
        return {
          pngs: pngEntries,
          ico: {
            label: 'ICO',
            filename: `${name}.ico`,
            size: icoBlob.size,
            url: URL.createObjectURL(icoBlob),
          },
          svg: {
            label: 'SVG',
            filename: `${name}.svg`,
            size: svgBlob.size,
            url: URL.createObjectURL(svgBlob),
          },
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

    if (!/^image\/(png|jpe?g|webp|svg\+xml)$/i.test(file.type)) {
      reset()
      setError(t('invalidFile'))
      return
    }

    const url = URL.createObjectURL(file)
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('File read failed'))
      reader.readAsDataURL(file)
    }).catch(() => '')

    if (!dataUrl) {
      URL.revokeObjectURL(url)
      setError(t('convertError'))
      return
    }

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
        dataUrl,
      }

      setSource((previous) => {
        if (previous) URL.revokeObjectURL(previous.url)
        return nextSource
      })
      await generate(nextSource)
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

  function downloadAll() {
    if (!generated) return
    const files = [generated.ico, generated.svg, ...generated.pngs]
    files.forEach((file, index) => {
      window.setTimeout(() => {
        const link = document.createElement('a')
        link.href = file.url
        link.download = file.filename
        link.click()
      }, index * 120)
    })
  }

  function reset() {
    setSource((previous) => {
      if (previous) URL.revokeObjectURL(previous.url)
      return null
    })
    setGenerated((previous) => {
      if (previous) revokeGenerated(previous)
      return null
    })
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">{t('desc')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
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
              ICO
            </span>
            <span className="mt-5 block text-base font-semibold text-gray-900 dark:text-white">{t('dropTitle')}</span>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{t('dropHint')}</span>
            <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
              {t('chooseFile')}
            </span>
          </button>

          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg" className="hidden" onChange={(event) => handleFiles(event.target.files)} />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('padding')}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{padding}%</span>
              </div>
              <input type="range" min={0} max={28} value={padding} onChange={(event) => setPadding(Number(event.target.value))} className="w-full accent-indigo-600" />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={transparent} onChange={(event) => setTransparent(event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              {t('transparent')}
            </label>

            {!transparent ? (
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('background')}</span>
                <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-10 w-20 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-950" />
              </label>
            ) : null}
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}
          {isProcessing ? <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">{t('processing')}</div> : null}

          {recommendedMarkup ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t('markup')}</div>
              <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-xs text-gray-100">{recommendedMarkup}</pre>
            </div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          {source && generated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={source.url} alt="" className="max-h-20 max-w-20 object-contain" />
                </div>
                <div className="min-w-0 text-sm">
                  <div className="truncate font-medium text-gray-900 dark:text-white">{source.name}</div>
                  <div className="mt-1 text-gray-500 dark:text-gray-400">{source.width} x {source.height}</div>
                  <div className="text-gray-500 dark:text-gray-400">{formatBytes(source.size)}</div>
                </div>
              </div>

              <button type="button" onClick={downloadAll} className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                {t('downloadAll')}
              </button>

              <div className="space-y-2">
                {[generated.ico, generated.svg, ...generated.pngs].map((file) => (
                  <a key={file.filename} href={file.url} download={file.filename} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <span className="font-medium text-gray-800 dark:text-gray-100">{file.filename}</span>
                    <span className="shrink-0 text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</span>
                  </a>
                ))}
              </div>

              <button type="button" onClick={reset} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                {t('clear')}
              </button>
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
