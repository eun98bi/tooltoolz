import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DeveloperTool from '@/components/tools/DeveloperTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'json-to-csv' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? 'JSON CSV 변환기 무료 온라인 - tooltoolz' : 'JSON CSV Converter Free Online - tooltoolz',
    description: 'Convert JSON arrays to CSV and simple CSV to JSON.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/json-to-csv`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/json-to-csv`,
        en: `https://tooltoolz.com/en/tools/json-to-csv`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '도구 목록으로' : 'Back to tools'}><DeveloperTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
