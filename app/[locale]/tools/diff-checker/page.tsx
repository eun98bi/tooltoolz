import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DiffChecker from '@/components/tools/DiffChecker'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '텍스트 비교 (Diff) 온라인 무료 — tooltoolz' : 'Diff Checker Free Online — tooltoolz',
    description: isKr ? '두 텍스트의 차이점을 시각화합니다.' : 'Visualize differences between two texts.',
  }
}

export default function DiffCheckerPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <DiffChecker />
      <ToolSEOSection slug="diff-checker" locale={params.locale} />
    </ToolPage>
  )
}
