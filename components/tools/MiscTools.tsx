'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import type { MiscSlug } from '@/lib/misc-slugs'

type Lang = 'kr' | 'en'

const ko: Record<string, string> = {
  Input: '입력',
  Output: '결과',
  Preview: '미리보기',
  Copy: '복사',
  Width: '너비',
  Height: '높이',
  Amount: '값',
  Search: '검색',
  Reset: '초기화',
  Start: '시작',
  Pause: '일시정지',
  Lap: '랩',
  Work: '집중',
  Break: '휴식',
  Minutes: '분',
  Team: '팀',
  Score: '점수',
}

function tr(text: string, locale: string) {
  return locale === 'kr' ? ko[text] ?? text : text
}

function n(value: string | number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function fmt(value: number, locale: Lang, digits = 2) {
  return new Intl.NumberFormat(locale === 'kr' ? 'ko-KR' : 'en-US', { maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const locale = useLocale()
  return <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{tr(label, locale)}</span>{children}</label>
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Button({ children, onClick }: { children: string; onClick: () => void }) {
  const locale = useLocale()
  return <button type="button" onClick={onClick} className="rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-700">{tr(children, locale)}</button>
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">{children}</div>
}

function Shell({ slug, children, result }: { slug: MiscSlug; children: React.ReactNode; result: React.ReactNode }) {
  const t = useTranslations(`tools.${slug}`)
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="mb-6 mt-1 text-gray-500 dark:text-gray-400">{t('desc')}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <Card><div className="space-y-4">{children}</div></Card>
        <Card>{result}</Card>
      </div>
    </div>
  )
}

function ResultText({ value, rows = 12 }: { value: string; rows?: number }) {
  return <Textarea rows={rows} value={value} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function hex() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`
}

function CssShadowGen() {
  const [x, setX] = useState('8'), [y, setY] = useState('12'), [blur, setBlur] = useState('24'), [spread, setSpread] = useState('0'), [color, setColor] = useState('#111827')
  const shadow = `${x}px ${y}px ${blur}px ${spread}px ${color}40`
  return <Shell slug="css-shadow-gen" result={<div className="space-y-4"><div className="mx-auto h-40 w-40 rounded-xl bg-white dark:bg-gray-800" style={{ boxShadow: shadow }} /><ResultText rows={4} value={`box-shadow: ${shadow};`} /></div>}>
    <div className="grid grid-cols-2 gap-3"><Field label="X"><Input type="number" value={x} onChange={(e) => setX(e.target.value)} /></Field><Field label="Y"><Input type="number" value={y} onChange={(e) => setY(e.target.value)} /></Field></div>
    <div className="grid grid-cols-2 gap-3"><Field label="Blur"><Input type="number" value={blur} onChange={(e) => setBlur(e.target.value)} /></Field><Field label="Spread"><Input type="number" value={spread} onChange={(e) => setSpread(e.target.value)} /></Field></div>
    <Field label="Color"><Input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></Field>
  </Shell>
}

function CssGradientGen() {
  const [type, setType] = useState('linear'), [angle, setAngle] = useState('135'), [a, setA] = useState('#06b6d4'), [b, setB] = useState('#f43f5e')
  const css = type === 'linear' ? `linear-gradient(${angle}deg, ${a}, ${b})` : `radial-gradient(circle, ${a}, ${b})`
  return <Shell slug="css-gradient-gen" result={<div className="space-y-4"><div className="h-44 rounded-xl border border-gray-200 dark:border-gray-700" style={{ background: css }} /><ResultText rows={4} value={`background: ${css};`} /></div>}>
    <Field label="Mode"><Select value={type} onChange={(e) => setType(e.target.value)}><option value="linear">Linear</option><option value="radial">Radial</option></Select></Field>
    <Field label="Angle"><Input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} /></Field>
    <div className="grid grid-cols-2 gap-3"><Field label="Color A"><Input type="color" value={a} onChange={(e) => setA(e.target.value)} /></Field><Field label="Color B"><Input type="color" value={b} onChange={(e) => setB(e.target.value)} /></Field></div>
  </Shell>
}

function FontPreview() {
  const [family, setFamily] = useState('Inter'), [size, setSize] = useState('36'), [text, setText] = useState('The quick brown fox jumps over the lazy dog.')
  const stack = `${family}, ui-sans-serif, system-ui, sans-serif`
  return <Shell slug="font-preview" result={<div className="rounded-xl bg-gray-50 p-5 text-gray-900 dark:bg-gray-800 dark:text-white" style={{ fontFamily: stack, fontSize: `${size}px`, lineHeight: 1.25 }}>{text}</div>}>
    <Field label="Font"><Input value={family} onChange={(e) => setFamily(e.target.value)} /></Field>
    <Field label="Size"><Input type="number" min={8} max={96} value={size} onChange={(e) => setSize(e.target.value)} /></Field>
    <Field label="Text"><Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} /></Field>
  </Shell>
}

function ColorPaletteGen() {
  const [colors, setColors] = useState<string[]>(['#0f172a', '#14b8a6', '#f59e0b', '#e11d48', '#f8fafc'])
  function load(file?: File) {
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 80; canvas.height = 80
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, 80, 80)
      const data = ctx.getImageData(0, 0, 80, 80).data
      const buckets = new Map<string, number>()
      for (let i = 0; i < data.length; i += 64) {
        const key = `#${[data[i], data[i + 1], data[i + 2]].map((v) => Math.round(v / 32) * 32).map((v) => Math.min(255, v).toString(16).padStart(2, '0')).join('')}`
        buckets.set(key, (buckets.get(key) || 0) + 1)
      }
      setColors(Array.from(buckets.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key]) => key))
    }
    img.src = URL.createObjectURL(file)
  }
  return <Shell slug="color-palette-gen" result={<div className="space-y-3">{colors.map((c) => <div key={c} className="flex items-center gap-3"><span className="h-12 w-16 rounded-lg border border-gray-200 dark:border-gray-700" style={{ backgroundColor: c }} /><span className="font-mono text-sm text-gray-900 dark:text-white">{c}</span></div>)}</div>}>
    <Field label="Choose image"><Input type="file" accept="image/*" onChange={(e) => load(e.target.files?.[0])} /></Field>
    <Button onClick={() => setColors(Array.from({ length: 6 }, hex))}>Generate</Button>
  </Shell>
}

