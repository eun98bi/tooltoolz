import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import NicheCalculatorTool from '@/components/tools/NicheCalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'cat-human-age' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '고양이 인간 나이 변환기 무료 온라인 - tooltoolz' : 'Cat Age to Human Age Converter Free Online - tooltoolz',
    description: isKr ? '고양이 나이를 사람 나이로 대략 변환하고 생애 단계를 확인하세요.' : 'Convert cat age to an approximate human age and life stage.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/cat-human-age`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/cat-human-age`,
        en: `https://tooltoolz.com/en/tools/cat-human-age`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><NicheCalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
