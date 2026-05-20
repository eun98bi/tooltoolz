import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import AnagramGen from '@/components/tools/AnagramGen'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '애너그램 생성기 온라인 무료 — tooltoolz' : 'Anagram Generator Free Online — tooltoolz',
    description: isKr ? '단어의 글자를 재배열해 모든 애너그램 조합을 찾아드립니다.' : 'Rearrange letters to find all anagram combinations of any word.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/anagram-gen`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/anagram-gen`,
        en: `https://tooltoolz.com/en/tools/anagram-gen`,
      },
    },
  }
}

export default function AnagramGenPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <AnagramGen />
      <ToolSEOSection slug="anagram-gen" locale={params.locale} />
    </ToolPage>
  )
}
