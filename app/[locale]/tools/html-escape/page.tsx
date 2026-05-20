import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import HtmlEscape from '@/components/tools/HtmlEscape'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'HTML Escape 온라인 무료 — tooltoolz' : 'HTML Escape Free Online — tooltoolz',
    description: isKr ? 'HTML 특수문자를 이스케이프/언이스케이프합니다.' : 'Escape or unescape HTML special characters.',
  }
}

export default function HtmlEscapePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <HtmlEscape />
      <ToolSEOSection slug="html-escape" locale={params.locale} />
    </ToolPage>
  )
}
