import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GeneratorGameTool from '@/components/tools/GeneratorGameTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
const slug = 'mbti-compatibility' as const
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> { return { title: params.locale === 'kr' ? 'MBTI 궁합 무료 온라인 - tooltoolz' : 'MBTI Compatibility Free Online - tooltoolz', description: 'Check a simple MBTI compatibility score.', alternates: { canonical: `https://tooltoolz.com/${params.locale}/tools/mbti-compatibility`, languages: { ko: `https://tooltoolz.com/kr/tools/mbti-compatibility`, en: `https://tooltoolz.com/en/tools/mbti-compatibility` } } } }
export default function Page({ params }: { params: { locale: string } }) { setRequestLocale(params.locale); return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><GeneratorGameTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage> }
