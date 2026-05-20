'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

type CalcSlug =
  | 'percent-calc'
  | 'date-calc'
  | 'time-diff-calc'
  | 'bmi-calc'
  | 'average-calc'
  | 'gpa-calc'
  | 'salary-calc'
  | 'hourly-calc'
  | 'vat-calc'
  | 'currency-calc'
  | 'compound-calc'
  | 'loan-calc'
  | 'lived-days-calc'
  | 'year-days-left'
  | 'anniversary-calc'
  | 'shoe-size-converter'
  | 'clothing-size-converter'

type Lang = 'kr' | 'en'

const copy = {
  en: {
    input: 'Input',
    result: 'Result',
    amount: 'Amount',
    rate: 'Rate',
    years: 'Years',
    months: 'Months',
    format: 'Format',
    principal: 'Principal',
    monthly: 'Monthly',
    annual: 'Annual',
    total: 'Total',
  },
  kr: {
    input: '입력',
    result: '결과',
    amount: '금액',
    rate: '비율',
    years: '년',
    months: '개월',
    format: '형식',
    principal: '원금',
    monthly: '월',
    annual: '연',
    total: '합계',
  },
} as const

const koLabels: Record<string, string> = {
  'Base value': '기준값',
  'Percent (%)': '비율 (%)',
  'Old value': '이전 값',
  'New value': '새 값',
  Increase: '증가 후',
  Discount: '할인 후',
  'Percent change': '증감률',
  Duration: '기간',
  'D-day': '디데이',
  'Start + days': '시작일 + 일수',
  'Start - days': '시작일 - 일수',
  'Start date': '시작일',
  'End date': '종료일',
  'Days to add/subtract': '더하거나 뺄 일수',
  Minutes: '분',
  Hours: '시간',
  Days: '일',
  'Clock format': '시간 형식',
  Start: '시작',
  End: '종료',
  Category: '분류',
  'Normal min': '정상 최소',
  'Normal max': '정상 최대',
  'Height (cm)': '키 (cm)',
  'Weight (kg)': '몸무게 (kg)',
  Count: '개수',
  Sum: '합계',
  Mean: '평균',
  Median: '중앙값',
  Mode: '최빈값',
  'Min / Max': '최소 / 최대',
  Numbers: '숫자',
  Credits: '학점',
  Percent: '백분율',
  Scale: '만점 기준',
  'Annual gross': '연봉 총액',
  'Estimated tax': '예상 세금',
  'Annual net': '연 실수령액',
  'Monthly net': '월 실수령액',
  'Annual salary': '연봉',
  'Tax / deduction rate (%)': '세금/공제율 (%)',
  Currency: '통화',
  Weekly: '주급',
  Monthly: '월급',
  Annual: '연봉',
  'Hourly wage': '시급',
  'Regular hours / week': '주당 기본 근무시간',
  'Overtime hours / week': '주당 초과 근무시간',
  'VAT added': '부가세 포함',
  'VAT amount': '부가세',
  'Net from gross': '공급가액',
  'VAT in gross': '포함된 부가세',
  Amount: '금액',
  'VAT rate (%)': '부가세율 (%)',
  Converted: '환산 결과',
  'Reverse rate': '역환율',
  'Exchange rate': '환율',
  'Final balance': '최종 금액',
  Invested: '투입 금액',
  Growth: '수익',
  'Initial principal': '초기 원금',
  'Monthly contribution': '월 납입액',
  'Annual return (%)': '연 수익률 (%)',
  Years: '년',
  'Monthly payment': '월 상환액',
  'Total payment': '총 상환액',
  'Total interest': '총 이자',
  Months: '개월',
  'Loan principal': '대출 원금',
  'Annual interest (%)': '연 이자율 (%)',
  'Days lived': '살아온 일수',
  'Weeks lived': '살아온 주수',
  'Approx. months': '대략 개월 수',
  'Approx. years': '대략 연수',
  '10,000th day': '10,000일째',
  'Birth date': '생년월일',
  'Calculate as of': '계산 기준일',
  'Day of year': '올해 지난 일수',
  'Days left after today': '오늘 이후 남은 일수',
  'Days left incl. today': '오늘 포함 남은 일수',
  'Year progress': '올해 진행률',
  'Last day': '올해 마지막 날',
  Date: '날짜',
  'Anniversary date': '기념일 날짜',
  'Days to target': '목표일까지 일수',
  '100 days': '100일',
  '1,000 days': '1,000일',
  '1 year': '1년',
  Unit: '단위',
  'Compare target date': '비교할 목표일',
  'Korea / Japan': '한국 / 일본',
  'US men': '미국 남성',
  'US women': '미국 여성',
  'UK adult': '영국 성인',
  'EU adult': '유럽 성인',
  'Selected fit': '선택 기준',
  'Foot length / KR size (mm)': '발 길이 / 한국 사이즈 (mm)',
  'Fit reference': '기준',
  'Letter size': '문자 사이즈',
  'Korea top': '한국 상의',
  'US jacket': '미국 재킷',
  'EU jacket': '유럽 재킷',
  'Jeans waist': '청바지 허리',
  'Chest circumference (cm)': '가슴둘레 (cm)',
  'Waist circumference (cm)': '허리둘레 (cm)',
}

