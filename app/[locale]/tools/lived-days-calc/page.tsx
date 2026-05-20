import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'lived-days-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '살아온 날짜 계산기 무료 온라인 - tooltoolz' : 'Days Lived Calculator Free Online - tooltoolz',
    description: isKr ? '생년월일 기준으로 살아온 일수, 주수, 개월수, 다음 10000일 날짜를 계산하세요.' : 'Calculate days, weeks, months, years lived, and your 10000th day.',
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
