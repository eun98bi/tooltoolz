import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ImageCompress from '@/components/tools/ImageCompress'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '이미지 압축기 무료 온라인 - tooltoolz' : 'Image Compressor Free Online - tooltoolz',
    description: isKr
      ? 'JPG, PNG, WebP 이미지를 브라우저에서 압축하고 WebP 또는 JPG로 다운로드하세요.'
      : 'Compress JPG, PNG, and WebP images in your browser and download as WebP or JPG.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/img-compress`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/img-compress`,
        en: `https://tooltoolz.com/en/tools/img-compress`,
      },
    },
  }
}

export default function ImageCompressPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <ImageCompress />
      <ToolSEOSection slug="img-compress" locale={params.locale} />
    </ToolPage>
  )
}
