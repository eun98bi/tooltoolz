import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'percent-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '퍼센트 계산기 무료 온라인 - tooltoolz' : 'Percentage Calculator Free Online - tooltoolz',
    description: isKr ? '퍼센트, 할인율, 증감률을 바로 계산하세요.' : 'Calculate percentages, discounts, increases, and changes instantly.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/percent-calc`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/percent-calc`,
        en: `https://tooltoolz.com/en/tools/percent-calc`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