function AspectRatioCalc() {
  const [w, setW] = useState('1920'), [h, setH] = useState('1080'), [targetW, setTargetW] = useState('1280')
  const ratio = n(w) && n(h) ? n(w) / n(h) : 0
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
  const g = gcd(Math.round(n(w)), Math.round(n(h))) || 1
  return <Shell slug="aspect-ratio-calc" result={<ResultText rows={6} value={`Ratio: ${fmt(ratio, 'en', 4)}\nSimplified: ${Math.round(n(w) / g)}:${Math.round(n(h) / g)}\n${targetW}w height: ${fmt(n(targetW) / ratio, 'en', 0)}px`} />}>
    <div className="grid grid-cols-2 gap-3"><Field label="Width"><Input type="number" value={w} onChange={(e) => setW(e.target.value)} /></Field><Field label="Height"><Input type="number" value={h} onChange={(e) => setH(e.target.value)} /></Field></div>
    <Field label="Target width"><Input type="number" value={targetW} onChange={(e) => setTargetW(e.target.value)} /></Field>
  </Shell>
}

function RandomColorCombo() {
  const [colors, setColors] = useState<string[]>(() => Array.from({ length: 5 }, hex))
  return <Shell slug="random-color-combo" result={<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">{colors.map((c) => <div key={c} className="flex h-16 items-center justify-end px-4 font-mono text-sm font-semibold" style={{ backgroundColor: c, color: '#fff', textShadow: '0 1px 2px #000' }}>{c}</div>)}</div>}>
    <Button onClick={() => setColors(Array.from({ length: 5 }, hex))}>Generate</Button>
    <ResultText rows={5} value={colors.join('\n')} />
  </Shell>
}

function BarcodeGen() {
  const [value, setValue] = useState('TOOLTOOLZ-12345')
  const bars = Array.from(value).flatMap((ch) => ch.charCodeAt(0).toString(2).padStart(8, '0').split(''))
  return <Shell slug="barcode-gen" result={<div className="rounded-xl bg-white p-5"><div className="flex h-32 items-end gap-px">{bars.map((bit, i) => <span key={i} className="h-full bg-black" style={{ width: bit === '1' ? 3 : 1, opacity: bit === '1' ? 1 : 0.25 }} />)}</div><p className="mt-3 text-center font-mono text-sm text-gray-900">{value}</p></div>}>
    <Field label="Value"><Input value={value} onChange={(e) => setValue(e.target.value)} /></Field>
  </Shell>
}

const nativeNums = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
function numberToKorean(value: number) {
  if (!value) return '영'
  const units = ['', '만', '억', '조']
  const small = ['', '십', '백', '천']
  return String(Math.floor(Math.abs(value))).split('').reverse().reduce<string[]>((parts, digit, i) => {
    const d = Number(digit)
    if (!d) return parts
    const chunk = Math.floor(i / 4)
    const piece = `${d === 1 && i % 4 > 0 ? '' : nativeNums[d]}${small[i % 4]}${i % 4 === 0 ? units[chunk] : ''}`
    parts.unshift(piece)
    return parts
  }, []).join('')
}

function NumberToKorean() {
  const [value, setValue] = useState('123456')
  return <Shell slug="number-to-korean" result={<ResultText rows={4} value={numberToKorean(n(value))} />}><Field label="Input"><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></Field></Shell>
}

function ConsonantExtractor() {
  const [text, setText] = useState('안녕하세요 tooltoolz')
  const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
  const output = Array.from(text).map((ch) => {
    const code = ch.charCodeAt(0) - 0xac00
    return code >= 0 && code <= 11171 ? initials[Math.floor(code / 588)] : ch
  }).join('')
  return <Shell slug="consonant-extractor" result={<ResultText value={output} rows={5} />}><Field label="Text"><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} /></Field></Shell>
}

function ManuscriptCalc() {
  const [text, setText] = useState('원고지 매수를 계산할 글을 붙여넣으세요.')
  const chars = text.replace(/\s/g, '').length
  return <Shell slug="manuscript-calc" result={<ResultText rows={5} value={`Characters: ${chars}\n400-char pages: ${Math.ceil(chars / 400)}\n200-char pages: ${Math.ceil(chars / 200)}`} />}><Field label="Text"><Textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} /></Field></Shell>
}

function KoreanAgeCalc() {
  const [birth, setBirth] = useState('1995-05-20')
  const today = new Date()
  const b = new Date(birth)
  const age = today.getFullYear() - b.getFullYear() - (today < new Date(today.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0)
  return <Shell slug="korean-age-calc" result={<ResultText rows={4} value={`Legal age: ${age}\nBirth year age: ${today.getFullYear() - b.getFullYear()}`} />}><Field label="Date"><Input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} /></Field></Shell>
}

function RealEstateFeeCalc() {
  const [amount, setAmount] = useState('500000000'), [rate, setRate] = useState('0.4')
  const fee = n(amount) * n(rate) / 100
  return <Shell slug="real-estate-fee-calc" result={<ResultText rows={4} value={`Fee: ${fmt(fee, 'kr', 0)} KRW\nRate: ${rate}%`} />}><Field label="Amount"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field><Field label="Rate"><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} /></Field></Shell>
}

function SeverancePayCalc() {
  const [monthly, setMonthly] = useState('3000000'), [years, setYears] = useState('3')
  const pay = n(monthly) * n(years)
  return <Shell slug="severance-pay-calc" result={<ResultText rows={4} value={`Estimated severance: ${fmt(pay, 'kr', 0)} KRW`} />}><Field label="Monthly pay"><Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></Field><Field label="Years"><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></Field></Shell>
}

function UnemploymentBenefitCalc() {
  const [daily, setDaily] = useState('80000'), [days, setDays] = useState('150')
  const benefit = Math.min(66000, n(daily) * 0.6) * n(days)
  return <Shell slug="unemployment-benefit-calc" result={<ResultText rows={4} value={`Daily benefit: ${fmt(Math.min(66000, n(daily) * 0.6), 'kr', 0)} KRW\nTotal: ${fmt(benefit, 'kr', 0)} KRW`} />}><Field label="Daily wage"><Input type="number" value={daily} onChange={(e) => setDaily(e.target.value)} /></Field><Field label="Days"><Input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></Field></Shell>
}

