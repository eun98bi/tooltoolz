import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ColorConverter from '@/components/tools/ColorConverter'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '색상 코드 변환기 HEX RGB HSL — tooltoolz' : 'Color Code Converter HEX RGB HSL — tooltoolz',
    description: isKr
      ? 'HEX ↔ RGB ↔ HSL 색상 코드를 즉시 변환합니다. 색상 미리보기 포함.'
      : 'Convert between HEX, RGB, and HSL color codes instantly. Includes color preview.',
  }
}

export default function ColorConverterPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <ColorConverter />
      <ToolSEOSection slug="color-converter" locale={params.locale} />
    </ToolPage>
  )
}
