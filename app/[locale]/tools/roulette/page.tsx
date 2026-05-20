import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GeneratorGameTool from '@/components/tools/GeneratorGameTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'roulette' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { return { title: params.locale === 'kr' ? '룰렛 무료 온라인 - tooltoolz' : 'Roulette Free Online - tooltoolz', description: 'Add items and spin a simple roulette picker.' } }
export default function Page({ params }: { params: { locale: string } }) { setRequestLocale(params.locale); return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><GeneratorGameTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage> }
