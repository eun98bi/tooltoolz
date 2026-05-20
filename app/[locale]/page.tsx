import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ToolGrid from '@/components/ui/ToolGrid'
import { tools } from '@/lib/tools'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  const locale = params.locale
  return {
    title: isKr ? 'tooltoolz — 웹 툴 모음' : 'tooltoolz — All Your Tools, One Place',
    description: isKr
      ? `${tools.length}개 무료 온라인 웹 툴 모음. 설치 없이 바로 사용하세요.`
      : `${tools.length} free online web tools. No install needed, use instantly.`,
    alternates: {
      canonical: `https://tooltoolz.com/${locale}`,
      languages: {
        ko: 'https://tooltoolz.com/kr',
        en: 'https://tooltoolz.com/en',
      },
    },
  }
}

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <ToolGrid locale={params.locale} tools={tools} />
}
