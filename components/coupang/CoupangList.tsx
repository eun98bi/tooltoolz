'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { CoupangBridgeData } from '@/lib/coupang-bridge'

export default function CoupangList({ items }: { items: CoupangBridgeData[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="상품 검색..."
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900"
      />

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          {items.length === 0 ? '아직 등록된 상품이 없어요.' : '검색 결과가 없어요.'}
        </p>
      ) : (
        <ul className="max-h-[75vh] space-y-3 overflow-y-auto pr-1">
          {filtered.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/coupang/${item.slug}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.price && (
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
                      {item.price}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
