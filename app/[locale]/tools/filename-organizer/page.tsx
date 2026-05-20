import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'filename-organizer' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? '파일명 정리기 무료 온라인 - tooltoolz' : 'Filename Organizer Free Online - tooltoolz',
    description: 'Preview bulk filename numbering and cleanup rules.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/filename-organizer`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/filename-organizer`,
        en: `https://tooltoolz.com/en/tools/filename-organizer`,
      },
    },
  }
}
export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
