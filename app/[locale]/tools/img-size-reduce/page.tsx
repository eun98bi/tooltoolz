import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ImageSizeReduce from '@/components/tools/ImageSizeReduce'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '이미지 용량 줄이기 무료 온라인 - tooltoolz' : 'Image Size Reducer Free Online - tooltoolz',
    description: isKr
      ? 'JPG, PNG, WebP 이미지를 목표 KB 용량에 맞춰 브라우저에서 자동 압축하세요.'
      : 'Reduce JPG, PNG, and WebP images toward a target KB size directly in your browser.',
  }
}

export default function ImageSizeReducePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <ImageSizeReduce />
      <ToolSEOSection slug="img-size-reduce" locale={params.locale} />
    </ToolPage>
  )
}
