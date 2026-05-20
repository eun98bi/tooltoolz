'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

type GenSlug =
  | 'name-gen'
  | 'company-name-gen'
  | 'nickname-gen'
  | 'mbti-compatibility'
  | 'random-lottery'
  | 'roulette'
  | 'ladder-game'
  | 'team-divider'
  | 'random-number-gen'
  | 'coin-flip'

const surnames = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Yoon', 'Han', 'Seo', 'Shin']
const given = ['Minjun', 'Seojun', 'Doyun', 'Jiho', 'Hayoon', 'Seoyeon', 'Jiwon', 'Yuna', 'Jisoo', 'Harin']
const companyA = ['Nova', 'Pixel', 'Bright', 'Cloud', 'Green', 'Next', 'Urban', 'Signal', 'Core', 'Luna']
const companyB = ['Labs', 'Works', 'Studio', 'Systems', 'Foods', 'Care', 'Tech', 'House', 'Market', 'Flow']
const nickA = ['Swift', 'Lucky', 'Tiny', 'Cosmic', 'Silent', 'Happy', 'Neon', 'Blue', 'Golden', 'Mighty']
const nickB = ['Panda', 'Rocket', 'Wizard', 'Ninja', 'Comet', 'Tiger', 'Pixel', 'Cookie', 'Knight', 'Wave']
const mbtis = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']

const koLabels: Record<string, string> = {
  Count: '개수',
  Generate: '생성',
  'Industry keyword': '업종 키워드',
  'Generate nicknames': '닉네임 생성',
  'Type A': '유형 A',
  'Type B': '유형 B',
  Names: '이름',
  Winners: '당첨자 수',
  Draw: '추첨',
  Items: '항목',
  Spin: '돌리기',
  Players: '참가자',
  Results: '결과',
  Run: '실행',
  Members: '멤버',
  'Team count': '팀 수',
  Divide: '나누기',
  Min: '최소',
  Max: '최대',
  Unique: '중복 없이',
  Heads: '앞면',
  Tails: '뒷면',
  'Flip coin': '동전 던지기',
  Reset: '초기화',
  Ready: '준비됨',
  'No flips yet': '아직 던진 기록 없음',
}

