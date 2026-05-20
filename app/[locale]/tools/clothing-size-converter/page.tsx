import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'clothing-size-converter' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '국제 의류 사이즈 변환기 무료 온라인 - tooltoolz' : 'International Clothing Size Converter Free Online - tooltoolz',
    description: isKr ? '가슴둘레와 허리둘레로 한국, US, EU, 청바지 사이즈를 대략 변환하세요.' : 'Convert clothing sizes from chest and waist measurements.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/clothing-size-converter`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/clothing-size-converter`,
        en: `https://tooltoolz.com/en/tools/clothing-size-converter`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
