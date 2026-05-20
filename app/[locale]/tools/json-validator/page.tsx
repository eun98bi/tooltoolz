import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import JsonValidator from '@/components/tools/JsonValidator'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'JSON Validator 온라인 무료 — tooltoolz' : 'JSON Validator Free Online — tooltoolz',
    description: isKr ? 'JSON 문법 오류를 즉시 찾아냅니다.' : 'Find and fix JSON syntax errors instantly.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/json-validator`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/json-validator`,
        en: `https://tooltoolz.com/en/tools/json-validator`,
      },
    },
  }
}

export default function JsonValidatorPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <JsonValidator />
      <ToolSEOSection slug="json-validator" locale={params.locale} />
    </ToolPage>
  )
}
