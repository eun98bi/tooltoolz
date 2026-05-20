import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import DeveloperTool from '@/components/tools/DeveloperTools'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

const slug = 'image-to-base64' as const

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'kr' ? '이미지 Base64 변환기 무료 온라인 - tooltoolz' : 'Image to Base64 Converter Free Online - tooltoolz',
    description: 'Convert image files to Base64 data URIs locally.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/image-to-base64`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/image-to-base64`,
        en: `https://tooltoolz.com/en/tools/image-to-base64`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '도구 목록으로' : 'Back to tools'}><DeveloperTool slug={slug} locale={params.locale} /><ToolSEOSection slug={slug} locale={params.locale} /></ToolPage>
}
