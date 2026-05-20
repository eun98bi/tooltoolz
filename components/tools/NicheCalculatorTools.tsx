'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

type NicheSlug =
  | 'baseball-stats'
  | 'youtube-earnings'
  | 'instagram-engagement'
  | 'ad-cpm-calc'
  | 'ai-token-calc'
  | 'video-bitrate-calc'
  | 'subtitle-timestamp'
  | 'filename-organizer'
  | 'dog-human-age'
  | 'cat-human-age'

type Lang = 'kr' | 'en'

const koLabels: Record<string, string> = {
  'Total bases': '총 루타',
  'At bats': '타수',
  Hits: '안타',
  'Earned runs': '자책점',
  'Innings pitched': '투구 이닝',
  'Gross ad revenue': '총 광고 수익',
  'Creator revenue': '크리에이터 수익',
  'Annual at this month': '현재 월 기준 연간',
  Views: '조회수',
  'CPM ($)': 'CPM ($)',
  'Creator share (%)': '크리에이터 배분율 (%)',
  'Total engagement': '총 참여 수',
  'Engagement rate': '참여율',
  'Like rate': '좋아요율',
  Followers: '팔로워',
  Likes: '좋아요',
  Comments: '댓글',
  Saves: '저장',
  Shares: '공유',
  Impressions: '노출',
  Clicks: '클릭',
  'Cost ($)': '비용 ($)',
  'Revenue ($)': '매출 ($)',
  'Input tokens': '입력 토큰',
  'Output tokens': '출력 토큰',
  'Total tokens': '전체 토큰',
  'Estimated cost': '예상 비용',
  'Input words': '입력 단어 수',
  'Output words': '출력 단어 수',
  'Input $ / 1M': '입력 100만 토큰당 $',
  'Output $ / 1M': '출력 100만 토큰당 $',
  'Estimated file size': '예상 파일 크기',
  'Estimated GB': '예상 GB',
  'Video bitrate for target': '목표 용량 비디오 비트레이트',
  'Duration (minutes)': '길이 (분)',
  'Video Mbps': '비디오 Mbps',
  'Audio Kbps': '오디오 Kbps',
  'Target file size (MB)': '목표 파일 크기 (MB)',
  Output: '출력',
  Mode: '모드',
  'Shift seconds': '이동할 초',
  'Subtitle text': '자막 텍스트',
  Preview: '미리보기',
  Filenames: '파일명',
  Prefix: '접두사',
  Start: '시작 번호',
  Pad: '자릿수',
  'Human age': '사람 나이',
  'Life stage': '생애 단계',
  'Pet age': '반려동물 나이',
  'Size group': '크기 그룹',
  Years: '년',
  Months: '개월',
  Size: '크기',
  'Next birthday estimate': '다음 생일까지',
}

const koValues: Record<string, string> = {
  Puppy: '퍼피',
  Kitten: '아기 고양이',
  Adult: '성묘/성견',
  Mature: '중장년',
  Senior: '노령',
  small: '소형',
  medium: '중형',
  large: '대형',
}

function localizeLabel(text: string, locale: string) {
  return locale === 'kr' ? koLabels[text] ?? text : text
}

function localizeValue(text: string, locale: Lang) {
  return locale === 'kr' ? koValues[text] ?? text : text
}

