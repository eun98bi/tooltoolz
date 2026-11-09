'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'
type Status = 'queued' | 'processing' | 'done' | 'error'

type Item = {
  id: string
  file: File
  previewUrl: string
  status: Status
  resultUrl?: string
  resultName?: string
  resultSize?: number
  width?: number
  height?: number
}

type Options = {
  cropOn: boolean
  cropPx: number
  resizeOn: boolean
  scale: number
  rotateOn: boolean
  angle: number
  flipX: boolean
  flipY: boolean
  brightnessOn: boolean
  brightness: number
  saturationOn: boolean
  saturation: number
  noiseOn: boolean
  noise: number
  randomName: boolean
  format: OutputFormat
  quality: number
}

const DEFAULT_OPTIONS: Options = {
  cropOn: false,
  cropPx: 0,
  resizeOn: false,
  scale: 100,
  rotateOn: false,
  angle: 0,
  flipX: false,
  flipY: false,
  brightnessOn: false,
  brightness: 0,
  saturationOn: false,
  saturation: 100,
  noiseOn: true,
  noise: 2,
  randomName: false,
  format: 'image/jpeg',
  quality: 92,
}

// Mild, visually unnoticeable changes recommended for reusing images.
const RECOMMENDED_OPTIONS: Options = {
  ...DEFAULT_OPTIONS,
  cropOn: true,
  cropPx: 3,
  resizeOn: true,
  scale: 98,
  brightnessOn: true,
  brightness: 2,
  saturationOn: true,
  saturation: 103,
  noiseOn: true,
  noise: 3,
  randomName: true,
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function extensionFor(format: OutputFormat) {
  if (format === 'image/png') return 'png'
  if (format === 'image/webp') return 'webp'
  return 'jpg'
}

function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = url
  })
}

function addNoise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  if (!amount) return
  const imageData = ctx.getImageData(0, 0, w, h)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() * 2 - 1) * amount
    d[i] = d[i] + n
    d[i + 1] = d[i + 1] + n
    d[i + 2] = d[i + 2] + n
  }
  ctx.putImageData(imageData, 0, 0)
}

