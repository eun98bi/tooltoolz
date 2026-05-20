import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GeneratorGameTool from '@/components/tools/GeneratorGameTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'random-lottery' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { return { title: params.locale === 'kr' ? '랜덤 추첨기 무료 온라인 - tooltoolz' : 'Random Lottery Free Online - tooltoolz', description: 'Draw random winners from a list.', alternates: { canonical: `https://tooltoolz.com/${params.locale}/tools/random-lottery`, languages: { ko: `https://tooltoolz.com/kr/tools/random-lottery`, en: `https://tooltoolz.com/en/tools/random-lottery` } } } }
export default function Page({ params }: { params: { locale: string } }) { setRequestLocale(params.locale); return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><GeneratorGameTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage> }