function n(value: string | number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function fmt(value: number, locale: Lang, digits = 2) {
  return new Intl.NumberFormat(locale === 'kr' ? 'ko-KR' : 'en-US', { maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0)
}

function money(value: number, locale: Lang) {
  return new Intl.NumberFormat(locale === 'kr' ? 'ko-KR' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0)
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const locale = useLocale()
  return <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{localizeLabel(label, locale)}</span>{children}</label>
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
}

function ResultRow({ label, value }: { label: string; value: React.ReactNode }) {
  const locale = useLocale()
  return <div className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm last:border-0 dark:border-gray-800"><span className="text-gray-500 dark:text-gray-400">{localizeLabel(label, locale)}</span><span className="text-right font-semibold text-gray-900 dark:text-white">{value}</span></div>
}

function Shell({ slug, locale, children, result }: { slug: NicheSlug; locale: Lang; children: React.ReactNode; result: React.ReactNode }) {
  const t = useTranslations(`tools.${slug}`)
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="mb-6 mt-1 text-gray-500 dark:text-gray-400">{t('desc')}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <Card><div className="space-y-4">{children}</div></Card>
        <Card><div className="space-y-1">{result}</div></Card>
      </div>
    </div>
  )
}

function BaseballStats({ locale }: { locale: Lang }) {
  const [ab, setAb] = useState('120')
  const [hits, setHits] = useState('36')
  const [doubles, setDoubles] = useState('8')
  const [triples, setTriples] = useState('1')
  const [hr, setHr] = useState('5')
  const [bb, setBb] = useState('12')
  const [hbp, setHbp] = useState('1')
  const [sf, setSf] = useState('3')
  const [er, setEr] = useState('18')
  const [ip, setIp] = useState('45')
  const singles = Math.max(0, n(hits) - n(doubles) - n(triples) - n(hr))
  const tb = singles + 2 * n(doubles) + 3 * n(triples) + 4 * n(hr)
  const avg = n(ab) ? n(hits) / n(ab) : 0
  const obpDen = n(ab) + n(bb) + n(hbp) + n(sf)
  const obp = obpDen ? (n(hits) + n(bb) + n(hbp)) / obpDen : 0
  const slg = n(ab) ? tb / n(ab) : 0
  const era = n(ip) ? (n(er) * 9) / n(ip) : 0
  return <Shell slug="baseball-stats" locale={locale} result={<>
    <ResultRow label="AVG" value={avg.toFixed(3)} /><ResultRow label="OBP" value={obp.toFixed(3)} /><ResultRow label="SLG" value={slg.toFixed(3)} /><ResultRow label="OPS" value={(obp + slg).toFixed(3)} /><ResultRow label="ERA" value={fmt(era, locale)} /><ResultRow label="Total bases" value={tb} />
  </>}>
    <div className="grid grid-cols-2 gap-3"><Field label="At bats"><Input type="number" value={ab} onChange={(e) => setAb(e.target.value)} /></Field><Field label="Hits"><Input type="number" value={hits} onChange={(e) => setHits(e.target.value)} /></Field></div>
    <div className="grid grid-cols-3 gap-3"><Field label="2B"><Input type="number" value={doubles} onChange={(e) => setDoubles(e.target.value)} /></Field><Field label="3B"><Input type="number" value={triples} onChange={(e) => setTriples(e.target.value)} /></Field><Field label="HR"><Input type="number" value={hr} onChange={(e) => setHr(e.target.value)} /></Field></div>
    <div className="grid grid-cols-3 gap-3"><Field label="BB"><Input type="number" value={bb} onChange={(e) => setBb(e.target.value)} /></Field><Field label="HBP"><Input type="number" value={hbp} onChange={(e) => setHbp(e.target.value)} /></Field><Field label="SF"><Input type="number" value={sf} onChange={(e) => setSf(e.target.value)} /></Field></div>
    <div className="grid grid-cols-2 gap-3"><Field label="Earned runs"><Input type="number" value={er} onChange={(e) => setEr(e.target.value)} /></Field><Field label="Innings pitched"><Input type="number" value={ip} onChange={(e) => setIp(e.target.value)} /></Field></div>
  </Shell>
}

function YouTubeEarnings({ locale }: { locale: Lang }) {
  const [views, setViews] = useState('100000')
  const [cpm, setCpm] = useState('4')
  const [share, setShare] = useState('55')
  const gross = n(views) / 1000 * n(cpm)
  const creator = gross * n(share) / 100
  return <Shell slug="youtube-earnings" locale={locale} result={<><ResultRow label="Gross ad revenue" value={money(gross, locale)} /><ResultRow label="Creator revenue" value={money(creator, locale)} /><ResultRow label="RPM" value={money(n(views) ? creator / n(views) * 1000 : 0, locale)} /><ResultRow label="Annual at this month" value={money(creator * 12, locale)} /></>}>
    <Field label="Views"><Input type="number" value={views} onChange={(e) => setViews(e.target.value)} /></Field>
    <Field label="CPM ($)"><Input type="number" value={cpm} onChange={(e) => setCpm(e.target.value)} /></Field>
    <Field label="Creator share (%)"><Input type="number" value={share} onChange={(e) => setShare(e.target.value)} /></Field>
  </Shell>
}

function InstagramEngagement({ locale }: { locale: Lang }) {
  const [followers, setFollowers] = useState('25000')
  const [likes, setLikes] = useState('1600')
  const [comments, setComments] = useState('120')
  const [saves, setSaves] = useState('80')
  const [shares, setShares] = useState('40')
  const total = n(likes) + n(comments) + n(saves) + n(shares)
  return <Shell slug="instagram-engagement" locale={locale} result={<><ResultRow label="Total engagement" value={fmt(total, locale, 0)} /><ResultRow label="Engagement rate" value={`${fmt(n(followers) ? total / n(followers) * 100 : 0, locale)}%`} /><ResultRow label="Like rate" value={`${fmt(n(followers) ? n(likes) / n(followers) * 100 : 0, locale)}%`} /></>}>
    <Field label="Followers"><Input type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} /></Field>
    <div className="grid grid-cols-2 gap-3"><Field label="Likes"><Input type="number" value={likes} onChange={(e) => setLikes(e.target.value)} /></Field><Field label="Comments"><Input type="number" value={comments} onChange={(e) => setComments(e.target.value)} /></Field></div>
    <div className="grid grid-cols-2 gap-3"><Field label="Saves"><Input type="number" value={saves} onChange={(e) => setSaves(e.target.value)} /></Field><Field label="Shares"><Input type="number" value={shares} onChange={(e) => setShares(e.target.value)} /></Field></div>
  </Shell>
}

