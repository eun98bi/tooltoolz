import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'youtube-earnings' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? '유튜브 수익 계산기 무료 온라인 - tooltoolz' : 'YouTube Earnings Calculator Free Online - tooltoolz',
    description: 'Estimate creator revenue from views, CPM, and share.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/youtube-earnings`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/youtube-earnings`,
        en: `https://tooltoolz.com/en/tools/youtube-earnings`,
      },
    },
  }
}
export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
