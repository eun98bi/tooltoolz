import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import PngToWebp from '@/components/tools/PngToWebp'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'PNG WebP 변환기 무료 온라인 - tooltoolz' : 'PNG to WebP Converter Free Online - tooltoolz',
    description: isKr
      ? 'PNG 이미지를 브라우저에서 바로 WebP로 변환하고 품질을 조절해 다운로드하세요.'
      : 'Convert PNG images to WebP in your browser with adjustable quality.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/png-to-webp`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/png-to-webp`,
        en: `https://tooltoolz.com/en/tools/png-to-webp`,
      },
    },
  }
}

export default function PngToWebpPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <PngToWebp />
      <ToolSEOSection slug="png-to-webp" locale={params.locale} />
    </ToolPage>
  )
}
