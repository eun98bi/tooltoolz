import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import JpgToPng from '@/components/tools/JpgToPng'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'JPG PNG 변환기 무료 온라인 - tooltoolz' : 'JPG to PNG Converter Free Online - tooltoolz',
    description: isKr
      ? 'JPG, JPEG 이미지를 브라우저에서 바로 PNG 파일로 변환하고 다운로드하세요. 업로드 없이 무료로 사용할 수 있습니다.'
      : 'Convert JPG and JPEG images to PNG in your browser. Free, instant, and no upload required.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/jpg-to-png`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/jpg-to-png`,
        en: `https://tooltoolz.com/en/tools/jpg-to-png`,
      },
    },
  }
}

export default function JpgToPngPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <JpgToPng />
      <ToolSEOSection slug="jpg-to-png" locale={params.locale} />
    </ToolPage>
  )
}
