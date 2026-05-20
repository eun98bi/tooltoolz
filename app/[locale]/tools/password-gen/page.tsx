import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import PasswordGen from '@/components/tools/PasswordGen'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '비밀번호 생성기 무료 온라인 — tooltoolz' : 'Password Generator Free Online — tooltoolz',
    description: isKr
      ? '안전한 랜덤 비밀번호를 즉시 생성합니다. 길이·문자 옵션 커스텀 가능.'
      : 'Generate strong random passwords instantly. Customize length and character sets.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/password-gen`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/password-gen`,
        en: `https://tooltoolz.com/en/tools/password-gen`,
      },
    },
  }
}

export default function PasswordGenPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 목록으로' : '← Back to tools'}>
      <PasswordGen />
      <ToolSEOSection slug="password-gen" locale={params.locale} />
    </ToolPage>
  )
}
