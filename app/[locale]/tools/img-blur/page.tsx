import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ImageBlur from '@/components/tools/ImageBlur'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '이미지 블러 무료 온라인 - tooltoolz' : 'Image Blur Tool Free Online - tooltoolz',
    description: isKr
      ? 'JPG, PNG, WebP 이미지 전체 또는 선택 영역에 블러를 적용하고 다운로드하세요.'
      : 'Apply blur to an entire JPG, PNG, or WebP image, or blur only a selected area.',
  }
}

export default function ImageBlurPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <ImageBlur />
      <ToolSEOSection slug="img-blur" locale={params.locale} />
    </ToolPage>
  )
}
