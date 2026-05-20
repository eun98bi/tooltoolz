import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GeneratorGameTool from '@/components/tools/GeneratorGameTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'team-divider' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { return { title: params.locale === 'kr' ? '팀 나누기 무료 온라인 - tooltoolz' : 'Team Divider Free Online - tooltoolz', description: 'Randomly divide members into teams.', alternates: { canonical: `https://tooltoolz.com/${params.locale}/tools/team-divider`, languages: { ko: `https://tooltoolz.com/kr/tools/team-divider`, en: `https://tooltoolz.com/en/tools/team-divider` } } } }
export default function Page({ params }: { params: { locale: string } }) { setRequestLocale(params.locale); return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><GeneratorGameTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage> }
