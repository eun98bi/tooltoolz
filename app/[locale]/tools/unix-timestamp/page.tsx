import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DeveloperTool from '@/components/tools/DeveloperTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'unix-timestamp' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? 'Unix 타임스탬프 변환기 무료 온라인 - tooltoolz' : 'Unix Timestamp Converter Free Online - tooltoolz',
    description: 'Convert Unix timestamps and dates.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/unix-timestamp`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/unix-timestamp`,
        en: `https://tooltoolz.com/en/tools/unix-timestamp`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '도구 목록으로' : 'Back to tools'}><DeveloperTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
