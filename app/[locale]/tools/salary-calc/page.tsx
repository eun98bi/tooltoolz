import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'salary-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '연봉 실수령 계산기 무료 온라인 - tooltoolz' : 'Salary Calculator Free Online - tooltoolz',
    description: isKr ? '연봉, 공제율, 월 실수령액을 간단히 계산하세요.' : 'Estimate annual net salary and monthly take-home pay.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/salary-calc`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/salary-calc`,
        en: `https://tooltoolz.com/en/tools/salary-calc`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
