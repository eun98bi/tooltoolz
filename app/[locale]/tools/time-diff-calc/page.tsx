import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'time-diff-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '시간 차 계산기 무료 온라인 - tooltoolz' : 'Time Difference Calculator Free Online - tooltoolz',
    description: isKr ? '두 시각 사이의 분, 시간, 일을 계산하세요.' : 'Calculate minutes, hours, and days between two times.',
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
