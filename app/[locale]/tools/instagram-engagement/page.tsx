import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'instagram-engagement' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? '인스타 참여율 계산기 무료 온라인 - tooltoolz' : 'Instagram Engagement Calculator Free Online - tooltoolz',
    description: 'Calculate engagement rate from followers and interactions.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/instagram-engagement`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/instagram-engagement`,
        en: `https://tooltoolz.com/en/tools/instagram-engagement`,
      },
    },
  }
}
export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
