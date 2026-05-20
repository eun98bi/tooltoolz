import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'currency-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '환율 계산기 무료 온라인 - tooltoolz' : 'Currency Calculator Free Online - tooltoolz',
    description: isKr ? '직접 입력한 환율로 금액을 변환하세요.' : 'Convert amounts with a manually entered exchange rate.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/currency-calc`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/currency-calc`,
        en: `https://tooltoolz.com/en/tools/currency-calc`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
