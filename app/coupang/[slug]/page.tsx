import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCoupangBridge } from '@/lib/coupang-bridge'
import CoupangCtaButton from '@/components/coupang/CoupangCtaButton'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getCoupangBridge(slug)
  if (!data) return {}
  return {
    title: data.title,
    description: data.price ? `${data.price} — 쿠팡에서 확인하기` : '쿠팡에서 확인하기',
  }
}

export default async function CoupangBridgePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getCoupangBridge(slug)
  if (!data) notFound()

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-6 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <div className="w-full max-w-sm space-y-5">
        {data.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.imageUrl}
            alt={data.title}
            className="aspect-square w-full rounded-2xl border border-gray-200 object-cover dark:border-gray-800"
          />
        ) : (
          <div className="aspect-square w-full rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900" />
        )}

        <div className="space-y-1">
          <h1 className="text-lg font-semibold leading-snug">{data.title}</h1>
          {data.price && <p className="text-2xl font-bold">{data.price}</p>}
        </div>

        <CoupangCtaButton slug={data.slug} title={data.title} deepLink={data.deepLink} />

        <p className="text-center text-xs leading-relaxed text-gray-400">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>
    </main>
  )
}
