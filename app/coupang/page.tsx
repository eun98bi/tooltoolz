import type { Metadata } from 'next'
import { listCoupangBridges } from '@/lib/coupang-bridge'
import CoupangList from '@/components/coupang/CoupangList'

export const metadata: Metadata = {
  title: '쿠팡 특가 모음 | tooltoolz',
  description: 'tooltoolz가 엄선한 쿠팡 특가 상품 모음',
}

export default async function CoupangIndexPage() {
  const items = await listCoupangBridges()

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <div className="mx-auto max-w-md">
        <p className="mb-2 text-xs text-gray-400">
          쿠팡 파트너스 수수료를 받는 링크가 포함되어 있습니다
        </p>
        <h1 className="mb-6 text-xl font-bold">쿠팡 특가 모음</h1>
        <CoupangList items={items} />
      </div>
    </main>
  )
}
