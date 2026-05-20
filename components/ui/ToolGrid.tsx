'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Tool, Category } from '@/lib/tools'
import ToolCard from './ToolCard'

interface ToolGridProps {
  locale: string
  tools: Tool[]
}

const CATEGORIES: Array<{ key: 'all' | Category; label: string }> = [
  { key: 'all',         label: 'all' },
  { key: 'text',        label: 'text' },
  { key: 'image',       label: 'image' },
  { key: 'calc',        label: 'calc' },
  { key: 'niche',       label: 'niche' },
  { key: 'generator',   label: 'generator' },
  { key: 'dev',         label: 'dev' },
  { key: 'design',      label: 'design' },
  { key: 'kr',          label: 'kr' },
  { key: 'productivity',label: 'productivity' },
]

export default function ToolGrid({ locale, tools }: ToolGridProps) {
  const t = useTranslations()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return tools.filter((tool) => {
      const matchCat = activeCategory === 'all' || tool.category === activeCategory
      if (!matchCat) return false
      if (!q) return true
      const title = t(`tools.${tool.slug}.title`).toLowerCase()
      const desc = t(`tools.${tool.slug}.desc`).toLowerCase()
      return title.includes(q) || desc.includes(q)
    })
  }, [tools, search, activeCategory, t])

  const implementedCount = tools.filter((tool) => tool.implemented).length

  return (
    <div>
      {/* Hero */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('home.title')}
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">{t('home.subtitle')}</p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('home.search')}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span><strong className="text-gray-900 dark:text-white">{tools.length}</strong>{t('home.toolCount')}</span>
            <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <span className="text-green-600 dark:text-green-400 font-medium">{t('home.free')}</span>
          </div>
        </div>
      </section>

      {/* Category Tabs + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
          {CATEGORIES.map(({ key }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              {t(`home.categories.${key}`)}
            </button>
          ))}
        </div>

        {/* Tool Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <div className="text-5xl mb-4">🔍</div>
            <p>{t('home.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                locale={locale}
                title={t(`tools.${tool.slug}.title`)}
                desc={t(`tools.${tool.slug}.desc`)}
                comingSoon={t('home.comingSoon')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
