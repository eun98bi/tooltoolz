import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GeneratorGameTool from '@/components/tools/GeneratorGameTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'nickname-gen' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { return { title: params.locale === 'kr' ? '닉네임 생성기 무료 온라인 - tooltoolz' : 'Nickname Generator Free Online - tooltoolz', description: 'Generate random nicknames for games and social profiles.', alternates: { canonical: `https://tooltoolz.com/${params.locale}/tools/nickname-gen`, languages: { ko: `https://tooltoolz.com/kr/tools/nickname-gen`, en: `https://tooltoolz.com/en/tools/nickname-gen` } } } }
export default function Page({ params }: { params: { locale: string } }) { setRequestLocale(params.locale); return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><GeneratorGameTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage> }
