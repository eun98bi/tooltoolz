import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NewlineRemove from '@/components/tools/NewlineRemove'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr
      ? '줄바꿈 제거 온라인 무료 — tooltoolz'
      : 'Newline Remover Free Online — tooltoolz',
    description: isKr
      ? '줄바꿈(개행문자)을 제거하거나 공백·커스텀 문자로 변환합니다. CRLF↔LF 변환 지원. 설치 없이 바로 사용.'
      : 'Remove or convert newlines: strip all, replace with space, collapse blank lines, or CRLF↔LF. No install needed.',
  }
}

export default function NewlineRemovePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <NewlineRemove />
      <ToolSEOSection slug="newline-remove" locale={params.locale} />
    </ToolPage>
  )
}
