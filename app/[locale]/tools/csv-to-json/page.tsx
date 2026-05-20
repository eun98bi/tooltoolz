import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CsvToJson from '@/components/tools/CsvToJson'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'CSV to JSON 변환 온라인 무료 — tooltoolz' : 'CSV to JSON Converter Free Online — tooltoolz',
    description: isKr ? 'CSV를 JSON으로 즉시 변환합니다.' : 'Convert CSV data to JSON format instantly.',
  }
}

export default function CsvToJsonPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <CsvToJson />
      <ToolSEOSection slug="csv-to-json" locale={params.locale} />
    </ToolPage>
  )
}
