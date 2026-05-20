import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'average-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '평균 계산기 무료 온라인 - tooltoolz' : 'Average Calculator Free Online - tooltoolz',
    description: isKr ? '평균, 중앙값, 최빈값, 합계, 최소/최대값을 계산하세요.' : 'Calculate mean, median, mode, sum, min, and max.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/average-calc`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/average-calc`,
        en: `https://tooltoolz.com/en/tools/average-calc`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
