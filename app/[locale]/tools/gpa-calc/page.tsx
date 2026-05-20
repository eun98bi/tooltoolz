import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import CalculatorTool from '@/components/tools/CalculatorTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'gpa-calc' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? 'GPA 계산기 무료 온라인 - tooltoolz' : 'GPA Calculator Free Online - tooltoolz',
    description: isKr ? '학점과 이수 학점으로 가중 GPA를 계산하세요.' : 'Calculate weighted GPA from credits and grades.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/gpa-calc`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/gpa-calc`,
        en: `https://tooltoolz.com/en/tools/gpa-calc`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '← 도구 목록으로' : '← Back to tools'}><CalculatorTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
