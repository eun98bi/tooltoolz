import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'subtitle-timestamp' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? '자막 타임코드 변환기 무료 온라인 - tooltoolz' : 'Subtitle Timestamp Converter Free Online - tooltoolz',
    description: 'Convert SRT and VTT timestamps or shift subtitle timing.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/subtitle-timestamp`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/subtitle-timestamp`,
        en: `https://tooltoolz.com/en/tools/subtitle-timestamp`,
      },
    },
  }
}
export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
