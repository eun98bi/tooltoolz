import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import JsonFormatter from '@/components/tools/JsonFormatter'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'JSON Formatter 온라인 무료 — tooltoolz' : 'JSON Formatter Online Free — tooltoolz',
    description: isKr
      ? 'JSON을 보기 좋게 정렬하거나 압축합니다. 문법 오류도 즉시 확인.'
      : 'Format, validate, and minify JSON instantly. Syntax errors highlighted.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/json-format`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/json-format`,
        en: `https://tooltoolz.com/en/tools/json-format`,
      },
    },
  }
}

export default function JsonFormatPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <JsonFormatter />
      <ToolSEOSection slug="json-format" locale={params.locale} />
    </ToolPage>
  )
}