function localizeLabel(text: string, locale: string) {
  if (locale !== 'kr') return text
  const percentOf = text.match(/^(.+)% of (.+)$/)
  if (percentOf) return `${percentOf[1]}% 값`
  const credit = text.match(/^Credit (\d+)$/)
  if (credit) return `학점 ${credit[1]}`
  const grade = text.match(/^Grade (\d+)$/)
  if (grade) return `성적 ${grade[1]}`
  return koLabels[text] ?? text
}

function n(value: string | number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function money(value: number, locale: string, currency = 'USD') {
  return new Intl.NumberFormat(locale === 'kr' ? 'ko-KR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(Number.isFinite(value) ? value : 0)
}

function number(value: number, locale: string, digits = 2) {
  return new Intl.NumberFormat(locale === 'kr' ? 'ko-KR' : 'en-US', {
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0)
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function dateFromInput(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year || 1970, (month || 1) - 1, day || 1)
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: string, days: number) {
  const next = dateFromInput(date)
  next.setDate(next.getDate() + days)
  return formatDate(next)
}

function addMonths(date: string, months: number) {
  const next = dateFromInput(date)
  next.setMonth(next.getMonth() + months)
  return formatDate(next)
}

function addYears(date: string, years: number) {
  const next = dateFromInput(date)
  next.setFullYear(next.getFullYear() + years)
  return formatDate(next)
}

function daysBetween(start: string, end: string) {
  return Math.round((dateFromInput(end).getTime() - dateFromInput(start).getTime()) / 86400000)
}

function parseNumbers(text: string) {
  return text
    .split(/[\s,;]+/)
    .map(Number)
    .filter(Number.isFinite)
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const locale = useLocale()
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{localizeLabel(label, locale)}</span>
      {children}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
    />
  )
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
    />
  )
}

function ResultRow({ label, value }: { label: string; value: React.ReactNode }) {
  const locale = useLocale()
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm last:border-0 dark:border-gray-800">
      <span className="text-gray-500 dark:text-gray-400">{localizeLabel(label, locale)}</span>
      <span className="text-right font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}

function Shell({ slug, locale, children, result }: { slug: CalcSlug; locale: Lang; children: React.ReactNode; result: React.ReactNode }) {
  const t = useTranslations(`tools.${slug}`)
  const c = locale === 'kr' ? { ...copy.kr, input: '입력', result: '결과' } : copy.en

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="mb-6 mt-1 text-gray-500 dark:text-gray-400">{t('desc')}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">{c.input}</h2>
          <div className="space-y-4">{children}</div>
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">{c.result}</h2>
          <div className="space-y-1">{result}</div>
        </Card>
      </div>
    </div>
  )
}

function PercentCalc({ locale }: { locale: Lang }) {
  const [base, setBase] = useState('1000')
  const [percent, setPercent] = useState('15')
  const [oldValue, setOldValue] = useState('100')
  const [newValue, setNewValue] = useState('120')
  const b = n(base)
  const p = n(percent)
  const oldN = n(oldValue)
  const newN = n(newValue)
  const change = oldN ? ((newN - oldN) / oldN) * 100 : 0
  return (
    <Shell slug="percent-calc" locale={locale} result={<>
      <ResultRow label={`${p}% of ${number(b, locale)}`} value={number((b * p) / 100, locale)} />
      <ResultRow label="Increase" value={number(b * (1 + p / 100), locale)} />
      <ResultRow label="Discount" value={number(b * (1 - p / 100), locale)} />
      <ResultRow label="Percent change" value={`${number(change, locale)}%`} />
    </>}>
      <Field label="Base value"><Input type="number" value={base} onChange={(e) => setBase(e.target.value)} /></Field>
      <Field label="Percent (%)"><Input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Old value"><Input type="number" value={oldValue} onChange={(e) => setOldValue(e.target.value)} /></Field>
        <Field label="New value"><Input type="number" value={newValue} onChange={(e) => setNewValue(e.target.value)} /></Field>
      </div>
    </Shell>
  )
}

function DateCalc({ locale }: { locale: Lang }) {
  const [start, setStart] = useState(today())
  const [end, setEnd] = useState(addDays(today(), 30))
  const [days, setDays] = useState('100')
  const diff = Math.round((new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000)
  return (
    <Shell slug="date-calc" locale={locale} result={<>
      <ResultRow label="Duration" value={`${number(Math.abs(diff), locale, 0)} days`} />
      <ResultRow label="D-day" value={diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`} />
      <ResultRow label="Start + days" value={addDays(start, n(days))} />
      <ResultRow label="Start - days" value={addDays(start, -n(days))} />
    </>}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="End date"><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      <Field label="Days to add/subtract"><Input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></Field>
    </Shell>
  )
}

function TimeDiffCalc({ locale }: { locale: Lang }) {
  const now = new Date()
  const later = new Date(now.getTime() + 3 * 3600000 + 25 * 60000)
  const [start, setStart] = useState(now.toISOString().slice(0, 16))
  const [end, setEnd] = useState(later.toISOString().slice(0, 16))
  const ms = Math.abs(new Date(end).getTime() - new Date(start).getTime())
  const minutes = Math.floor(ms / 60000)
  return (
    <Shell slug="time-diff-calc" locale={locale} result={<>
      <ResultRow label="Minutes" value={number(minutes, locale, 0)} />
      <ResultRow label="Hours" value={number(minutes / 60, locale)} />
      <ResultRow label="Days" value={number(minutes / 1440, locale)} />
      <ResultRow label="Clock format" value={`${Math.floor(minutes / 60)}h ${minutes % 60}m`} />
    </>}>
      <Field label="Start"><Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
      <Field label="End"><Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
    </Shell>
  )
}

function BmiCalc({ locale }: { locale: Lang }) {
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')
  const h = n(height) / 100
  const bmi = h ? n(weight) / (h * h) : 0
  const status = bmi < 18.5 ? 'Underweight' : bmi < 23 ? 'Normal' : bmi < 25 ? 'Overweight' : 'Obese'
  return (
    <Shell slug="bmi-calc" locale={locale} result={<>
      <ResultRow label="BMI" value={number(bmi, locale, 1)} />
      <ResultRow label="Category" value={status} />
      <ResultRow label="Normal min" value={`${number(18.5 * h * h, locale, 1)} kg`} />
      <ResultRow label="Normal max" value={`${number(22.9 * h * h, locale, 1)} kg`} />
    </>}>
      <Field label="Height (cm)"><Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></Field>
      <Field label="Weight (kg)"><Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></Field>
    </Shell>
  )
}

function AverageCalc({ locale }: { locale: Lang }) {
  const [text, setText] = useState('10, 20, 30, 40, 50')
  const values = parseNumbers(text).sort((a, b) => a - b)
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = values.length ? sum / values.length : 0
  const median = values.length ? (values[Math.floor((values.length - 1) / 2)] + values[Math.ceil((values.length - 1) / 2)]) / 2 : 0
  const mode = values.reduce<Record<string, number>>((acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }), {})
  const modeValue = Object.entries(mode).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '0'
  return (
    <Shell slug="average-calc" locale={locale} result={<>
      <ResultRow label="Count" value={values.length} />
      <ResultRow label="Sum" value={number(sum, locale)} />
      <ResultRow label="Mean" value={number(mean, locale)} />
      <ResultRow label="Median" value={number(median, locale)} />
      <ResultRow label="Mode" value={modeValue} />
      <ResultRow label="Min / Max" value={`${number(values[0] ?? 0, locale)} / ${number(values[values.length - 1] ?? 0, locale)}`} />
    </>}>
      <Field label="Numbers"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" /></Field>
    </Shell>
  )
}

function GpaCalc({ locale }: { locale: Lang }) {
  const [scale, setScale] = useState('4.5')
  const [rows, setRows] = useState([
    { credit: '3', grade: '4.5' },
    { credit: '3', grade: '4.0' },
    { credit: '2', grade: '3.5' },
  ])
  const credits = rows.reduce((sum, row) => sum + n(row.credit), 0)
  const points = rows.reduce((sum, row) => sum + n(row.credit) * n(row.grade), 0)
  const gpa = credits ? points / credits : 0
  return (
    <Shell slug="gpa-calc" locale={locale} result={<>
      <ResultRow label="GPA" value={`${number(gpa, locale, 2)} / ${scale}`} />
      <ResultRow label="Credits" value={number(credits, locale, 1)} />
      <ResultRow label="Percent" value={`${number((gpa / n(scale)) * 100, locale, 1)}%`} />
    </>}>
      <Field label="Scale"><Select value={scale} onChange={(e) => setScale(e.target.value)}><option>4.5</option><option>4.3</option><option>4.0</option></Select></Field>
      {rows.map((row, index) => (
        <div className="grid grid-cols-2 gap-3" key={index}>
          <Field label={`Credit ${index + 1}`}><Input type="number" value={row.credit} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, credit: e.target.value } : r))} /></Field>
          <Field label={`Grade ${index + 1}`}><Input type="number" step="0.1" value={row.grade} onChange={(e) => setRows(rows.map((r, i) => i === index ? { ...r, grade: e.target.value } : r))} /></Field>
        </div>
      ))}
      <button type="button" onClick={() => setRows([...rows, { credit: '3', grade: scale }])} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Add course</button>
    </Shell>
  )
}

function SalaryCalc({ locale }: { locale: Lang }) {
  const [gross, setGross] = useState('60000')
  const [tax, setTax] = useState('22')
  const [currency, setCurrency] = useState('USD')
  const annual = n(gross)
  const taxAmount = annual * n(tax) / 100
  const net = annual - taxAmount
  return (
    <Shell slug="salary-calc" locale={locale} result={<>
      <ResultRow label="Annual gross" value={money(annual, locale, currency)} />
      <ResultRow label="Estimated tax" value={money(taxAmount, locale, currency)} />
      <ResultRow label="Annual net" value={money(net, locale, currency)} />
      <ResultRow label="Monthly net" value={money(net / 12, locale, currency)} />
    </>}>
      <Field label="Annual salary"><Input type="number" value={gross} onChange={(e) => setGross(e.target.value)} /></Field>
      <Field label="Tax / deduction rate (%)"><Input type="number" value={tax} onChange={(e) => setTax(e.target.value)} /></Field>
      <Field label="Currency"><Select value={currency} onChange={(e) => setCurrency(e.target.value)}><option>USD</option><option>KRW</option><option>EUR</option><option>JPY</option></Select></Field>
    </Shell>
  )
}

function HourlyCalc({ locale }: { locale: Lang }) {
  const [wage, setWage] = useState('20')
  const [hours, setHours] = useState('40')
  const [overtime, setOvertime] = useState('5')
  const [currency, setCurrency] = useState('USD')
  const weekly = n(wage) * n(hours) + n(wage) * 1.5 * n(overtime)
  return (
    <Shell slug="hourly-calc" locale={locale} result={<>
      <ResultRow label="Weekly" value={money(weekly, locale, currency)} />
      <ResultRow label="Monthly" value={money(weekly * 52 / 12, locale, currency)} />
      <ResultRow label="Annual" value={money(weekly * 52, locale, currency)} />
    </>}>
      <Field label="Hourly wage"><Input type="number" value={wage} onChange={(e) => setWage(e.target.value)} /></Field>
      <Field label="Regular hours / week"><Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
      <Field label="Overtime hours / week"><Input type="number" value={overtime} onChange={(e) => setOvertime(e.target.value)} /></Field>
      <Field label="Currency"><Select value={currency} onChange={(e) => setCurrency(e.target.value)}><option>USD</option><option>KRW</option><option>EUR</option><option>JPY</option></Select></Field>
    </Shell>
  )
}

function VatCalc({ locale }: { locale: Lang }) {
  const [amount, setAmount] = useState('110')
  const [rate, setRate] = useState('10')
  const a = n(amount)
  const r = n(rate) / 100
  return (
    <Shell slug="vat-calc" locale={locale} result={<>
      <ResultRow label="VAT added" value={number(a * (1 + r), locale)} />
      <ResultRow label="VAT amount" value={number(a * r, locale)} />
      <ResultRow label="Net from gross" value={number(a / (1 + r), locale)} />
      <ResultRow label="VAT in gross" value={number(a - a / (1 + r), locale)} />
    </>}>
      <Field label="Amount"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
      <Field label="VAT rate (%)"><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
    </Shell>
  )
}

function CurrencyCalc({ locale }: { locale: Lang }) {
  const [amount, setAmount] = useState('100')
  const [rate, setRate] = useState('1300')
  return (
    <Shell slug="currency-calc" locale={locale} result={<>
      <ResultRow label="Converted" value={number(n(amount) * n(rate), locale, 4)} />
      <ResultRow label="Reverse rate" value={number(n(rate) ? 1 / n(rate) : 0, locale, 6)} />
    </>}>
      <Field label="Amount"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
      <Field label="Exchange rate"><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
    </Shell>
  )
}

function CompoundCalc({ locale }: { locale: Lang }) {
  const [principal, setPrincipal] = useState('10000')
  const [monthly, setMonthly] = useState('200')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('10')
  const months = Math.round(n(years) * 12)
  const monthlyRate = n(rate) / 100 / 12
  let balance = n(principal)
  for (let i = 0; i < months; i += 1) balance = balance * (1 + monthlyRate) + n(monthly)
  const invested = n(principal) + n(monthly) * months
  return (
    <Shell slug="compound-calc" locale={locale} result={<>
      <ResultRow label="Final balance" value={money(balance, locale)} />
      <ResultRow label="Invested" value={money(invested, locale)} />
      <ResultRow label="Growth" value={money(balance - invested, locale)} />
    </>}>
      <Field label="Initial principal"><Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></Field>
      <Field label="Monthly contribution"><Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></Field>
      <Field label="Annual return (%)"><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
      <Field label="Years"><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
    </Shell>
  )
}

function LoanCalc({ locale }: { locale: Lang }) {
  const [principal, setPrincipal] = useState('250000')
  const [rate, setRate] = useState('5.5')
  const [years, setYears] = useState('30')
  const p = n(principal)
  const monthlyRate = n(rate) / 100 / 12
  const months = Math.round(n(years) * 12)
  const payment = monthlyRate ? p * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : p / months
  const total = payment * months
  return (
    <Shell slug="loan-calc" locale={locale} result={<>
      <ResultRow label="Monthly payment" value={money(payment, locale)} />
      <ResultRow label="Total payment" value={money(total, locale)} />
      <ResultRow label="Total interest" value={money(total - p, locale)} />
      <ResultRow label="Months" value={months} />
    </>}>
      <Field label="Loan principal"><Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></Field>
      <Field label="Annual interest (%)"><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
      <Field label="Years"><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
    </Shell>
  )
}

function LivedDaysCalc({ locale }: { locale: Lang }) {
  const [birth, setBirth] = useState('1995-01-01')
  const [asOf, setAsOf] = useState(today())
  const days = Math.max(0, daysBetween(birth, asOf))
  return (
    <Shell slug="lived-days-calc" locale={locale} result={<>
      <ResultRow label="Days lived" value={number(days, locale, 0)} />
      <ResultRow label="Weeks lived" value={number(days / 7, locale, 1)} />
      <ResultRow label="Approx. months" value={number(days / 30.4375, locale, 1)} />
      <ResultRow label="Approx. years" value={number(days / 365.2425, locale, 2)} />
      <ResultRow label="10,000th day" value={addDays(birth, 10000)} />
    </>}>
      <Field label="Birth date"><Input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} /></Field>
      <Field label="Calculate as of"><Input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} /></Field>
    </Shell>
  )
}

function YearDaysLeft({ locale }: { locale: Lang }) {
  const [date, setDate] = useState(today())
  const current = dateFromInput(date)
  const start = new Date(current.getFullYear(), 0, 1)
  const nextYear = new Date(current.getFullYear() + 1, 0, 1)
  const total = Math.round((nextYear.getTime() - start.getTime()) / 86400000)
  const dayOfYear = Math.floor((current.getTime() - start.getTime()) / 86400000) + 1
  const leftAfterToday = Math.max(0, total - dayOfYear)
  return (
    <Shell slug="year-days-left" locale={locale} result={<>
      <ResultRow label="Day of year" value={`${number(dayOfYear, locale, 0)} / ${number(total, locale, 0)}`} />
      <ResultRow label="Days left after today" value={number(leftAfterToday, locale, 0)} />
      <ResultRow label="Days left incl. today" value={number(leftAfterToday + 1, locale, 0)} />
      <ResultRow label="Year progress" value={`${number((dayOfYear / total) * 100, locale, 1)}%`} />
      <ResultRow label="Last day" value={`${current.getFullYear()}-12-31`} />
    </>}>
      <Field label="Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
    </Shell>
  )
}

function AnniversaryCalc({ locale }: { locale: Lang }) {
  const [start, setStart] = useState(today())
  const [unit, setUnit] = useState('days')
  const [count, setCount] = useState('100')
  const [target, setTarget] = useState(addDays(today(), 100))
  const anniversary = unit === 'years' ? addYears(start, n(count)) : unit === 'months' ? addMonths(start, n(count)) : addDays(start, n(count))
  const elapsed = daysBetween(start, target)
  return (
    <Shell slug="anniversary-calc" locale={locale} result={<>
      <ResultRow label="Anniversary date" value={anniversary} />
      <ResultRow label="Days to target" value={number(elapsed, locale, 0)} />
      <ResultRow label="100 days" value={addDays(start, 100)} />
      <ResultRow label="1,000 days" value={addDays(start, 1000)} />
      <ResultRow label="1 year" value={addYears(start, 1)} />
    </>}>
      <Field label="Start date"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Count"><Input type="number" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
        <Field label="Unit"><Select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="days">Days</option><option value="months">Months</option><option value="years">Years</option></Select></Field>
      </div>
      <Field label="Compare target date"><Input type="date" value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
    </Shell>
  )
}

function ShoeSizeConverter({ locale }: { locale: Lang }) {
  const [mm, setMm] = useState('260')
  const [fit, setFit] = useState('men')
  const length = n(mm)
  const usMen = (length - 180) / 8.47
  const usWomen = (length - 169) / 8.47
  const uk = usMen - 0.5
  const eu = length * 0.15 + 2
  return (
    <Shell slug="shoe-size-converter" locale={locale} result={<>
      <ResultRow label="Korea / Japan" value={`${number(length, locale, 0)} mm`} />
      <ResultRow label="US men" value={number(usMen, locale, 1)} />
      <ResultRow label="US women" value={number(usWomen, locale, 1)} />
      <ResultRow label="UK adult" value={number(uk, locale, 1)} />
      <ResultRow label="EU adult" value={number(eu, locale, 1)} />
      <ResultRow label="Selected fit" value={fit === 'women' ? number(usWomen, locale, 1) : number(usMen, locale, 1)} />
    </>}>
      <Field label="Foot length / KR size (mm)"><Input type="number" value={mm} onChange={(e) => setMm(e.target.value)} /></Field>
      <Field label="Fit reference"><Select value={fit} onChange={(e) => setFit(e.target.value)}><option value="men">Men</option><option value="women">Women</option></Select></Field>
    </Shell>
  )
}

function ClothingSizeConverter({ locale }: { locale: Lang }) {
  const [chest, setChest] = useState('100')
  const [waist, setWaist] = useState('82')
  const c = n(chest)
  const w = n(waist)
  const alpha = c < 88 ? 'XS' : c < 96 ? 'S' : c < 104 ? 'M' : c < 112 ? 'L' : c < 120 ? 'XL' : 'XXL'
  const krTop = Math.round(c / 5) * 5
  const euJacket = Math.round((c - 12) / 2)
  const usJacket = Math.round((c / 2.54 - 6) / 2) * 2
  const jeans = Math.round(w / 2.54)
  return (
    <Shell slug="clothing-size-converter" locale={locale} result={<>
      <ResultRow label="Letter size" value={alpha} />
      <ResultRow label="Korea top" value={number(krTop, locale, 0)} />
      <ResultRow label="US jacket" value={number(usJacket, locale, 0)} />
      <ResultRow label="EU jacket" value={number(euJacket, locale, 0)} />
      <ResultRow label="Jeans waist" value={`${number(jeans, locale, 0)} in`} />
    </>}>
      <Field label="Chest circumference (cm)"><Input type="number" value={chest} onChange={(e) => setChest(e.target.value)} /></Field>
      <Field label="Waist circumference (cm)"><Input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} /></Field>
    </Shell>
  )
}

export default function CalculatorTool({ slug, locale }: { slug: CalcSlug; locale: string }) {
  const lang = locale === 'kr' ? 'kr' : 'en'
  const tools: Record<CalcSlug, React.ReactNode> = {
    'percent-calc': <PercentCalc locale={lang} />,
    'date-calc': <DateCalc locale={lang} />,
    'time-diff-calc': <TimeDiffCalc locale={lang} />,
    'bmi-calc': <BmiCalc locale={lang} />,
    'average-calc': <AverageCalc locale={lang} />,
    'gpa-calc': <GpaCalc locale={lang} />,
    'salary-calc': <SalaryCalc locale={lang} />,
    'hourly-calc': <HourlyCalc locale={lang} />,
    'vat-calc': <VatCalc locale={lang} />,
    'currency-calc': <CurrencyCalc locale={lang} />,
    'compound-calc': <CompoundCalc locale={lang} />,
    'loan-calc': <LoanCalc locale={lang} />,
    'lived-days-calc': <LivedDaysCalc locale={lang} />,
    'year-days-left': <YearDaysLeft locale={lang} />,
    'anniversary-calc': <AnniversaryCalc locale={lang} />,
    'shoe-size-converter': <ShoeSizeConverter locale={lang} />,
    'clothing-size-converter': <ClothingSizeConverter locale={lang} />,
  }
  return tools[slug]
}
