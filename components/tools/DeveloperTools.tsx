'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

type DevSlug =
  | 'regex-tester'
  | 'hash-gen'
  | 'uuid-gen'
  | 'base-converter'
  | 'unix-timestamp'
  | 'yaml-json-converter'
  | 'json-to-csv'
  | 'image-to-base64'
  | 'robots-txt-gen'
  | 'lorem-ipsum-gen'
  | 'current-ip-checker'

type Lang = 'kr' | 'en'

const ko: Record<string, string> = {
  Pattern: '패턴',
  Flags: '플래그',
  Text: '텍스트',
  Matches: '매치',
  Input: '입력',
  Output: '출력',
  Generate: '생성',
  Count: '개수',
  Uppercase: '대문자',
  Hyphen: '하이픈',
  Value: '값',
  From: '원본 진법',
  To: '대상 진법',
  Now: '현재',
  Date: '날짜',
  Timestamp: '타임스탬프',
  Mode: '모드',
  'Choose image': '이미지 선택',
  'Data URI': 'Data URI',
  'User agent': 'User-agent',
  Disallow: '차단',
  Allow: '허용',
  Sitemap: '사이트맵',
  Paragraphs: '문단',
  Sentences: '문장',
  Words: '단어',
  Refresh: '새로고침',
  'Public IP': '공인 IP',
  Status: '상태',
}

function label(text: string, locale: string) {
  return locale === 'kr' ? ko[text] ?? text : text
}

function Field({ label: text, children }: { label: string; children: React.ReactNode }) {
  const locale = useLocale()
  return <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label(text, locale)}</span>{children}</label>
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Button({ children, onClick }: { children: string; onClick: () => void }) {
  const locale = useLocale()
  return <button type="button" onClick={onClick} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-700">{label(children, locale)}</button>
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">{children}</div>
}

function Shell({ slug, children, result }: { slug: DevSlug; children: React.ReactNode; result: React.ReactNode }) {
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

function Result({ value, rows = 14 }: { value: string; rows?: number }) {
  return <Textarea rows={rows} value={value} readOnly />
}

function RegexTester() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b')
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('Contact hello@example.com or admin@test.dev')
  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags)
      const matches = Array.from(text.matchAll(regex))
      return matches.length ? matches.map((m, i) => `${i + 1}. ${m[0]} @ ${m.index}`).join('\n') : 'No matches'
    } catch (error) {
      return error instanceof Error ? error.message : 'Invalid regex'
    }
  }, [pattern, flags, text])
  return <Shell slug="regex-tester" result={<Result value={result} />}>
    <Field label="Pattern"><Input value={pattern} onChange={(e) => setPattern(e.target.value)} /></Field>
    <Field label="Flags"><Input value={flags} onChange={(e) => setFlags(e.target.value)} /></Field>
    <Field label="Text"><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} /></Field>
  </Shell>
}

function md5(input: string) {
  const bytes = Array.from(new TextEncoder().encode(input))
  const bitLength = bytes.length * 8
  bytes.push(0x80)
  while (bytes.length % 64 !== 56) bytes.push(0)
  for (let i = 0; i < 8; i += 1) bytes.push(Math.floor(bitLength / (2 ** (8 * i))) & 0xff)

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476
  const shifts = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]
  const constants = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0)
  const rotate = (value: number, shift: number) => (value << shift) | (value >>> (32 - shift))

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = Array.from({ length: 16 }, (_, i) => (
      bytes[offset + i * 4] | (bytes[offset + i * 4 + 1] << 8) | (bytes[offset + i * 4 + 2] << 16) | (bytes[offset + i * 4 + 3] << 24)
    ) >>> 0)
    let a = a0, b = b0, c = c0, d = d0
    for (let i = 0; i < 64; i += 1) {
      let f = 0, g = 0
      if (i < 16) { f = (b & c) | (~b & d); g = i }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16 }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16 }
      else { f = c ^ (b | ~d); g = (7 * i) % 16 }
      const next = d
      d = c
      c = b
      b = (b + rotate((a + f + constants[i] + words[g]) >>> 0, shifts[i])) >>> 0
      a = next
    }
    a0 = (a0 + a) >>> 0
    b0 = (b0 + b) >>> 0
    c0 = (c0 + c) >>> 0
    d0 = (d0 + d) >>> 0
  }

  return [a0, b0, c0, d0].map((word) => Array.from({ length: 4 }, (_, i) => ((word >>> (8 * i)) & 0xff).toString(16).padStart(2, '0')).join('')).join('')
}

