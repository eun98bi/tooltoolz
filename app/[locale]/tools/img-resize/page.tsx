import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ImageResize from '@/components/tools/ImageResize'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '이미지 리사이즈 무료 온라인 - tooltoolz' : 'Image Resizer Free Online - tooltoolz',
    description: isKr
      ? 'JPG, PNG, WebP 이미지를 브라우저에서 원하는 픽셀 크기로 리사이즈하고 다운로드하세요.'
      : 'Resize JPG, PNG, and WebP images to exact pixel dimensions in your browser.',
  }
}

export default function ImageResizePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <ImageResize />
      <ToolSEOSection slug="img-resize" locale={params.locale} />
    </ToolPage>
  )
}
