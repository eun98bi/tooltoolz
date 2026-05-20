import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'video-bitrate-calc' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return { title: params.locale === 'kr' ? '영상 비트레이트 계산기 무료 온라인 - tooltoolz' : 'Video Bitrate Calculator Free Online - tooltoolz', description: 'Estimate file size and target video bitrate.' }
}
export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