async function digest(algorithm: AlgorithmIdentifier, input: string) {
  const bytes = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest(algorithm, bytes)
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function HashGen() {
  const [input, setInput] = useState('tooltoolz')
  const [output, setOutput] = useState('')
  useEffect(() => {
    let alive = true
    Promise.all([digest('SHA-1', input), digest('SHA-256', input)]).then(([sha1, sha256]) => {
      if (alive) setOutput(`MD5: ${md5(input)}\nSHA-1: ${sha1}\nSHA-256: ${sha256}`)
    }).catch(() => setOutput('Hashing is not available in this browser context.'))
    return () => { alive = false }
  }, [input])
  return <Shell slug="hash-gen" result={<Result value={output} rows={8} />}>
    <Field label="Input"><Textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
  </Shell>
}

function UuidGen() {
  const locale = useLocale()
  const [count, setCount] = useState('5')
  const [upper, setUpper] = useState(false)
  const [hyphen, setHyphen] = useState(true)
  const [items, setItems] = useState<string[]>(() => Array.from({ length: 5 }, () => crypto.randomUUID()))
  const generate = () => {
    const next = Array.from({ length: Math.max(1, Number(count) || 1) }, () => crypto.randomUUID()).map((id) => {
      let value = hyphen ? id : id.replace(/-/g, '')
      if (upper) value = value.toUpperCase()
      return value
    })
    setItems(next)
  }
  return <Shell slug="uuid-gen" result={<Result value={items.join('\n')} />}>
    <Field label="Count"><Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(e.target.value)} /></Field>
    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />{label('Uppercase', locale)}</label>
    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={hyphen} onChange={(e) => setHyphen(e.target.checked)} />{label('Hyphen', locale)}</label>
    <Button onClick={generate}>Generate</Button>
  </Shell>
}

function BaseConverter() {
  const [value, setValue] = useState('255')
  const [from, setFrom] = useState('10')
  const parsed = Number.parseInt(value.trim(), Number(from))
  const result = Number.isFinite(parsed) ? `BIN: ${parsed.toString(2)}\nOCT: ${parsed.toString(8)}\nDEC: ${parsed.toString(10)}\nHEX: ${parsed.toString(16).toUpperCase()}` : 'Invalid number'
  return <Shell slug="base-converter" result={<Result value={result} rows={8} />}>
    <Field label="Value"><Input value={value} onChange={(e) => setValue(e.target.value)} /></Field>
    <Field label="From"><Select value={from} onChange={(e) => setFrom(e.target.value)}><option value="2">Base 2</option><option value="8">Base 8</option><option value="10">Base 10</option><option value="16">Base 16</option></Select></Field>
  </Shell>
}

function UnixTimestamp() {
  const now = Math.floor(Date.now() / 1000)
  const [stamp, setStamp] = useState(String(now))
  const [date, setDate] = useState(new Date(now * 1000).toISOString().slice(0, 16))
  const fromStamp = new Date(Number(stamp) * 1000)
  const fromDate = Math.floor(new Date(date).getTime() / 1000)
  return <Shell slug="unix-timestamp" result={<Result rows={8} value={`Unix seconds: ${fromDate || 0}\nFrom timestamp: ${Number.isFinite(fromStamp.getTime()) ? fromStamp.toISOString() : 'Invalid date'}\nLocal: ${Number.isFinite(fromStamp.getTime()) ? fromStamp.toLocaleString() : 'Invalid date'}`} />}>
    <Field label="Timestamp"><Input value={stamp} onChange={(e) => setStamp(e.target.value)} /></Field>
    <Field label="Date"><Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
    <Button onClick={() => { const next = Math.floor(Date.now() / 1000); setStamp(String(next)); setDate(new Date(next * 1000).toISOString().slice(0, 16)) }}>Now</Button>
  </Shell>
}

