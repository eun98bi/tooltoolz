import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CaseConverter from '@/components/tools/CaseConverter'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '대소문자 변환 온라인 무료 — tooltoolz' : 'Case Converter Free Online — tooltoolz',
    description: isKr
      ? 'UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case 등 9가지 변환. 설치 없이 바로 사용.'
      : 'Convert text to UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case. No install.',
  }
}

export default function CaseConverterPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <CaseConverter />
      <ToolSEOSection slug="case-converter" locale={params.locale} />
    </ToolPage>
  )
}
