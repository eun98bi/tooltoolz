import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ImageCrop from '@/components/tools/ImageCrop'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '이미지 자르기 무료 온라인 - tooltoolz' : 'Image Crop Tool Free Online - tooltoolz',
    description: isKr
      ? 'JPG, PNG, WebP 이미지를 브라우저에서 원하는 영역만 잘라 다운로드하세요.'
      : 'Crop JPG, PNG, and WebP images directly in your browser and download the result.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/img-crop`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/img-crop`,
        en: `https://tooltoolz.com/en/tools/img-crop`,
      },
    },
  }
}

export default function ImageCropPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <ImageCrop />
      <ToolSEOSection slug="img-crop" locale={params.locale} />
    </ToolPage>
  )
}
