import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'baseball-stats' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return { title: params.locale === 'kr' ? '야구 스탯 계산기 무료 온라인 - tooltoolz' : 'Baseball Stats Calculator Free Online - tooltoolz', description: 'Calculate batting average, OBP, SLG, OPS, and ERA.' }
}
export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