function localizeText(text: string, locale: string) {
  if (locale !== 'kr') return text
  const flips = text.match(/^(\d+) flips$/)
  if (flips) return `${flips[1]}번 던짐`
  return koLabels[text] ?? text
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function lines(text: string) {
  return text.split(/\r?\n/).map((v) => v.trim()).filter(Boolean)
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const locale = useLocale()
  return <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{localizeText(label, locale)}</span>{children}</label>
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Button({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const locale = useLocale()
  return <button type="button" onClick={onClick} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">{typeof children === 'string' ? localizeText(children, locale) : children}</button>
}

function Shell({ slug, children, result }: { slug: GenSlug; children: React.ReactNode; result: React.ReactNode }) {
  const t = useTranslations(`tools.${slug}`)
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="mb-6 mt-1 text-gray-500 dark:text-gray-400">{t('desc')}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <Card><div className="space-y-4">{children}</div></Card>
        <Card>{result}</Card>
      </div>
    </div>
  )
}

function ResultList({ items }: { items: string[] }) {
  const locale = useLocale()
  return <div className="space-y-2">{items.map((item, i) => <div key={`${item}-${i}`} className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white">{localizeText(item, locale)}</div>)}</div>
}

function NameGen() {
  const [count, setCount] = useState('8')
  const [items, setItems] = useState<string[]>(() => Array.from({ length: 8 }, () => `${pick(surnames)} ${pick(given)}`))
  return <Shell slug="name-gen" result={<ResultList items={items} />}>
    <Field label="Count"><Input type="number" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)} /></Field>
    <Button onClick={() => setItems(Array.from({ length: Math.max(1, Number(count) || 1) }, () => `${pick(surnames)} ${pick(given)}`))}>Generate</Button>
  </Shell>
}

function CompanyNameGen() {
  const [industry, setIndustry] = useState('Tech')
  const [items, setItems] = useState<string[]>(() => Array.from({ length: 10 }, () => `${pick(companyA)} ${pick(companyB)}`))
  return <Shell slug="company-name-gen" result={<ResultList items={items} />}>
    <Field label="Industry keyword"><Input value={industry} onChange={(e) => setIndustry(e.target.value)} /></Field>
    <Button onClick={() => setItems(Array.from({ length: 10 }, () => `${pick(companyA)} ${industry || pick(companyB)}`))}>Generate</Button>
  </Shell>
}

function NicknameGen() {
  const [items, setItems] = useState<string[]>(() => Array.from({ length: 12 }, () => `${pick(nickA)}${pick(nickB)}${Math.floor(Math.random() * 99)}`))
  return <Shell slug="nickname-gen" result={<ResultList items={items} />}>
    <Button onClick={() => setItems(Array.from({ length: 12 }, () => `${pick(nickA)}${pick(nickB)}${Math.floor(Math.random() * 99)}`))}>Generate nicknames</Button>
  </Shell>
}

function MbtiCompatibility() {
  const [a, setA] = useState('INTJ')
  const [b, setB] = useState('ENFP')
  const score = useMemo(() => {
    let s = 40
    for (let i = 0; i < 4; i += 1) s += a[i] === b[i] ? 8 : 15
    return Math.min(99, s)
  }, [a, b])
  return <Shell slug="mbti-compatibility" result={<div className="text-center"><div className="text-5xl font-bold text-indigo-600">{score}%</div><p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{a} + {b}</p></div>}>
    <Field label="Type A"><select value={a} onChange={(e) => setA(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">{mbtis.map((m) => <option key={m}>{m}</option>)}</select></Field>
    <Field label="Type B"><select value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">{mbtis.map((m) => <option key={m}>{m}</option>)}</select></Field>
  </Shell>
}

function RandomLottery() {
  const [text, setText] = useState('Alice\nBob\nCharlie\nDana\nEvan')
  const [winners, setWinners] = useState('1')
  const [items, setItems] = useState<string[]>([])
  return <Shell slug="random-lottery" result={<ResultList items={items.length ? items : ['No draw yet']} />}>
    <Field label="Names"><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} /></Field>
    <Field label="Winners"><Input type="number" min={1} value={winners} onChange={(e) => setWinners(e.target.value)} /></Field>
    <Button onClick={() => setItems(shuffle(lines(text)).slice(0, Math.max(1, Number(winners) || 1)))}>Draw</Button>
  </Shell>
}

function Roulette() {
  const [text, setText] = useState('Pizza\nChicken\nSushi\nBurger\nSalad')
  const [winner, setWinner] = useState('')
  const options = lines(text)
  return <Shell slug="roulette" result={<div className="text-center"><div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border-8 border-indigo-500 bg-gradient-to-br from-indigo-50 to-white p-6 text-xl font-bold text-gray-900 dark:from-gray-800 dark:to-gray-900 dark:text-white">{winner || 'Spin'}</div></div>}>
    <Field label="Items"><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} /></Field>
    <Button onClick={() => setWinner(options.length ? pick(options) : '')}>Spin</Button>
  </Shell>
}

function LadderGame() {
  const [names, setNames] = useState('Alice\nBob\nCharlie\nDana')
  const [prizes, setPrizes] = useState('Coffee\nSnack\nNothing\nMovie')
  const [pairs, setPairs] = useState<string[]>([])
  return <Shell slug="ladder-game" result={<ResultList items={pairs.length ? pairs : ['Run the ladder']} />}>
    <Field label="Players"><Textarea rows={5} value={names} onChange={(e) => setNames(e.target.value)} /></Field>
    <Field label="Results"><Textarea rows={5} value={prizes} onChange={(e) => setPrizes(e.target.value)} /></Field>
    <Button onClick={() => {
      const ps = lines(prizes)
      setPairs(lines(names).map((name, i) => `${name} → ${shuffle(ps)[i % ps.length] || '-'}`))
    }}>Run</Button>
  </Shell>
}

function TeamDivider() {
  const [names, setNames] = useState('Alice\nBob\nCharlie\nDana\nEvan\nFinn')
  const [teams, setTeams] = useState('2')
  const [result, setResult] = useState<string[]>([])
  return <Shell slug="team-divider" result={<ResultList items={result.length ? result : ['No teams yet']} />}>
    <Field label="Members"><Textarea rows={8} value={names} onChange={(e) => setNames(e.target.value)} /></Field>
    <Field label="Team count"><Input type="number" min={1} value={teams} onChange={(e) => setTeams(e.target.value)} /></Field>
    <Button onClick={() => {
      const count = Math.max(1, Number(teams) || 1)
      const grouped = Array.from({ length: count }, (_, i) => `Team ${i + 1}: ${shuffle(lines(names)).filter((_, idx) => idx % count === i).join(', ')}`)
      setResult(grouped)
    }}>Divide</Button>
  </Shell>
}

function RandomNumberGen() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('5')
  const [unique, setUnique] = useState(true)
  const [items, setItems] = useState<string[]>([])
  return <Shell slug="random-number-gen" result={<ResultList items={items.length ? items : ['No numbers yet']} />}>
    <div className="grid grid-cols-3 gap-3"><Field label="Min"><Input type="number" value={min} onChange={(e) => setMin(e.target.value)} /></Field><Field label="Max"><Input type="number" value={max} onChange={(e) => setMax(e.target.value)} /></Field><Field label="Count"><Input type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} /></Field></div>
    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />Unique</label>
    <Button onClick={() => {
      const lo = Number(min), hi = Number(max), c = Math.max(1, Number(count) || 1)
      const range = Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => lo + i)
      const nums = unique ? shuffle(range).slice(0, c) : Array.from({ length: c }, () => lo + Math.floor(Math.random() * (hi - lo + 1)))
      setItems(nums.map(String))
    }}>Generate</Button>
  </Shell>
}

