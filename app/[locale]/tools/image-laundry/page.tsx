import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ImageLaundry from '@/components/tools/ImageLaundry'
import ToolPage from '@/components/ui/ToolPage'
import ToolSEOSection from '@/components/ui/ToolSEOSection'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isKr = params.locale === 'kr'
  return {
    title: isKr ? '이미지 세탁소 - 블로그 유사이미지 방지 무료 도구 - tooltoolz' : 'Image Laundry - Refresh Reused Photos Free Online - tooltoolz',
    description: isKr
      ? '네이버 블로그 등에 이미지를 재사용할 때 유사문서·유사이미지로 판단되지 않도록 메타데이터 제거, 미세 노이즈, 크롭, 리사이즈, 색감 보정을 여러 장 한 번에 적용하세요. 서버 업로드 없이 브라우저에서 처리됩니다.'
      : 'Give reused photos a fresh fingerprint for blogs and listings: strip metadata, add subtle noise, crop, resize, and tweak colors in bulk. Everything runs in your browser with no uploads.',
    alternates: {
      canonical: `https://tooltoolz.com/${params.locale}/tools/image-laundry`,
      languages: {
        ko: `https://tooltoolz.com/kr/tools/image-laundry`,
        en: `https://tooltoolz.com/en/tools/image-laundry`,
      },
    },
  }
}

export default function ImageLaundryPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isKr = params.locale === 'kr'
  return (
    <ToolPage locale={params.locale} backLabel={isKr ? '← 도구 목록으로' : '← Back to tools'}>
      <ImageLaundry />
      <ToolSEOSection slug="image-laundry" locale={params.locale} />
    </ToolPage>
  )
}
