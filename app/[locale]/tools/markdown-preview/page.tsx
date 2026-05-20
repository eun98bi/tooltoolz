import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import MarkdownPreview from '@/components/tools/MarkdownPreview'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'Markdown 미리보기 온라인 무료 — tooltoolz' : 'Markdown Preview Free Online — tooltoolz',
    description: isKr ? '마크다운을 실시간으로 렌더링합니다.' : 'Live preview Markdown rendering.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/markdown-preview`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/markdown-preview`,
        en: `https://tooltoolz.com/en/tools/markdown-preview`,
      },
    },
  }
}

export default function MarkdownPreviewPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <MarkdownPreview />
      <ToolSEOSection slug="markdown-preview" locale={params.locale} />
    </ToolPage>
  )
}
