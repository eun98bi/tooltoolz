import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import MobileLineBreak from '@/components/tools/MobileLineBreak'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr
      ? '모바일 줄바꿈 온라인 무료 — tooltoolz'
      : 'Mobile Line Breaker Free Online — tooltoolz',
    description: isKr
      ? '긴 텍스트를 모바일 화면 너비에 맞게 자동으로 줄바꿈합니다. 한글 2칸 계산 지원. 설치 없이 바로 사용.'
      : 'Auto line-break long text to fit mobile screen width. Supports CJK double-width. No install needed.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/mobile-line-break`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/mobile-line-break`,
        en: `https://tooltoolz.com/en/tools/mobile-line-break`,
      },
    },
  }
}

export default function MobileLineBreakPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <MobileLineBreak />
      <ToolSEOSection slug="mobile-line-break" locale={params.locale} />
    </ToolPage>
  )
}
