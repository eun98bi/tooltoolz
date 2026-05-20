import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ImageRotate from '@/components/tools/ImageRotate'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '이미지 회전 뒤집기 무료 온라인 - tooltoolz' : 'Image Rotate and Flip Free Online - tooltoolz',
    description: isKr
      ? 'JPG, PNG, WebP 이미지를 브라우저에서 회전하거나 좌우/상하 반전하고 다운로드하세요.'
      : 'Rotate or flip JPG, PNG, and WebP images in your browser and download the result.',
  }
}

export default function ImageRotatePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <ImageRotate />
      <ToolSEOSection slug="img-rotate" locale={params.locale} />
    </ToolPage>
  )
}
