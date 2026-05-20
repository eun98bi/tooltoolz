import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import MorseCode from '@/components/tools/MorseCode'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '모스부호 변환기 온라인 무료 — tooltoolz' : 'Morse Code Converter Free Online — tooltoolz',
    description: isKr ? '텍스트를 모스부호로 변환하거나 모스부호를 텍스트로 해독합니다.' : 'Convert text to Morse code or decode Morse code back to text instantly.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/morse-code`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/morse-code`,
        en: `https://tooltoolz.com/en/tools/morse-code`,
      },
    },
  }
}

export default function MorseCodePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <MorseCode />
      <ToolSEOSection slug="morse-code" locale={params.locale} />
    </ToolPage>
  )
}
