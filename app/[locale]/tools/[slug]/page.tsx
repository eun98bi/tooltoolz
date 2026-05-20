import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import MiscTool from '@/components/tools/MiscTools'
import { miscSlugs } from '@/lib/misc-slugs'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'
import en from '@/messages/en.json'
import kr from '@/messages/kr.json'

type Params = { locale: string; slug: string }

export function generateStaticParams() {
  return ['kr', 'en'].flatMap((locale) => miscSlugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const messages = params.locale === 'kr' ? kr : en
  const item = (messages.tools as Record<string, { title?: string; desc?: string }>)[params.slug]
  return {
    title: `${item?.title ?? params.slug} - tooltoolz`,
    description: item?.desc ?? 'Free online tool.',
  }
}

export default function Page({ params }: { params: Params }) {
  if (!miscSlugs.includes(params.slug as typeof miscSlugs[number])) notFound()
  setRequestLocale(params.locale)
  const slug = params.slug as typeof miscSlugs[number]
  return (
    <ToolPage locale={params.locale} backLabel={params.locale === 'kr' ? '도구 목록으로' : 'Back to tools'}>
      <MiscTool slug={slug} locale={params.locale} />
      <ToolSEOSection slug={slug} locale={params.locale} />
    </ToolPage>
  )
}
