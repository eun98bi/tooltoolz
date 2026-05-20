import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import SlugGenerator from '@/components/tools/SlugGenerator'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'URL Slug 생성기 온라인 무료 — tooltoolz' : 'URL Slug Generator Free Online — tooltoolz',
    description: isKr
      ? '텍스트를 URL-friendly slug로 변환합니다. 하이픈/언더스코어 선택, 한글 유지 또는 제거. 설치 없이 바로 사용.'
      : 'Convert text to URL-friendly slugs. Choose hyphen or underscore separator. No install needed.',
  }
}

export default function SlugGeneratorPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <SlugGenerator />
      <ToolSEOSection slug="slug-generator" locale={params.locale} />
    </ToolPage>
  )
}