async function launder(item: Item, o: Options) {
  const img = await loadImage(item.previewUrl)
  const crop = o.cropOn ? clamp(o.cropPx, 0, Math.floor(Math.min(img.naturalWidth, img.naturalHeight) / 2) - 1) : 0
  const scale = o.resizeOn ? clamp(o.scale, 10, 300) / 100 : 1
  const angle = o.rotateOn ? clamp(o.angle, -180, 180) : 0
  const rad = (angle * Math.PI) / 180
  const sw = Math.max(1, img.naturalWidth - crop * 2)
  const sh = Math.max(1, img.naturalHeight - crop * 2)
  const w = Math.max(1, Math.round(sw * scale))
  const h = Math.max(1, Math.round(sh * scale))
  const fw = Math.ceil(Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad)))
  const fh = Math.ceil(Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad)))

  const canvas = document.createElement('canvas')
  canvas.width = fw
  canvas.height = fh
  const ctx = canvas.getContext('2d', { willReadFrequently: o.noiseOn })
  if (!ctx) throw new Error('Canvas unavailable')

  if (o.format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, fw, fh)
  }

  const b = o.brightnessOn ? clamp(o.brightness, -100, 100) : 0
  const s = o.saturationOn ? clamp(o.saturation, 0, 200) : 100
  ctx.save()
  ctx.filter = `brightness(${100 + b}%) saturate(${s}%)`
  ctx.imageSmoothingQuality = 'high'
  ctx.translate(fw / 2, fh / 2)
  ctx.rotate(rad)
  ctx.scale(o.flipX ? -1 : 1, o.flipY ? -1 : 1)
  ctx.drawImage(img, crop, crop, sw, sh, -w / 2, -h / 2, w, h)
  ctx.restore()

  if (o.noiseOn) addNoise(ctx, fw, fh, clamp(o.noise, 0, 20))

  const quality = clamp(o.quality, 10, 100) / 100
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('Encode failed'))), o.format, quality)
  })

  const base = o.randomName ? `img_${Date.now().toString(36)}${randomId()}` : item.file.name.replace(/\.[^.]+$/, '') + '_laundered'
  return { blob, name: `${base}.${extensionFor(o.format)}`, width: fw, height: fh }
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ImageLaundry() {
  const t = useTranslations('tools.image-laundry')
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<Item[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS)
  const [isDragging, setIsDragging] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')
  const itemsRef = useRef<Item[]>([])
  itemsRef.current = items

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl)
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
      })
    }
  }, [])

  const set = <K extends keyof Options>(key: K, value: Options[K]) => setOptions((prev) => ({ ...prev, [key]: value }))

  function patchItem(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function addFiles(list: FileList | File[] | null) {
    if (!list) return
    const all = Array.from(list)
    const images = all.filter((file) => file.type.startsWith('image/'))
    setError(images.length < all.length ? t('invalidFile') : '')
    if (!images.length) return
    const next = images.map<Item>((file) => ({ id: randomId(), file, previewUrl: URL.createObjectURL(file), status: 'queued' }))
    setItems((prev) => [...prev, ...next])
    setSelectedId((prev) => prev ?? next[0].id)
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeItem(id: string) {
    const target = items.find((item) => item.id === id)
    if (target) {
      URL.revokeObjectURL(target.previewUrl)
      if (target.resultUrl) URL.revokeObjectURL(target.resultUrl)
    }
    const rest = items.filter((item) => item.id !== id)
    setItems(rest)
    if (selectedId === id) setSelectedId(rest[0]?.id ?? null)
  }

  function clearAll() {
    items.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl)
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
    })
    setItems([])
    setSelectedId(null)
    setError('')
  }

  async function runAll() {
    if (!items.length || isRunning) return
    setIsRunning(true)
    setError('')
    const snapshot = items
    const opts = options
    setItems((prev) => prev.map((item) => {
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
      return { ...item, status: 'queued', resultUrl: undefined, resultName: undefined, resultSize: undefined }
    }))
    for (const item of snapshot) {
      patchItem(item.id, { status: 'processing' })
      // Let the UI paint the progress update before heavy canvas work.
      await sleep(16)
      try {
        const out = await launder(item, opts)
        patchItem(item.id, {
          status: 'done',
          resultUrl: URL.createObjectURL(out.blob),
          resultName: out.name,
          resultSize: out.blob.size,
          width: out.width,
          height: out.height,
        })
      } catch {
        patchItem(item.id, { status: 'error' })
      }
    }
    setIsRunning(false)
  }

  async function downloadAll() {
    for (const item of itemsRef.current) {
      if (item.resultUrl && item.resultName) {
        triggerDownload(item.resultUrl, item.resultName)
        await sleep(250)
      }
    }
  }

  const total = items.length
  const finished = items.filter((item) => item.status === 'done' || item.status === 'error').length
  const doneCount = items.filter((item) => item.status === 'done').length
  const percent = total ? Math.round((finished / total) * 100) : 0
  const selected = items.find((item) => item.id === selectedId) ?? null

  const card = 'rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-900'
  const labelCls = 'flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200'
  const checkCls = 'h-4 w-4 accent-indigo-600'
  const numberCls = 'w-20 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
  const hintCls = 'mt-1 text-xs text-gray-500 dark:text-gray-400'
  const rowCls = 'border-b border-gray-100 py-3 last:border-0 dark:border-gray-800'

  const statusLabel: Record<Status, string> = {
    queued: t('statusQueued'),
    processing: t('statusProcessing'),
    done: t('statusDone'),
    error: t('statusError'),
  }
  const statusCls: Record<Status, string> = {
    queued: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="mt-1 mb-6 text-gray-500 dark:text-gray-400">{t('desc')}</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
            className={`w-full rounded-2xl border-2 border-dashed px-4 text-center transition-colors ${items.length ? 'py-6' : 'min-h-[220px] py-10'} ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-700'
            }`}
          >
            {!items.length ? (
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">WASH</span>
            ) : null}
            <span className={`block text-base font-semibold text-gray-900 dark:text-white ${items.length ? '' : 'mt-5'}`}>{items.length ? t('addMore') : t('dropTitle')}</span>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{t('dropHint')}</span>
            {!items.length ? (
              <span className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">{t('chooseFile')}</span>
            ) : null}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}

          {items.length ? (
            <div className={card}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('fileCount', { count: total })}</span>
                {isRunning || finished ? (
                  <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400">{t('progress', { done: finished, total })} · {percent}%</span>
                ) : null}
              </div>
              {isRunning || finished ? (
                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${percent}%` }} />
                </div>
              ) : null}

              <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl border p-2 transition-colors ${
                      item.id === selectedId ? 'border-indigo-300 bg-indigo-50/60 dark:border-indigo-700 dark:bg-indigo-950/20' : 'border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    <button type="button" onClick={() => setSelectedId(item.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.resultUrl ?? item.previewUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 object-cover dark:bg-gray-800" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{item.file.name}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {formatBytes(item.file.size)}
                          {item.resultSize != null ? ` → ${formatBytes(item.resultSize)}` : ''}
                        </span>
                      </span>
                    </button>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusCls[item.status]}`}>{statusLabel[item.status]}</span>
                    {item.resultUrl && item.resultName ? (
                      <a href={item.resultUrl} download={item.resultName} className="flex-shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700" aria-label={t('download')}>
                        ↓
                      </a>
                    ) : null}
                    <button type="button" onClick={() => removeItem(item.id)} disabled={isRunning} className="flex-shrink-0 rounded-lg px-2 py-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 dark:hover:bg-gray-800 dark:hover:text-gray-200" aria-label={t('remove')}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button type="button" onClick={runAll} disabled={isRunning} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
                  {isRunning ? t('processing') : t('runAll')}
                </button>
                <button type="button" onClick={downloadAll} disabled={isRunning || !doneCount} className="rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/30">
                  {t('downloadAll', { count: doneCount })}
                </button>
                <button type="button" onClick={clearAll} disabled={isRunning} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  {t('clear')}
                </button>
              </div>
            </div>
          ) : null}

          {selected ? (
            <div className={card}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <figure>
                  <figcaption className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">{t('original')}</figcaption>
                  <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selected.previewUrl} alt="" className="block max-h-[320px] w-full object-contain" />
                  </div>
                </figure>
                <figure>
                  <figcaption className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('result')}
                    {selected.width ? ` · ${selected.width} x ${selected.height}` : ''}
                  </figcaption>
                  <div className="flex min-h-[120px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    {selected.resultUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selected.resultUrl} alt="" className="block max-h-[320px] w-full object-contain" />
                    ) : (
                      <span className="px-4 py-8 text-center text-xs text-gray-400 dark:text-gray-500">{t('emptyPreview')}</span>
                    )}
                  </div>
                </figure>
              </div>
            </div>
          ) : null}

          <p className="text-xs text-gray-500 dark:text-gray-400">{t('privacy')}</p>
        </div>

        <aside className={`${card} h-fit lg:sticky lg:top-20`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('settings')}</h2>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => setOptions(RECOMMENDED_OPTIONS)} className="rounded-lg bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60">
                {t('recommended')}
              </button>
              <button type="button" onClick={() => setOptions(DEFAULT_OPTIONS)} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                {t('reset')}
              </button>
            </div>
          </div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{t('recommendedHint')}</p>

          <div className={rowCls}>
            <label className={labelCls}><input type="checkbox" checked disabled className={checkCls} />{t('stripMetadata')}</label>
            <p className={hintCls}>{t('stripMetadataHint')}</p>
          </div>

          <div className={rowCls}>
            <label className={labelCls}><input type="checkbox" checked={options.noiseOn} onChange={(e) => set('noiseOn', e.target.checked)} className={checkCls} />{t('noise')}</label>
            <p className={hintCls}>{t('noiseHint')}</p>
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min={0} max={20} value={options.noise} disabled={!options.noiseOn} onChange={(e) => set('noise', Number(e.target.value))} className="w-full accent-indigo-600 disabled:opacity-50" />
              <span className="w-8 text-right font-mono text-sm text-indigo-600 dark:text-indigo-400">{options.noise}</span>
            </div>
          </div>

          <div className={rowCls}>
            <label className={labelCls}><input type="checkbox" checked={options.cropOn} onChange={(e) => set('cropOn', e.target.checked)} className={checkCls} />{t('crop')}</label>
            <p className={hintCls}>{t('cropHint')}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input type="number" min={0} value={options.cropPx} disabled={!options.cropOn} onChange={(e) => set('cropPx', Number(e.target.value))} className={numberCls} /> px
            </div>
          </div>

          <div className={`${rowCls} grid grid-cols-2 gap-3`}>
            <div>
              <label className={labelCls}><input type="checkbox" checked={options.resizeOn} onChange={(e) => set('resizeOn', e.target.checked)} className={checkCls} />{t('resize')}</label>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="number" min={10} max={300} value={options.scale} disabled={!options.resizeOn} onChange={(e) => set('scale', Number(e.target.value))} className={numberCls} /> %
              </div>
            </div>
            <div>
              <label className={labelCls}><input type="checkbox" checked={options.rotateOn} onChange={(e) => set('rotateOn', e.target.checked)} className={checkCls} />{t('rotate')}</label>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="number" min={-180} max={180} value={options.angle} disabled={!options.rotateOn} onChange={(e) => set('angle', Number(e.target.value))} className={numberCls} /> °
              </div>
            </div>
          </div>

          <div className={`${rowCls} flex flex-wrap gap-x-5 gap-y-2`}>
            <label className={labelCls}><input type="checkbox" checked={options.flipX} onChange={(e) => set('flipX', e.target.checked)} className={checkCls} />{t('flipX')}</label>
            <label className={labelCls}><input type="checkbox" checked={options.flipY} onChange={(e) => set('flipY', e.target.checked)} className={checkCls} />{t('flipY')}</label>
          </div>

          <div className={rowCls}>
            <label className={labelCls}><input type="checkbox" checked={options.brightnessOn} onChange={(e) => set('brightnessOn', e.target.checked)} className={checkCls} />{t('brightness')}</label>
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min={-100} max={100} value={options.brightness} disabled={!options.brightnessOn} onChange={(e) => set('brightness', Number(e.target.value))} className="w-full accent-indigo-600 disabled:opacity-50" />
              <span className="w-10 text-right font-mono text-sm text-indigo-600 dark:text-indigo-400">{options.brightness}</span>
            </div>
          </div>

          <div className={rowCls}>
            <label className={labelCls}><input type="checkbox" checked={options.saturationOn} onChange={(e) => set('saturationOn', e.target.checked)} className={checkCls} />{t('saturation')}</label>
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min={0} max={200} value={options.saturation} disabled={!options.saturationOn} onChange={(e) => set('saturation', Number(e.target.value))} className="w-full accent-indigo-600 disabled:opacity-50" />
              <span className="w-10 text-right font-mono text-sm text-indigo-600 dark:text-indigo-400">{options.saturation}%</span>
            </div>
          </div>

          <div className={rowCls}>
            <label className={labelCls}><input type="checkbox" checked={options.randomName} onChange={(e) => set('randomName', e.target.checked)} className={checkCls} />{t('randomName')}</label>
            <p className={hintCls}>{t('randomNameHint')}</p>
          </div>

          <div className={rowCls}>
            <span className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200">{t('format')}</span>
            <div className="grid grid-cols-3 gap-2">
              {(['image/jpeg', 'image/png', 'image/webp'] as OutputFormat[]).map((value) => (
                <button key={value} type="button" onClick={() => set('format', value)} className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${options.format === value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                  {value === 'image/png' ? 'PNG' : value === 'image/jpeg' ? 'JPG' : 'WebP'}
                </button>
              ))}
            </div>
            {options.format !== 'image/png' ? (
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('quality')}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{options.quality}%</span>
                </div>
                <input type="range" min={10} max={100} value={options.quality} onChange={(e) => set('quality', Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  )
}
