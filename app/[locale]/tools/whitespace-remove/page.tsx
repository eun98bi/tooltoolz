import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import WhitespaceRemove from '@/components/tools/WhitespaceRemove'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '공백 제거 온라인 무료 — tooltoolz' : 'Whitespace Remover Free Online — tooltoolz',
    description: isKr
      ? '앞뒤·중복 공백을 일괄 제거합니다. 각 줄 트림, 모든 공백 제거 등 5가지 모드. 설치 없이 바로 사용.'
      : 'Trim, collapse, or remove all spaces from your text. 5 modes. No install needed.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/whitespace-remove`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/whitespace-remove`,
        en: `https://tooltoolz.com/en/tools/whitespace-remove`,
      },
    },
  }
}

export default function WhitespaceRemovePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <WhitespaceRemove />
      <ToolSEOSection slug="whitespace-remove" locale={params.locale} />
    </ToolPage>
  )
}
