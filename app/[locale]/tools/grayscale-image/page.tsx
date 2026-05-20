import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import GrayscaleImage from '@/components/tools/GrayscaleImage'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '사진 흑백 변환기 무료 온라인 - tooltoolz' : 'Black & White Photo Converter Free Online - tooltoolz',
    description: isKr
      ? 'JPG, PNG, WebP 이미지를 흑백(그레이스케일)으로 변환하고 다운로드하세요.'
      : 'Convert JPG, PNG, or WebP images to grayscale (black and white) and download instantly.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/grayscale-image`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/grayscale-image`,
        en: `https://tooltoolz.com/en/tools/grayscale-image`,
      },
    },
  }
}

export default function GrayscaleImagePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <GrayscaleImage />
      <ToolSEOSection slug="grayscale-image" locale={params.locale} />
    </ToolPage>
  )
}
