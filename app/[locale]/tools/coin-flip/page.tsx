import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GeneratorGameTool from '@/components/tools/GeneratorGameTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'coin-flip' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '동전 던지기 무료 온라인 - tooltoolz' : 'Coin Flip Free Online - tooltoolz',
    description: isKr ? '앞면과 뒷면을 무작위로 뽑고 결과 기록을 확인하세요.' : 'Flip a virtual coin and track heads, tails, and recent history.',
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><GeneratorGameTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
