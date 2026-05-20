import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'dog-human-age' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '강아지 인간 나이 변환기 무료 온라인 - tooltoolz' : 'Dog Age to Human Age Converter Free Online - tooltoolz',
    description: isKr ? '강아지 나이와 크기별 기준으로 사람 나이를 대략 변환하세요.' : 'Convert dog age to an approximate human age by size.',
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