function KoreanAddressConverter() {
  const [addr, setAddr] = useState('서울특별시 중구 세종대로 110')
  const output = addr.includes('서울') ? addr.replace('서울특별시', 'Seoul').replace('중구', 'Jung-gu').replace('세종대로', 'Sejong-daero') : addr
  return <Shell slug="korean-address-converter" result={<ResultText value={output} rows={5} />}><Field label="Input"><Textarea rows={8} value={addr} onChange={(e) => setAddr(e.target.value)} /></Field></Shell>
}

function Memorial49Calc() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const d = new Date(date)
  d.setDate(d.getDate() + 48)
  return <Shell slug="memorial-49-calc" result={<ResultText rows={4} value={`49th day: ${d.toISOString().slice(0, 10)}`} />}><Field label="Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field></Shell>
}

function PomodoroTimer() {
  const [work, setWork] = useState('25'), [rest, setRest] = useState('5'), [seconds, setSeconds] = useState(25 * 60), [running, setRunning] = useState(false), [mode, setMode] = useState<'work' | 'break'>('work')
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [running])
  const min = Math.floor(seconds / 60), sec = seconds % 60
  return <Shell slug="pomodoro-timer" result={<div className="text-center"><div className="text-6xl font-bold text-gray-900 dark:text-white">{String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}</div><p className="mt-2 text-sm text-gray-500">{mode === 'work' ? 'Focus' : 'Break'}</p></div>}>
    <div className="grid grid-cols-2 gap-3"><Field label="Work"><Input type="number" value={work} onChange={(e) => setWork(e.target.value)} /></Field><Field label="Break"><Input type="number" value={rest} onChange={(e) => setRest(e.target.value)} /></Field></div>
    <div className="flex gap-2"><Button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</Button><Button onClick={() => { const next = mode === 'work' ? 'break' : 'work'; setMode(next); setSeconds(n(next === 'work' ? work : rest) * 60); setRunning(false) }}>Reset</Button></div>
  </Shell>
}

function Stopwatch() {
  const [ms, setMs] = useState(0), [running, setRunning] = useState(false), [laps, setLaps] = useState<number[]>([])
  useEffect(() => {
    if (!running) return
    const started = Date.now() - ms
    const id = window.setInterval(() => setMs(Date.now() - started), 100)
    return () => window.clearInterval(id)
  }, [running, ms])
  const show = (value: number) => `${String(Math.floor(value / 60000)).padStart(2, '0')}:${String(Math.floor(value / 1000) % 60).padStart(2, '0')}.${String(Math.floor(value / 100) % 10)}`
  return <Shell slug="stopwatch" result={<ResultText value={laps.map(show).join('\n') || 'No laps'} />}><div className="text-5xl font-bold text-gray-900 dark:text-white">{show(ms)}</div><div className="flex gap-2"><Button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</Button><Button onClick={() => setLaps([ms, ...laps])}>Lap</Button><Button onClick={() => { setMs(0); setLaps([]); setRunning(false) }}>Reset</Button></div></Shell>
}

function TimezoneConverter() {
  const [base, setBase] = useState(new Date().toISOString().slice(0, 16))
  const zones = ['Asia/Seoul', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']
  const d = new Date(base)
  return <Shell slug="timezone-converter" result={<ResultText value={zones.map((zone) => `${zone}: ${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: zone }).format(d)}`).join('\n')} />}><Field label="Date"><Input type="datetime-local" value={base} onChange={(e) => setBase(e.target.value)} /></Field></Shell>
}

function ChecklistGen() {
  const [text, setText] = useState('Launch page\nCheck mobile\nRun build')
  const items = text.split(/\r?\n/).filter(Boolean)
  const url = `https://tooltoolz.com/checklist?items=${encodeURIComponent(items.join('|'))}`
  return <Shell slug="checklist-gen" result={<ResultText value={`${items.map((item) => `- [ ] ${item}`).join('\n')}\n\n${url}`} />}><Field label="Text"><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} /></Field></Shell>
}

function WorkdayCountdown() {
  const countdownRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [end, setEnd] = useState('18:00'), [now, setNow] = useState(new Date())
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id) }, [])
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === countdownRef.current)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])
  const [hh, mm] = end.split(':').map(Number)
  const target = new Date(now); target.setHours(hh || 18, mm || 0, 0, 0)
  const left = Math.max(0, target.getTime() - now.getTime())
  const remaining = `${String(Math.floor(left / 3600000)).padStart(2, '0')}:${String(Math.floor(left / 60000) % 60).padStart(2, '0')}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`
  return <Shell slug="workday-countdown" result={<div ref={countdownRef} className="flex min-h-52 flex-col items-center justify-center rounded-xl bg-white p-6 text-center text-gray-900 fullscreen:min-h-screen fullscreen:rounded-none fullscreen:bg-gray-950 fullscreen:text-white dark:bg-gray-900 dark:text-white"><div className={`text-5xl font-bold ${isFullscreen ? 'text-[clamp(5rem,16vw,18rem)] leading-none' : ''}`}>{remaining}</div><div className="mt-3 text-sm text-gray-500 fullscreen:text-3xl fullscreen:text-gray-300 dark:text-gray-400">{end}</div></div>}>
    <Field label="End"><Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
    <Button onClick={() => countdownRef.current?.requestFullscreen?.()}>Fullscreen</Button>
  </Shell>
}

function FullscreenClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id) }, [])
  return <Shell slug="fullscreen-clock" result={<div className="rounded-xl bg-gray-950 p-8 text-center text-white"><div className="text-6xl font-bold">{now.toLocaleTimeString()}</div><div className="mt-3 text-gray-300">{now.toLocaleDateString()}</div></div>}><Button onClick={() => document.documentElement.requestFullscreen?.()}>Start</Button></Shell>
}

function OnlineScoreboard() {
  const [a, setA] = useState('Home'), [b, setB] = useState('Away'), [sa, setSa] = useState(0), [sb, setSb] = useState(0)
  return <Shell slug="online-scoreboard" result={<div className="grid grid-cols-2 gap-3 text-center"><div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800"><p className="text-sm">{a}</p><strong className="text-5xl">{sa}</strong></div><div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800"><p className="text-sm">{b}</p><strong className="text-5xl">{sb}</strong></div></div>}>
    <div className="grid grid-cols-2 gap-3"><Field label="Team A"><Input value={a} onChange={(e) => setA(e.target.value)} /></Field><Field label="Team B"><Input value={b} onChange={(e) => setB(e.target.value)} /></Field></div>
    <div className="flex gap-2"><Button onClick={() => setSa(sa + 1)}>A +1</Button><Button onClick={() => setSb(sb + 1)}>B +1</Button><Button onClick={() => { setSa(0); setSb(0) }}>Reset</Button></div>
  </Shell>
}

