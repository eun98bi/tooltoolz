import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DeveloperTool from '@/components/tools/DeveloperTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'current-ip-checker' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return { title: params.locale === 'kr' ? '현재 IP 확인기 무료 온라인 - tooltoolz' : 'Current IP Checker Free Online - tooltoolz', description: 'Check your current public IP address.' }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '도구 목록으로' : 'Back to tools'}><DeveloperTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