function AdCpmCalc({ locale }: { locale: Lang }) {
  const [impressions, setImpressions] = useState('100000')
  const [clicks, setClicks] = useState('1400')
  const [cost, setCost] = useState('850')
  const [revenue, setRevenue] = useState('2100')
  return <Shell slug="ad-cpm-calc" locale={locale} result={<><ResultRow label="CPM" value={money(n(impressions) ? n(cost) / n(impressions) * 1000 : 0, locale)} /><ResultRow label="CPC" value={money(n(clicks) ? n(cost) / n(clicks) : 0, locale)} /><ResultRow label="CTR" value={`${fmt(n(impressions) ? n(clicks) / n(impressions) * 100 : 0, locale)}%`} /><ResultRow label="ROAS" value={`${fmt(n(cost) ? n(revenue) / n(cost) * 100 : 0, locale)}%`} /></>}>
    <div className="grid grid-cols-2 gap-3"><Field label="Impressions"><Input type="number" value={impressions} onChange={(e) => setImpressions(e.target.value)} /></Field><Field label="Clicks"><Input type="number" value={clicks} onChange={(e) => setClicks(e.target.value)} /></Field></div>
    <div className="grid grid-cols-2 gap-3"><Field label="Cost ($)"><Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} /></Field><Field label="Revenue ($)"><Input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} /></Field></div>
  </Shell>
}

function AiTokenCalc({ locale }: { locale: Lang }) {
  const [inputWords, setInputWords] = useState('1200')
  const [outputWords, setOutputWords] = useState('600')
  const [inputPrice, setInputPrice] = useState('3')
  const [outputPrice, setOutputPrice] = useState('15')
  const inputTokens = Math.ceil(n(inputWords) * 1.33)
  const outputTokens = Math.ceil(n(outputWords) * 1.33)
  const cost = inputTokens / 1_000_000 * n(inputPrice) + outputTokens / 1_000_000 * n(outputPrice)
  return <Shell slug="ai-token-calc" locale={locale} result={<><ResultRow label="Input tokens" value={fmt(inputTokens, locale, 0)} /><ResultRow label="Output tokens" value={fmt(outputTokens, locale, 0)} /><ResultRow label="Total tokens" value={fmt(inputTokens + outputTokens, locale, 0)} /><ResultRow label="Estimated cost" value={money(cost, locale)} /></>}>
    <div className="grid grid-cols-2 gap-3"><Field label="Input words"><Input type="number" value={inputWords} onChange={(e) => setInputWords(e.target.value)} /></Field><Field label="Output words"><Input type="number" value={outputWords} onChange={(e) => setOutputWords(e.target.value)} /></Field></div>
    <div className="grid grid-cols-2 gap-3"><Field label="Input $ / 1M"><Input type="number" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} /></Field><Field label="Output $ / 1M"><Input type="number" value={outputPrice} onChange={(e) => setOutputPrice(e.target.value)} /></Field></div>
  </Shell>
}

