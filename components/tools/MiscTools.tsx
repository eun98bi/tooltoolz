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
  const [end, setEnd] = useState('18:00'), [now, setNow] = useState(new Date())
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id) }, [])
  const [hh, mm] = end.split(':').map(Number)
  const target = new Date(now); target.setHours(hh || 18, mm || 0, 0, 0)
  const left = Math.max(0, target.getTime() - now.getTime())
  const remaining = `${String(Math.floor(left / 3600000)).padStart(2, '0')}:${String(Math.floor(left / 60000) % 60).padStart(2, '0')}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`
  return <Shell slug="workday-countdown" result={<div ref={countdownRef} className="flex min-h-52 flex-col items-center justify-center rounded-xl bg-white p-6 text-center text-gray-900 fullscreen:min-h-screen fullscreen:rounded-none fullscreen:bg-gray-950 fullscreen:text-white dark:bg-gray-900 dark:text-white"><div className="text-5xl font-bold fullscreen:text-[clamp(5rem,16vw,18rem)] fullscreen:leading-none">{remaining}</div><div className="mt-3 text-sm text-gray-500 fullscreen:text-3xl fullscreen:text-gray-300 dark:text-gray-400">{end}</div></div>}>
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

const emojiList = ['😀 smile', '😂 laugh', '😍 love', '🔥 fire', '✅ check', '⚠ warning', '🚀 rocket', '💡 idea', '⭐ star', '❤️ heart']
function EmojiSearch() {
  const [query, setQuery] = useState('')
  return <Shell slug="emoji-search" result={<div className="grid grid-cols-2 gap-2">{emojiList.filter((e) => e.includes(query.toLowerCase())).map((e) => <button key={e} type="button" onClick={() => navigator.clipboard.writeText(e.split(' ')[0])} className="rounded-xl bg-gray-50 p-3 text-left text-xl dark:bg-gray-800">{e}</button>)}</div>}><Field label="Search"><Input value={query} onChange={(e) => setQuery(e.target.value)} /></Field></Shell>
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