function CoinFlip() {
  const [result, setResult] = useState('')
  const [heads, setHeads] = useState(0)
  const [tails, setTails] = useState(0)
  const [history, setHistory] = useState<string[]>([])

  function flip() {
    const next = Math.random() < 0.5 ? 'Heads' : 'Tails'
    setResult(next)
    setHistory((items) => [next, ...items].slice(0, 12))
    if (next === 'Heads') setHeads((value) => value + 1)
    else setTails((value) => value + 1)
  }

  function reset() {
    setResult('')
    setHeads(0)
    setTails(0)
    setHistory([])
  }

  const total = heads + tails
  const locale = useLocale()
  return <Shell slug="coin-flip" result={<div className="space-y-4">
    <div className="text-center">
      <div className="mx-auto flex aspect-square w-40 items-center justify-center rounded-full border-8 border-amber-300 bg-amber-100 text-2xl font-bold text-amber-900 shadow-inner dark:border-amber-500 dark:bg-amber-900/40 dark:text-amber-100">{result ? localizeText(result, locale) : '?'}</div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{localizeText(total ? `${total} flips` : 'Ready', locale)}</p>
    </div>
    <ResultList items={history.length ? history : ['No flips yet']} />
  </div>}>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800"><span className="block text-gray-500 dark:text-gray-400">{localizeText('Heads', locale)}</span><strong className="text-2xl text-gray-900 dark:text-white">{heads}</strong></div>
      <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800"><span className="block text-gray-500 dark:text-gray-400">{localizeText('Tails', locale)}</span><strong className="text-2xl text-gray-900 dark:text-white">{tails}</strong></div>
    </div>
    <Button onClick={flip}>Flip coin</Button>
    <button type="button" onClick={reset} className="ml-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">{localizeText('Reset', locale)}</button>
  </Shell>
}

export default function GeneratorGameTool({ slug }: { slug: GenSlug; locale: string }) {
  const tools: Record<GenSlug, React.ReactNode> = {
    'name-gen': <NameGen />,
    'company-name-gen': <CompanyNameGen />,
    'nickname-gen': <NicknameGen />,
    'mbti-compatibility': <MbtiCompatibility />,
    'random-lottery': <RandomLottery />,
    'roulette': <Roulette />,
    'ladder-game': <LadderGame />,
    'team-divider': <TeamDivider />,
    'random-number-gen': <RandomNumberGen />,
    'coin-flip': <CoinFlip />,
  }
  return tools[slug]
}
