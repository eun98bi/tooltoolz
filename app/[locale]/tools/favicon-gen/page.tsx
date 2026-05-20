import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import FaviconGen from '@/components/tools/FaviconGen'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'Favicon 생성기 무료 온라인 - tooltoolz' : 'Favicon Generator Free Online - tooltoolz',
    description: isKr
      ? '이미지에서 favicon.ico, favicon PNG, apple touch icon, SVG favicon을 브라우저에서 바로 생성하세요.'
      : 'Generate favicon.ico, favicon PNG files, apple touch icons, and SVG favicons from an image in your browser.',
  }
}

export default function FaviconGenPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <FaviconGen />
      <ToolSEOSection slug="favicon-gen" locale={params.locale} />
    </ToolPage>
  )
}
