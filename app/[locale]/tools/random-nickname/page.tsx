import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import RandomNickname from '@/components/tools/RandomNickname'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '랜덤 한글 닉네임 생성기 무료 — tooltoolz' : 'Random Korean Nickname Generator Free — tooltoolz',
    description: isKr ? '귀여운·쿨한·재미있는 한글 닉네임을 즉시 생성합니다.' : 'Generate random Korean nicknames instantly.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/random-nickname`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/random-nickname`,
        en: `https://tooltoolz.com/en/tools/random-nickname`,
      },
    },
  }
}

export default function RandomNicknamePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <RandomNickname />
      <ToolSEOSection slug="random-nickname" locale={params.locale} />
    </ToolPage>
  )
}
