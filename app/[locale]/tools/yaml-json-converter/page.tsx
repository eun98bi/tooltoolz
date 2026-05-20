import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DeveloperTool from '@/components/tools/DeveloperTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'yaml-json-converter' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? 'YAML JSON 변환기 무료 온라인 - tooltoolz' : 'YAML JSON Converter Free Online - tooltoolz',
    description: 'Convert simple YAML and JSON formats.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/yaml-json-converter`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/yaml-json-converter`,
        en: `https://tooltoolz.com/en/tools/yaml-json-converter`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '도구 목록으로' : 'Back to tools'}><DeveloperTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
