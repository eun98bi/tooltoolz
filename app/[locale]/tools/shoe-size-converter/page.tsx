import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'shoe-size-converter' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '국제 신발 사이즈 변환기 무료 온라인 - tooltoolz' : 'International Shoe Size Converter Free Online - tooltoolz',
    description: isKr ? '한국, 일본, 미국, 영국, 유럽 신발 사이즈를 발 길이 기준으로 변환하세요.' : 'Convert shoe sizes between Korea, Japan, US, UK, and EU.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/shoe-size-converter`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/shoe-size-converter`,
        en: `https://tooltoolz.com/en/tools/shoe-size-converter`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