const places = [['Seoul', 37.5665, 126.9780], ['New York', 40.7128, -74.0060], ['London', 51.5072, -0.1276], ['Tokyo', 35.6762, 139.6503], ['Paris', 48.8566, 2.3522]]
function LatitudeLongitudeFinder() {
  const [query, setQuery] = useState('Seoul')
  const found = places.find(([name]) => String(name).toLowerCase().includes(query.toLowerCase())) || places[0]
  return <Shell slug="latitude-longitude-finder" result={<ResultText rows={5} value={`${found[0]}\nLatitude: ${found[1]}\nLongitude: ${found[2]}\nMap: https://www.google.com/maps?q=${found[1]},${found[2]}`} />}><Field label="Search"><Input value={query} onChange={(e) => setQuery(e.target.value)} /></Field></Shell>
}

function UnitConverter() {
  const [type, setType] = useState('length'), [amount, setAmount] = useState('1')
  const v = n(amount)
  const output = type === 'length' ? `${v} m = ${v * 100} cm = ${v * 3.28084} ft` : type === 'weight' ? `${v} kg = ${v * 1000} g = ${v * 2.20462} lb` : `${v} m2 = ${v * 10.7639} ft2 = ${v / 3.3058} pyeong`
  return <Shell slug="unit-converter" result={<ResultText rows={5} value={output} />}><Field label="Mode"><Select value={type} onChange={(e) => setType(e.target.value)}><option value="length">Length</option><option value="weight">Weight</option><option value="area">Area</option></Select></Field><Field label="Amount"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field></Shell>
}

function CelsiusFahrenheit() {
  const [c, setC] = useState('25')
  const f = n(c) * 9 / 5 + 32
  return <Shell slug="celsius-fahrenheit" result={<ResultText rows={4} value={`${c} C = ${fmt(f, 'en')} F\n${fmt(f, 'en')} F = ${fmt((f - 32) * 5 / 9, 'en')} C`} />}><Field label="Celsius"><Input type="number" value={c} onChange={(e) => setC(e.target.value)} /></Field></Shell>
}

