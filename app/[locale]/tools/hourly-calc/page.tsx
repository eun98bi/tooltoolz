import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'hourly-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '시급 계산기 무료 온라인 - tooltoolz' : 'Hourly Wage Calculator Free Online - tooltoolz',
    description: isKr ? '시급, 주 근무 시간, 초과 근무를 기준으로 수입을 계산하세요.' : 'Estimate weekly, monthly, and annual pay from hourly wage.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/hourly-calc`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/hourly-calc`,
        en: `https://tooltoolz.com/en/tools/hourly-calc`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
