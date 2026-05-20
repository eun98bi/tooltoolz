import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import QrCode from '@/components/tools/QrCode'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'QR코드 생성기 무료 온라인 — tooltoolz' : 'QR Code Generator Free Online — tooltoolz',
    description: isKr
      ? 'URL이나 텍스트를 QR코드로 즉시 변환합니다. PNG 다운로드 가능.'
      : 'Convert URLs or text to QR codes instantly. Download as PNG.',
  }
}

export default function QrCodePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <QrCode />
      <ToolSEOSection slug="qr-code" locale={params.locale} />
    </ToolPage>
  )
}