const emojiList = [
  // 얼굴·감정
  '😀 smile happy grin 웃음 기쁨', '😁 grin beam 활짝', '😂 laugh cry joy 웃겨', '🤣 rofl laugh 뒹굴', '😃 happy smile 행복', '😄 smile happy 기쁨', '😅 sweat nervous 식은땀', '😆 laugh haha 웃음', '😉 wink 윙크', '😊 blush smile 수줍음', '😋 yum delicious 맛있어', '😎 cool sunglasses 쿨', '😍 love heart eyes 사랑', '🥰 love hearts 사랑스러움', '😘 kiss 키스', '😗 kiss 입맞춤', '😙 kiss smile 키스', '😚 kiss 뽀뽀', '🤩 star struck excited 신남', '🥳 party celebrate 파티', '😏 smirk 비웃음', '😒 unamused 불만', '😞 disappointed 실망', '😔 pensive sad 슬픔', '😟 worried 걱정', '😕 confused 혼란', '🙁 frown sad 슬픔', '😣 struggling 힘들어', '😖 confounded 곤란', '😫 tired 지쳐', '😩 weary 지침', '🥺 pleading sad 슬픈눈', '😢 cry tear 눈물', '😭 sob cry 엉엉', '😤 triumph angry 코웃음', '😠 angry mad 화남', '😡 rage fury 분노', '🤬 swearing angry 욕', '🤯 exploding mind shocked 충격', '😳 flushed shocked 당황', '🥵 hot sweating 더워', '🥶 cold freezing 추워', '😱 scream horror 비명', '😨 fearful scared 무서워', '😰 anxious sweat 불안', '😥 sad relieved 안도눈물', '🤗 hugging hug 안아줘', '🤔 thinking 생각', '🤭 hand over mouth 헉', '🤫 shush quiet 쉿', '🤐 zipper mouth 입다물기', '😐 neutral 무표정', '😑 expressionless 무감각', '😶 no mouth 말없음', '🙄 eye roll 눈굴림', '😬 grimace 찡그림', '🤥 lying pinocchio 거짓말', '😴 sleep tired 졸려', '🤤 drooling 침흘림', '😷 mask sick 아파', '🤒 thermometer sick 열', '🤕 bandage hurt 다쳐', '🤢 nauseated sick 메스꺼움', '🤮 vomiting sick 구역질', '🤧 sneezing sick 재채기', '🥴 woozy drunk 어지러움', '😵 dizzy 어지럼', '🤠 cowboy 카우보이', '🥸 disguise 변장', '🥹 holding back tears 감동', '😇 angel halo 천사', '🤑 money dollar 돈독', '😈 devil evil 악마', '👿 devil angry 화난악마', '💀 skull death 해골', '☠️ skull crossbones 독', '👻 ghost 유령', '👽 alien 외계인', '🤖 robot 로봇', '💩 poop funny 똥', '🎭 masks theater 연극',
  // 손·제스처
  '👍 thumbs up good like 좋아요', '👎 thumbs down bad dislike 싫어요', '👌 ok perfect 완벽', '✌️ peace victory 평화', '🤞 fingers crossed luck 행운', '🤟 love you 사랑해', '🤘 rock metal 록', '🤙 call me 전화해', '👈 point left 왼쪽', '👉 point right 오른쪽', '👆 point up 위', '👇 point down 아래', '☝️ one index 하나', '✋ hand stop 멈춰', '🤚 raised back hand 손', '🖐 hand five 다섯', '🖖 vulcan salute 스팍', '👋 wave hi bye 안녕', '🤜 fist right 주먹', '🤛 fist left 주먹', '👊 fist punch 펀치', '✊ raised fist 주먹', '🙌 hands praise 짝짝', '👏 clap applause 박수', '🤲 palms up 두손', '🙏 pray thank please 감사 기도', '💪 muscle strong flex 근육', '🦾 mechanical arm 의수', '🖕 middle finger 욕', '✍️ writing 글쓰기', '🤳 selfie 셀카', '💅 nail polish 네일', '🤝 handshake 악수',
  // 사람·역할
  '👶 baby infant 아기', '🧒 child kid 어린이', '👦 boy 소년', '👧 girl 소녀', '🧑 person adult 사람', '👱 blond 금발', '👨 man 남자', '👩 woman 여자', '🧔 beard 수염', '👴 old man grandfather 할아버지', '👵 old woman grandmother 할머니', '👮 police officer cop 경찰', '💂 guard 경비', '🕵️ detective spy 탐정', '👷 construction worker 건설', '🧑‍⚕️ doctor health 의사', '🧑‍🎓 student graduate 학생', '🧑‍🏫 teacher 선생님', '🧑‍🍳 cook chef 요리사', '🧑‍🌾 farmer 농부', '🧑‍🔧 mechanic 정비사', '🧑‍💻 technologist coder 개발자', '🧑‍🎤 singer rockstar 가수', '🧑‍🎨 artist painter 화가', '🧑‍✈️ pilot 파일럿', '🧑‍🚀 astronaut 우주비행사', '🧑‍🚒 firefighter 소방관', '🤶 mrs claus santa 산타', '🎅 santa claus 산타',
  // 동물
  '🐶 dog puppy 강아지', '🐱 cat kitten 고양이', '🐭 mouse 쥐', '🐹 hamster 햄스터', '🐰 rabbit bunny 토끼', '🦊 fox 여우', '🐻 bear 곰', '🐼 panda 판다', '🐨 koala 코알라', '🐯 tiger 호랑이', '🦁 lion 사자', '🐮 cow 소', '🐷 pig 돼지', '🐸 frog 개구리', '🐵 monkey 원숭이', '🙈 see no evil monkey 원숭이', '🙉 hear no evil 원숭이', '🙊 speak no evil 원숭이', '🐔 chicken 닭', '🐧 penguin 펭귄', '🐦 bird 새', '🦆 duck 오리', '🦅 eagle 독수리', '🦉 owl 부엉이', '🦇 bat 박쥐', '🐺 wolf 늑대', '🐗 boar 멧돼지', '🐴 horse 말', '🦄 unicorn 유니콘', '🐝 bee 벌', '🐛 bug caterpillar 애벌레', '🦋 butterfly 나비', '🐌 snail 달팽이', '🐞 ladybug 무당벌레', '🐜 ant 개미', '🦟 mosquito 모기', '🐢 turtle 거북이', '🐍 snake 뱀', '🦎 lizard 도마뱀', '🐊 crocodile 악어', '🐳 whale 고래', '🐋 whale 고래', '🦈 shark 상어', '🐬 dolphin 돌고래', '🐟 fish 물고기', '🐠 tropical fish 열대어', '🦐 shrimp 새우', '🦞 lobster 바닷가재', '🦀 crab 게', '🐙 octopus 문어', '🦑 squid 오징어', '🐡 blowfish 복어', '🦭 seal 물개', '🐘 elephant 코끼리', '🦏 rhino 코뿔소', '🦛 hippo 하마', '🦒 giraffe 기린', '🦓 zebra 얼룩말', '🦌 deer 사슴', '🐕 dog 개', '🐈 cat 고양이', '🐓 rooster 수탉', '🦃 turkey 칠면조', '🦚 peacock 공작', '🦜 parrot 앵무새', '🦢 swan 백조', '🕊️ dove peace 비둘기', '🐇 rabbit 토끼', '🦝 raccoon 너구리', '🦡 badger 오소리', '🦦 otter 수달', '🦥 sloth 나무늘보', '🐿️ chipmunk 다람쥐', '🦔 hedgehog 고슴도치',
  // 음식·음료
  '🍎 apple red 사과', '🍊 orange 오렌지', '🍋 lemon 레몬', '🍇 grapes 포도', '🍓 strawberry 딸기', '🫐 blueberry 블루베리', '🍈 melon 멜론', '🍉 watermelon 수박', '🍑 peach 복숭아', '🍒 cherry 체리', '🍌 banana 바나나', '🍍 pineapple 파인애플', '🥭 mango 망고', '🥝 kiwi 키위', '🍅 tomato 토마토', '🫒 olive 올리브', '🥑 avocado 아보카도', '🍆 eggplant 가지', '🥦 broccoli 브로콜리', '🥕 carrot 당근', '🌽 corn 옥수수', '🌶️ pepper spicy 고추', '🧄 garlic 마늘', '🧅 onion 양파', '🥔 potato 감자', '🍠 sweet potato 고구마', '🥜 peanut 땅콩', '🍞 bread 빵', '🥐 croissant 크루아상', '🥨 pretzel 프레첼', '🥯 bagel 베이글', '🧀 cheese 치즈', '🥚 egg 달걀', '🍳 egg frying 계란', '🧈 butter 버터', '🥞 pancake 팬케이크', '🧇 waffle 와플', '🥓 bacon 베이컨', '🍔 burger hamburger 햄버거', '🍟 fries 감자튀김', '🌭 hotdog 핫도그', '🍕 pizza 피자', '🌮 taco 타코', '🌯 burrito wrap 부리토', '🫔 tamale 타말레', '🥙 falafel 팔라펠', '🧆 falafel 팔라펠', '🥪 sandwich 샌드위치', '🥗 salad 샐러드', '🍝 spaghetti pasta 파스타', '🍜 noodle ramen 라면', '🍲 stew pot 찌개', '🍛 curry 카레', '🍣 sushi 초밥', '🍱 bento box 도시락', '🥟 dumpling 만두', '🍤 fried shrimp 튀김새우', '🍙 rice ball 주먹밥', '🍚 rice 밥', '🍘 rice cracker 전병', '🍥 fish cake 어묵', '🥮 moon cake 월병', '🍢 oden 꼬치', '🧁 cupcake 컵케이크', '🍰 cake slice 케이크', '🎂 birthday cake 생일케이크', '🍮 pudding custard 푸딩', '🍭 lollipop candy 사탕', '🍬 candy 사탕', '🍫 chocolate 초콜릿', '🍿 popcorn 팝콘', '🍩 donut 도넛', '🍪 cookie 쿠키', '🌰 chestnut 밤', '🥜 peanut nut 견과류', '☕ coffee 커피', '🍵 tea green 녹차', '🧃 juice 주스', '🥛 milk 우유', '🍺 beer 맥주', '🍻 beers cheers 건배', '🥂 champagne toast 샴페인', '🍷 wine 와인', '🥃 whiskey 위스키', '🍸 cocktail 칵테일', '🍹 tropical drink 열대음료', '🧉 mate 마테', '🍾 bottle champagne 샴페인', '🧊 ice 얼음', '🥤 cup straw 음료', '🧋 bubble tea boba 버블티',
  // 여행·장소
  '🌍 earth globe 지구', '🌎 earth america 지구', '🌏 earth asia 지구', '🗺️ map world 지도', '🧭 compass 나침반', '🏔️ mountain snow 설산', '⛰️ mountain 산', '🌋 volcano 화산', '🗻 mount fuji 후지산', '🏕️ camping tent 캠핑', '🏖️ beach 해변', '🏜️ desert 사막', '🏝️ island 섬', '🏞️ national park 공원', '🏟️ stadium 경기장', '🏛️ classical building 건물', '🏗️ construction 건설', '🏘️ houses 마을', '🏚️ abandoned house 빈집', '🏠 house home 집', '🏡 house garden 정원집', '🏢 office building 사무실', '🏣 post office 우체국', '🏤 post office 우체국', '🏥 hospital 병원', '🏦 bank 은행', '🏧 atm 현금인출기', '🏨 hotel 호텔', '🏩 love hotel 러브호텔', '🏪 store convenience 편의점', '🏫 school 학교', '🏬 department store 백화점', '🏭 factory 공장', '🗼 tokyo tower 도쿄타워', '🗽 statue liberty 자유의여신상', '⛪ church 교회', '🕌 mosque 모스크', '🛕 temple 절', '🕍 synagogue 유대교', '⛩️ shinto shrine 신사', '🗾 japan 일본', '🎌 japan flag 일장기', '🏔️ mountain 산', '🌁 foggy 안개', '🌃 night stars city 야경', '🏙️ cityscape 도시', '🌄 sunrise 일출', '🌅 sunrise 일출', '🌆 evening city 저녁도시', '🌇 sunset 일몰', '🌉 bridge night 야경다리', '🌌 galaxy milky way 은하수', '🌠 shooting star 유성', '🎇 sparkler 불꽃', '🎆 fireworks 불꽃놀이', '🌈 rainbow 무지개', '☁️ cloud 구름', '⛅ partly cloudy 구름조금', '🌤️ sun cloud 맑음', '🌥️ cloudy 흐림', '🌦️ rain sun 소나기', '🌧️ rain 비', '⛈️ thunder storm 폭풍', '🌩️ lightning 번개', '🌨️ snow 눈', '❄️ snowflake 눈송이', '⛄ snowman 눈사람', '🌬️ wind blowing 바람', '🌀 cyclone 사이클론', '🌊 wave ocean 파도', '💧 droplet water 물방울', '💦 splashing water 물', '☔ umbrella rain 우산',
  // 교통·탈것
  '🚗 car automobile 자동차', '🚕 taxi cab 택시', '🚙 suv truck 차', '🚌 bus 버스', '🚎 trolleybus 트롤리', '🏎️ racing car 레이싱카', '🚓 police car 경찰차', '🚑 ambulance 구급차', '🚒 fire truck 소방차', '🚐 minibus 미니버스', '🛻 pickup truck 픽업트럭', '🚚 delivery truck 트럭', '🚛 articulated lorry 대형트럭', '🚜 tractor 트랙터', '🛵 scooter 스쿠터', '🏍️ motorcycle 오토바이', '🚲 bicycle bike 자전거', '🛴 scooter kick 킥보드', '🛹 skateboard 스케이트보드', '🛺 auto rickshaw 툭툭', '🚁 helicopter 헬리콥터', '🛸 ufo flying saucer 비행접시', '🛶 canoe 카누', '⛵ sailboat 범선', '🚀 rocket space 로켓', '✈️ airplane plane 비행기', '🛩️ small airplane 경비행기', '🛫 departure takeoff 이륙', '🛬 arrival landing 착륙', '🪂 parachute 낙하산', '⛽ gas station fuel 주유소', '🚦 traffic light 신호등', '🛤️ railway track 철로', '🛣️ motorway highway 고속도로', '🗺️ map 지도', '🚂 train locomotive 기관차', '🚃 train car 열차', '🚄 bullet train 고속철', '🚅 bullet train 신칸센', '🚇 metro subway 지하철', '🚉 station 역', '🚊 tram 트램', '🚝 monorail 모노레일', '🚞 mountain railway 산악열차', '🛳️ ship cruise 유람선', '⛴️ ferry 페리', '🚢 ship ocean liner 여객선', '⚓ anchor 닻',
  // 활동·스포츠
  '⚽ soccer football 축구', '🏀 basketball 농구', '🏈 american football 미식축구', '⚾ baseball 야구', '🥎 softball 소프트볼', '🏐 volleyball 배구', '🏉 rugby 럭비', '🎾 tennis 테니스', '🏸 badminton 배드민턴', '🏒 hockey ice 하키', '🏑 field hockey 필드하키', '🏓 ping pong table tennis 탁구', '🥊 boxing glove 복싱', '🥋 martial arts 무술', '🎽 running shirt 런닝', '⛳ golf 골프', '🎿 ski skiing 스키', '🛷 sled 썰매', '🏂 snowboard 스노보드', '🪁 bow archery 양궁', '🎣 fishing 낚시', '🤿 diving snorkel 스쿠버', '🏋️ weightlifting gym 헬스', '🤸 gymnastics 체조', '🤼 wrestling 씨름', '🤺 fencing 펜싱', '🏇 horse racing 경마', '🧗 climbing 클라이밍', '🤾 handball 핸드볼', '🏌️ golf 골프', '🏄 surfing 서핑', '🚣 rowing 조정', '🧘 yoga meditation 요가', '🚴 cycling bike 사이클', '🏊 swimming 수영', '🤽 water polo 수구', '🧶 yarn knitting 뜨개질', '🎮 video game controller 게임', '🕹️ joystick 조이스틱', '🎲 dice 주사위', '♟️ chess 체스', '🎯 dart target 다트', '🎳 bowling 볼링', '🃏 joker card 카드', '🀄 mahjong 마작', '🎰 slot machine 슬롯',
  // 사무·물건
  '💻 laptop computer 노트북', '🖥️ desktop computer 데스크탑', '🖨️ printer 프린터', '⌨️ keyboard 키보드', '🖱️ mouse 마우스', '📱 phone mobile 핸드폰', '📲 mobile phone 휴대폰', '☎️ telephone 전화기', '📞 phone receiver 전화', '📟 pager 삐삐', '📠 fax 팩스', '📺 tv television 텔레비전', '📻 radio 라디오', '🎙️ microphone studio 마이크', '🎚️ level slider 슬라이더', '🎛️ control knobs 노브', '⏱️ stopwatch 스톱워치', '⏰ alarm clock 알람', '🕰️ clock 시계', '⌚ watch 손목시계', '📡 satellite antenna 안테나', '🔋 battery 배터리', '🔌 electric plug 플러그', '💡 light bulb idea 아이디어', '🔦 flashlight 손전등', '🕯️ candle 양초', '🪔 lamp diya 등불', '🧲 magnet 자석', '🪛 screwdriver 드라이버', '🔧 wrench 렌치', '🔨 hammer 망치', '⚒️ hammer pick 곡괭이', '🛠️ tools 도구', '⛏️ pick axe 도끼', '🔩 bolt nut 볼트', '🗜️ clamp 클램프', '🔑 key 열쇠', '🗝️ old key 옛날열쇠', '🔐 locked key 잠금', '🔏 locked pen 잠금펜', '🔒 locked 잠금', '🔓 unlocked 열림', '🪝 hook 갈고리', '🧰 toolbox 공구함', '🧲 magnet 자석', '💊 pill medicine 약', '💉 syringe injection 주사', '🩺 stethoscope 청진기', '🩹 bandage 반창고', '🩻 xray 엑스레이', '🔬 microscope 현미경', '🔭 telescope 망원경', '📡 antenna 안테나',
  // 글·사무용품
  '📝 pencil memo 메모', '✏️ pencil 연필', '🖊️ pen 볼펜', '🖋️ fountain pen 만년필', '📖 book open 책', '📚 books library 도서관', '📓 notebook 노트', '📔 notebook cover 노트', '📒 ledger 장부', '📕 closed book 교과서', '📗 green book 책', '📘 blue book 책', '📙 orange book 책', '📄 document page 문서', '📃 page curl 서류', '📑 bookmark tabs 탭', '📊 chart bar graph 막대그래프', '📈 chart up trend 상승', '📉 chart down trend 하락', '📋 clipboard 클립보드', '📌 pushpin 압정', '📍 round pushpin 위치', '📎 paperclip 클립', '🖇️ linked paperclip 연결클립', '📏 ruler 자', '📐 triangle ruler 삼각자', '✂️ scissors 가위', '🗃️ card file box 카드함', '🗂️ file folder 폴더', '📁 folder 폴더', '📂 open folder 열린폴더', '🗑️ wastebasket trash 휴지통', '📦 package box 박스', '📫 mailbox closed 우편함', '📬 mailbox open 우편함', '📮 postbox 우체통', '🗳️ ballot box 투표함', '✉️ envelope mail 편지', '📧 email 이메일', '📨 incoming envelope 수신', '📩 envelope arrow 발신', '📤 outbox tray 발신함', '📥 inbox tray 수신함',
  // 기호·심볼
  '❤️ heart love red 사랑', '🧡 orange heart 주황', '💛 yellow heart 노랑', '💚 green heart 초록', '💙 blue heart 파랑', '💜 purple heart 보라', '🖤 black heart 검정', '🤍 white heart 흰색', '🤎 brown heart 갈색', '💔 broken heart 상처', '❣️ heart exclamation 느낌표', '💕 two hearts 두하트', '💞 revolving hearts 회전하트', '💓 beating heart 설레임', '💗 growing heart 커지는하트', '💖 sparkling heart 반짝하트', '💘 heart arrow 큐피드', '💝 heart ribbon 선물하트', '💟 heart decoration 장식하트', '☮️ peace 평화', '✝️ cross 십자가', '☯️ yin yang 음양', '✡️ star david 다윗별', '🔯 star 별', '☸️ dharma wheel 법륜', '🆗 ok button 확인', '🆕 new button 새것', '🆙 up button 위로', '🆒 cool button 쿨', '🆓 free button 무료', '🆖 ng button 아니오', '🅰️ blood type a a형', '🅱️ blood type b b형', '🆎 blood type ab ab형', '🅾️ blood type o o형', '⛔ no entry 금지', '🚫 prohibited 금지', '💯 hundred percent 100점', '✅ check mark done 완료', '❎ cross mark 엑스', '🔴 red circle 빨강', '🟠 orange circle 주황', '🟡 yellow circle 노랑', '🟢 green circle 초록', '🔵 blue circle 파랑', '🟣 purple circle 보라', '⚫ black circle 검정', '⚪ white circle 흰색', '🟤 brown circle 갈색', '🔶 orange diamond 다이아', '🔷 blue diamond 다이아', '🔸 small orange diamond 작은다이아', '🔹 small blue diamond 작은다이아', '🔺 red triangle up 삼각형', '🔻 red triangle down 역삼각형', '💠 diamond blue 다이아', '🔘 radio button 라디오버튼', '🔲 black square button 버튼', '🔳 white square button 버튼', '▪️ small black square 검정사각', '▫️ small white square 흰사각', '◾ medium black square 중간검정', '◽ medium white square 중간흰색', '◼️ medium large black 검정', '◻️ medium large white 흰색', '⬛ large black square 큰검정', '⬜ large white square 큰흰색', '🟥 red square 빨강사각', '🟧 orange square 주황사각', '🟨 yellow square 노랑사각', '🟩 green square 초록사각', '🟦 blue square 파랑사각', '🟪 purple square 보라사각', '⭐ star 별', '🌟 glowing star 빛나는별', '💫 dizzy star 별', '✨ sparkles 반짝', '🌠 shooting star 유성', '🎆 fireworks 불꽃놀이', '🎇 sparkler 불꽃',
  // 자연·날씨
  '🌱 seedling sprout 새싹', '🌿 herb leaf 허브', '☘️ shamrock clover 클로버', '🍀 four leaf clover 네잎클로버', '🌾 sheaf rice 벼', '🌵 cactus 선인장', '🎄 christmas tree 크리스마스', '🌲 evergreen pine 소나무', '🌳 deciduous tree 나무', '🌴 palm tree 야자수', '🍄 mushroom 버섯', '🌺 hibiscus flower 꽃', '🌻 sunflower 해바라기', '🌹 rose 장미', '🥀 wilted rose 시든장미', '🌷 tulip 튤립', '🌸 cherry blossom 벚꽃', '💐 bouquet flower 꽃다발', '🌼 blossom 꽃', '🌞 sun face 해', '🌝 full moon face 보름달', '🌛 crescent moon 초승달', '🌜 crescent moon 그믐달', '🌚 new moon face 어두운달', '🌕 full moon 보름달', '🌙 crescent moon night 달', '⭐ star 별', '🌟 star shining 별', '☀️ sun sunshine 태양', '🌤 sunny cloud 맑음', '🌈 rainbow 무지개', '❄️ snowflake cold winter 눈', '⛄ snowman 눈사람', '🔥 fire hot flame 불', '💧 water drop 물', '🌊 wave ocean sea 바다',
  // 파티·이벤트
  '🎉 party celebrate tada 파티', '🎊 confetti 색종이', '🎈 balloon 풍선', '🎁 gift present 선물', '🎀 ribbon bow 리본', '🎂 birthday cake 생일', '🎃 jack o lantern halloween 할로윈', '🎄 christmas 크리스마스', '🎋 tanabata bamboo 칠월칠석', '🎍 pine decoration 솔장식', '🎎 dolls 인형', '🎏 carp streamer 잉어깃발', '🎐 wind chime 풍경', '🧨 firecracker 폭죽', '✨ sparkles glitter 반짝', '🎑 moon viewing 달맞이', '🪅 pinata 피냐타', '🎖️ medal military 훈장', '🏆 trophy winner 트로피', '🥇 gold medal first 금메달', '🥈 silver medal second 은메달', '🥉 bronze medal third 동메달', '🏅 medal sports 메달', '🎗️ ribbon reminder 리본', '🎫 ticket 티켓', '🎟️ admission ticket 입장권',
  // 음악·예술
  '🎵 music note 음표', '🎶 notes music 음악', '🎼 musical score 악보', '🎤 microphone singing 마이크', '🎧 headphones music 헤드폰', '🎷 saxophone 색소폰', '🎸 guitar 기타', '🎹 piano keyboard 피아노', '🎺 trumpet 트럼펫', '🎻 violin 바이올린', '🥁 drum 드럼', '🪘 long drum 드럼', '🪗 accordion 아코디언', '🎙️ studio microphone 마이크', '📻 radio 라디오', '🎬 clapper board film 영화', '🎥 movie camera 카메라', '📽️ film projector 영사기', '🎞️ film frames 필름', '📺 television 텔레비전', '📷 camera 카메라', '📸 camera flash 사진', '🖼️ painting picture 그림', '🎨 palette art 팔레트', '🖌️ paintbrush 붓', '✏️ pencil 연필', '🎭 theater masks 연극',
]
function EmojiSearch() {
  const [query, setQuery] = useState('')
  const filtered = query
    ? emojiList.filter((e) => e.toLowerCase().includes(query.toLowerCase()))
    : emojiList
  return (
    <Shell
      slug="emoji-search"
      result={
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
          {filtered.map((e) => {
            const emoji = e.split(' ')[0]
            const label = e.split(' ').slice(1).join(' ')
            return (
              <button
                key={e}
                type="button"
                onClick={() => navigator.clipboard.writeText(emoji)}
                className="rounded-xl bg-gray-50 p-3 text-left dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 truncate">{label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      }
    >
      <Field label="Search">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="smile, fire, 고양이..." />
      </Field>
    </Shell>
  )
}

const chars = ['←', '→', '↑', '↓', '↔', '✓', '✕', '★', '☆', '©', '®', '™', '∞', '≈', '≠', '≤', '≥', '±', '÷', '×', '§', '¶', '•', '…']
function SpecialChars() {
  return <Shell slug="special-chars" result={<div className="grid grid-cols-6 gap-2">{chars.map((ch) => <button key={ch} type="button" onClick={() => navigator.clipboard.writeText(ch)} className="rounded-xl bg-gray-50 p-3 text-xl dark:bg-gray-800">{ch}</button>)}</div>}><ResultText value={chars.join(' ')} rows={4} /></Shell>
}

export default function MiscTool({ slug, locale }: { slug: MiscSlug; locale: string }) {
  void locale
  const tools: Record<MiscSlug, React.ReactNode> = {
    'css-shadow-gen': <CssShadowGen />,
    'css-gradient-gen': <CssGradientGen />,
    'font-preview': <FontPreview />,
    'color-palette-gen': <ColorPaletteGen />,
    'aspect-ratio-calc': <AspectRatioCalc />,
    'random-color-combo': <RandomColorCombo />,
    'barcode-gen': <BarcodeGen />,
    'number-to-korean': <NumberToKorean />,
    'consonant-extractor': <ConsonantExtractor />,
    'manuscript-calc': <ManuscriptCalc />,
    'korean-age-calc': <KoreanAgeCalc />,
    'real-estate-fee-calc': <RealEstateFeeCalc />,
    'severance-pay-calc': <SeverancePayCalc />,
    'unemployment-benefit-calc': <UnemploymentBenefitCalc />,
    'korean-address-converter': <KoreanAddressConverter />,
    'memorial-49-calc': <Memorial49Calc />,
    'pomodoro-timer': <PomodoroTimer />,
    'stopwatch': <Stopwatch />,
    'timezone-converter': <TimezoneConverter />,
    'checklist-gen': <ChecklistGen />,
    'workday-countdown': <WorkdayCountdown />,
    'fullscreen-clock': <FullscreenClock />,
    'online-scoreboard': <OnlineScoreboard />,
    'latitude-longitude-finder': <LatitudeLongitudeFinder />,
    'unit-converter': <UnitConverter />,
    'celsius-fahrenheit': <CelsiusFahrenheit />,
    'emoji-search': <EmojiSearch />,
    'special-chars': <SpecialChars />,
  }
  return tools[slug]
}
