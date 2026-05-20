import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GeneratorGameTool from '@/components/tools/GeneratorGameTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'ladder-game' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { return { title: params.locale === 'kr' ? '사다리타기 무료 온라인 - tooltoolz' : 'Ladder Game Free Online - tooltoolz', description: 'Randomly match players to results.', alternates: { canonical: `https://tooltoolz.com/${params.locale}/tools/ladder-game`, languages: { ko: `https://tooltoolz.com/kr/tools/ladder-game`, en: `https://tooltoolz.com/en/tools/ladder-game` } } } }
export default function Page({ params }: { params: { locale: string } }) { setRequestLocale(params.locale); return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><GeneratorGameTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage> }