function parseSimpleYaml(text: string) {
  const obj: Record<string, string | number | boolean> = {}
  text.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^:#]+):\s*(.*)$/)
    if (!match) return
    const raw = match[2].trim()
    obj[match[1].trim()] = raw === 'true' ? true : raw === 'false' ? false : Number.isFinite(Number(raw)) && raw !== '' ? Number(raw) : raw.replace(/^["']|["']$/g, '')
  })
  return obj
}

function toYaml(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return String(value)
  return Object.entries(value as Record<string, unknown>).map(([key, val]) => `${key}: ${typeof val === 'object' ? JSON.stringify(val) : String(val)}`).join('\n')
}

function YamlJsonConverter() {
  const [mode, setMode] = useState('yamlToJson')
  const [input, setInput] = useState('name: tooltoolz\nfree: true\ncount: 11')
  const output = useMemo(() => {
    try {
      if (mode === 'yamlToJson') return JSON.stringify(parseSimpleYaml(input), null, 2)
      return toYaml(JSON.parse(input))
    } catch (error) {
      return error instanceof Error ? error.message : 'Conversion failed'
    }
  }, [mode, input])
  return <Shell slug="yaml-json-converter" result={<Result value={output} />}>
    <Field label="Mode"><Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="yamlToJson">YAML to JSON</option><option value="jsonToYaml">JSON to YAML</option></Select></Field>
    <Field label="Input"><Textarea rows={12} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
  </Shell>
}

function csvEscape(value: unknown) {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function jsonToCsv(text: string) {
  const data = JSON.parse(text)
  const rows = Array.isArray(data) ? data : [data]
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
  return [headers.join(','), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(','))].join('\n')
}

function csvToJson(text: string) {
  const [head = '', ...lines] = text.trim().split(/\r?\n/)
  const headers = head.split(',').map((item) => item.trim())
  return JSON.stringify(lines.map((line) => Object.fromEntries(line.split(',').map((value, i) => [headers[i], value.trim()]))), null, 2)
}

function JsonToCsv() {
  const [mode, setMode] = useState('jsonToCsv')
  const [input, setInput] = useState('[\n  { "name": "Ada", "score": 98 },\n  { "name": "Linus", "score": 91 }\n]')
  const output = useMemo(() => {
    try { return mode === 'jsonToCsv' ? jsonToCsv(input) : csvToJson(input) } catch (error) { return error instanceof Error ? error.message : 'Conversion failed' }
  }, [mode, input])
  return <Shell slug="json-to-csv" result={<Result value={output} />}>
    <Field label="Mode"><Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="jsonToCsv">JSON to CSV</option><option value="csvToJson">CSV to JSON</option></Select></Field>
    <Field label="Input"><Textarea rows={12} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
  </Shell>
}

function ImageToBase64() {
  const [output, setOutput] = useState('')
  const [name, setName] = useState('')
  return <Shell slug="image-to-base64" result={<Result value={output || 'Choose an image to create a data URI.'} />}>
    <Field label="Choose image"><Input type="file" accept="image/*" onChange={(e) => {
      const file = e.target.files?.[0]
      if (!file) return
      setName(`${file.name} (${Math.round(file.size / 1024)} KB)`)
      const reader = new FileReader()
      reader.onload = () => setOutput(String(reader.result))
      reader.readAsDataURL(file)
    }} /></Field>
    <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
  </Shell>
}

