import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CharCount from '@/components/tools/CharCount'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '글자수 세기 온라인 무료 — tooltoolz' : 'Character Counter Online Free — tooltoolz',
    description: isKr
      ? '글자수, 단어수, 줄수, 바이트를 실시간으로 세어드려요. 설치 없이 바로 사용.'
      : 'Count characters, words, lines, and bytes in real time. No install needed.',
  }
}

export default function CharCountPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <CharCount />
      <ToolSEOSection slug="char-count" locale={params.locale} />
    </ToolPage>
  )
}