function VideoBitrateCalc({ locale }: { locale: Lang }) {
  const [minutes, setMinutes] = useState('10')
  const [videoMbps, setVideoMbps] = useState('8')
  const [audioKbps, setAudioKbps] = useState('192')
  const [targetMb, setTargetMb] = useState('500')
  const seconds = n(minutes) * 60
  const totalMbps = n(videoMbps) + n(audioKbps) / 1000
  const fileMb = totalMbps * seconds / 8
  const neededMbps = seconds ? (n(targetMb) * 8 / seconds) - n(audioKbps) / 1000 : 0
  return <Shell slug="video-bitrate-calc" locale={locale} result={<><ResultRow label="Estimated file size" value={`${fmt(fileMb, locale)} MB`} /><ResultRow label="Estimated GB" value={`${fmt(fileMb / 1024, locale)} GB`} /><ResultRow label="Video bitrate for target" value={`${fmt(Math.max(0, neededMbps), locale)} Mbps`} /></>}>
    <Field label="Duration (minutes)"><Input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></Field>
    <div className="grid grid-cols-2 gap-3"><Field label="Video Mbps"><Input type="number" value={videoMbps} onChange={(e) => setVideoMbps(e.target.value)} /></Field><Field label="Audio Kbps"><Input type="number" value={audioKbps} onChange={(e) => setAudioKbps(e.target.value)} /></Field></div>
    <Field label="Target file size (MB)"><Input type="number" value={targetMb} onChange={(e) => setTargetMb(e.target.value)} /></Field>
  </Shell>
}

function shiftTimestamp(match: string, seconds: number) {
  const normalized = match.replace(',', '.')
  const parts = normalized.split(':')
  const secParts = parts[2].split('.')
  const total = Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(secParts[0]) + Number(`0.${secParts[1] || '0'}`) + seconds
  const safe = Math.max(0, total)
  const hh = String(Math.floor(safe / 3600)).padStart(2, '0')
  const mm = String(Math.floor((safe % 3600) / 60)).padStart(2, '0')
  const ss = String(Math.floor(safe % 60)).padStart(2, '0')
  const ms = String(Math.round((safe % 1) * 1000)).padStart(3, '0')
  return `${hh}:${mm}:${ss}.${ms}`
}

function SubtitleTimestamp({ locale }: { locale: Lang }) {
  const [mode, setMode] = useState('srtToVtt')
  const [shift, setShift] = useState('1.5')
  const [text, setText] = useState('1\n00:00:01,000 --> 00:00:03,500\nHello world')
  const output = useMemo(() => {
    let next = text
    if (mode === 'srtToVtt') next = `WEBVTT\n\n${text.replace(/,/g, '.')}`
    if (mode === 'vttToSrt') next = text.replace(/^WEBVTT\s*/i, '').replace(/(\d\d:\d\d:\d\d)\.(\d\d\d)/g, '$1,$2').trim()
    if (mode === 'shift') next = text.replace(/\d\d:\d\d:\d\d[,.]\d\d\d/g, (m) => shiftTimestamp(m, n(shift)).replace(/\./g, text.includes(',') ? ',' : '.'))
    return next
  }, [mode, shift, text])
  return <Shell slug="subtitle-timestamp" locale={locale} result={<Field label="Output"><Textarea rows={14} value={output} readOnly /></Field>}>
    <Field label="Mode"><Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="srtToVtt">SRT to VTT</option><option value="vttToSrt">VTT to SRT</option><option value="shift">Shift timestamps</option></Select></Field>
    <Field label="Shift seconds"><Input type="number" step="0.1" value={shift} onChange={(e) => setShift(e.target.value)} /></Field>
    <Field label="Subtitle text"><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} /></Field>
  </Shell>
}

function FilenameOrganizer({ locale }: { locale: Lang }) {
  const [names, setNames] = useState('IMG_9032.jpg\nsummer photo.png\nreport final.pdf')
  const [prefix, setPrefix] = useState('file')
  const [start, setStart] = useState('1')
  const [pad, setPad] = useState('3')
  const output = names.split(/\r?\n/).filter(Boolean).map((name, index) => {
    const ext = name.includes('.') ? `.${name.split('.').pop()}` : ''
    return `${name}  ->  ${prefix}-${String(n(start) + index).padStart(n(pad), '0')}${ext.toLowerCase()}`
  }).join('\n')
  return <Shell slug="filename-organizer" locale={locale} result={<Field label="Preview"><Textarea rows={12} value={output} readOnly /></Field>}>
    <Field label="Filenames"><Textarea rows={8} value={names} onChange={(e) => setNames(e.target.value)} /></Field>
    <div className="grid grid-cols-3 gap-3"><Field label="Prefix"><Input value={prefix} onChange={(e) => setPrefix(e.target.value)} /></Field><Field label="Start"><Input type="number" value={start} onChange={(e) => setStart(e.target.value)} /></Field><Field label="Pad"><Input type="number" value={pad} onChange={(e) => setPad(e.target.value)} /></Field></div>
  </Shell>
}

