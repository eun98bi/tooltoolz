import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DeveloperTool from '@/components/tools/DeveloperTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'regex-tester' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return { title: params.locale === 'kr' ? '정규식 테스터 무료 온라인 - tooltoolz' : 'Regex Tester Free Online - tooltoolz', description: 'Test regular expressions against text in real time.' }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '도구 목록으로' : 'Back to tools'}><DeveloperTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
