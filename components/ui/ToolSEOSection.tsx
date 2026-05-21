import Link from 'next/link'
import { seoContent } from '@/lib/seo-content'
import AdBanner from './AdBanner'
import CoupangBanner from './CoupangBanner'

interface ToolSEOSectionProps {
  slug: string
  locale: string
}

export default function ToolSEOSection({ slug, locale }: ToolSEOSectionProps) {
  const content = seoContent[slug]?.[locale as 'kr' | 'en']
  if (!content) return null

  const isKr = locale === 'kr'

  return (
    <>
      {isKr ? <CoupangBanner /> : <AdBanner />}
    <section className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">{content.heading}</h2>
      <div className="space-y-4 max-w-3xl">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
          </svg>
          {isKr ? '다른 툴 사용하러 가기' : 'Explore All Web Tools'}
        </Link>
      </div>
    </section>
    </>
  )
}