function DogHumanAge({ locale }: { locale: Lang }) {
  const [years, setYears] = useState('3')
  const [months, setMonths] = useState('0')
  const [size, setSize] = useState('medium')
  const age = Math.max(0, n(years) + n(months) / 12)
  const multiplier = size === 'small' ? 4 : size === 'large' ? 7 : 5.5
  const humanAge = age <= 1 ? age * 15 : age <= 2 ? 15 + (age - 1) * 9 : 24 + (age - 2) * multiplier
  const stage = age < 1 ? 'Puppy' : age < 7 ? 'Adult' : 'Senior'
  return <Shell slug="dog-human-age" locale={locale} result={<>
    <ResultRow label="Human age" value={locale === 'kr' ? `${fmt(humanAge, locale, 1)}년` : `${fmt(humanAge, locale, 1)} years`} />
    <ResultRow label="Life stage" value={localizeValue(stage, locale)} />
    <ResultRow label="Pet age" value={locale === 'kr' ? `${fmt(age, locale, 1)}년` : `${fmt(age, locale, 1)} years`} />
    <ResultRow label="Size group" value={localizeValue(size, locale)} />
  </>}>
    <div className="grid grid-cols-2 gap-3"><Field label="Years"><Input type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} /></Field><Field label="Months"><Input type="number" min={0} max={11} value={months} onChange={(e) => setMonths(e.target.value)} /></Field></div>
    <Field label="Size"><Select value={size} onChange={(e) => setSize(e.target.value)}><option value="small">{locale === 'kr' ? '소형' : 'Small'}</option><option value="medium">{locale === 'kr' ? '중형' : 'Medium'}</option><option value="large">{locale === 'kr' ? '대형' : 'Large'}</option></Select></Field>
  </Shell>
}

function CatHumanAge({ locale }: { locale: Lang }) {
  const [years, setYears] = useState('4')
  const [months, setMonths] = useState('0')
  const age = Math.max(0, n(years) + n(months) / 12)
  const humanAge = age <= 1 ? age * 15 : age <= 2 ? 15 + (age - 1) * 9 : 24 + (age - 2) * 4
  const stage = age < 1 ? 'Kitten' : age < 7 ? 'Adult' : age < 11 ? 'Mature' : 'Senior'
  return <Shell slug="cat-human-age" locale={locale} result={<>
    <ResultRow label="Human age" value={locale === 'kr' ? `${fmt(humanAge, locale, 1)}년` : `${fmt(humanAge, locale, 1)} years`} />
    <ResultRow label="Life stage" value={localizeValue(stage, locale)} />
    <ResultRow label="Pet age" value={locale === 'kr' ? `${fmt(age, locale, 1)}년` : `${fmt(age, locale, 1)} years`} />
    <ResultRow label="Next birthday estimate" value={locale === 'kr' ? `${fmt(Math.max(0, Math.ceil(age) - age) * 12, locale, 0)}개월` : `${fmt(Math.max(0, Math.ceil(age) - age) * 12, locale, 0)} months`} />
  </>}>
    <div className="grid grid-cols-2 gap-3"><Field label="Years"><Input type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} /></Field><Field label="Months"><Input type="number" min={0} max={11} value={months} onChange={(e) => setMonths(e.target.value)} /></Field></div>
  </Shell>
}

export default function NicheCalculatorTool({ slug, locale }: { slug: NicheSlug; locale: string }) {
  const lang: Lang = locale === 'kr' ? 'kr' : 'en'
  const tools: Record<NicheSlug, React.ReactNode> = {
    'baseball-stats': <BaseballStats locale={lang} />,
    'youtube-earnings': <YouTubeEarnings locale={lang} />,
    'instagram-engagement': <InstagramEngagement locale={lang} />,
    'ad-cpm-calc': <AdCpmCalc locale={lang} />,
    'ai-token-calc': <AiTokenCalc locale={lang} />,
    'video-bitrate-calc': <VideoBitrateCalc locale={lang} />,
    'subtitle-timestamp': <SubtitleTimestamp locale={lang} />,
    'filename-organizer': <FilenameOrganizer locale={lang} />,
    'dog-human-age': <DogHumanAge locale={lang} />,
    'cat-human-age': <CatHumanAge locale={lang} />,
  }
  return tools[slug]
}
