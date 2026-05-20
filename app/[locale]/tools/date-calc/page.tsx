import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'date-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '날짜 계산기 무료 온라인 - tooltoolz' : 'Date Calculator Free Online - tooltoolz',
    description: isKr ? '날짜 차이, D-day, 날짜 더하기와 빼기를 계산하세요.' : 'Calculate date differences, D-days, and date addition or subtraction.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/date-calc`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/date-calc`,
        en: `https://tooltoolz.com/en/tools/date-calc`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
