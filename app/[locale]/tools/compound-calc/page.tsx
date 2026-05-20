import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'compound-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '복리 계산기 무료 온라인 - tooltoolz' : 'Compound Interest Calculator Free Online - tooltoolz',
    description: isKr ? '원금, 월 납입액, 수익률, 기간으로 복리 성장을 계산하세요.' : 'Calculate compound growth from principal, contributions, return, and time.',
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