function RobotsTxtGen() {
  const [agent, setAgent] = useState('*')
  const [disallow, setDisallow] = useState('/admin\n/private')
  const [allow, setAllow] = useState('/')
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml')
  const output = [`User-agent: ${agent}`, ...disallow.split(/\r?\n/).filter(Boolean).map((v) => `Disallow: ${v}`), ...allow.split(/\r?\n/).filter(Boolean).map((v) => `Allow: ${v}`), sitemap ? `Sitemap: ${sitemap}` : ''].filter(Boolean).join('\n')
  return <Shell slug="robots-txt-gen" result={<Result value={output} rows={10} />}>
    <Field label="User agent"><Input value={agent} onChange={(e) => setAgent(e.target.value)} /></Field>
    <Field label="Disallow"><Textarea rows={4} value={disallow} onChange={(e) => setDisallow(e.target.value)} /></Field>
    <Field label="Allow"><Textarea rows={3} value={allow} onChange={(e) => setAllow(e.target.value)} /></Field>
    <Field label="Sitemap"><Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></Field>
  </Shell>
}

const ipsum = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ')

function LoremIpsumGen() {
  const [paragraphs, setParagraphs] = useState('3')
  const [sentences, setSentences] = useState('4')
  const [words, setWords] = useState('12')
  const output = useMemo(() => Array.from({ length: Math.max(1, Number(paragraphs) || 1) }, (_, p) => (
    Array.from({ length: Math.max(1, Number(sentences) || 1) }, (_, s) => {
      const sentence = Array.from({ length: Math.max(3, Number(words) || 3) }, (_, w) => ipsum[(p * 17 + s * 7 + w) % ipsum.length]).join(' ')
      return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`
    }).join(' ')
  )).join('\n\n'), [paragraphs, sentences, words])
  return <Shell slug="lorem-ipsum-gen" result={<Result value={output} />}>
    <div className="grid grid-cols-3 gap-3"><Field label="Paragraphs"><Input type="number" min={1} value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} /></Field><Field label="Sentences"><Input type="number" min={1} value={sentences} onChange={(e) => setSentences(e.target.value)} /></Field><Field label="Words"><Input type="number" min={3} value={words} onChange={(e) => setWords(e.target.value)} /></Field></div>
  </Shell>
}

function CurrentIpChecker() {
  const locale = useLocale()
  const [ip, setIp] = useState('')
  const [status, setStatus] = useState('Ready')
  const refresh = () => {
    setStatus('Loading...')
    fetch('https://api.ipify.org?format=json').then((res) => res.json()).then((data) => {
      setIp(data.ip || '')
      setStatus('OK')
    }).catch(() => setStatus('Could not fetch IP.'))
  }
  useEffect(refresh, [])
  return <Shell slug="current-ip-checker" result={<div className="space-y-4"><div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-sm text-gray-500 dark:text-gray-400">{label('Public IP', locale)}</p><p className="mt-1 font-mono text-2xl font-bold text-gray-900 dark:text-white">{ip || '-'}</p></div><Result rows={4} value={`${label('Status', locale)}: ${status}`} /></div>}>
    <Button onClick={refresh}>Refresh</Button>
  </Shell>
}

export default function DeveloperTool({ slug, locale }: { slug: DevSlug; locale: string }) {
  const lang: Lang = locale === 'kr' ? 'kr' : 'en'
  const tools: Record<DevSlug, React.ReactNode> = {
    'regex-tester': <RegexTester />,
    'hash-gen': <HashGen />,
    'uuid-gen': <UuidGen />,
    'base-converter': <BaseConverter />,
    'unix-timestamp': <UnixTimestamp />,
    'yaml-json-converter': <YamlJsonConverter />,
    'json-to-csv': <JsonToCsv />,
    'image-to-base64': <ImageToBase64 />,
    'robots-txt-gen': <RobotsTxtGen />,
    'lorem-ipsum-gen': <LoremIpsumGen />,
    'current-ip-checker': <CurrentIpChecker />,
  }
  void lang
  return tools[slug]
}
