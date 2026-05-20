import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Base64Converter from '@/components/tools/Base64Converter'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'Base64 변환 온라인 무료 — tooltoolz' : 'Base64 Converter Free Online — tooltoolz',
    description: isKr ? '텍스트를 Base64로 인코딩/디코딩합니다.' : 'Encode and decode Base64 strings.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/base64-converter`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/base64-converter`,
        en: `https://tooltoolz.com/en/tools/base64-converter`,
      },
    },
  }
}

export default function Base64ConverterPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <Base64Converter />
      <ToolSEOSection slug="base64-converter" locale={params.locale} />
    </ToolPage>
  )
}
