import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import UrlEncoder from '@/components/tools/UrlEncoder'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'URL 인코더/디코더 온라인 무료 — tooltoolz' : 'URL Encoder/Decoder Free Online — tooltoolz',
    description: isKr ? 'URL 퍼센트 인코딩/디코딩을 즉시 처리합니다.' : 'Percent-encode or decode URL strings instantly.',
  }
}

export default function UrlEncoderPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <UrlEncoder />
      <ToolSEOSection slug="url-encoder" locale={params.locale} />
    </ToolPage>
  )
}
