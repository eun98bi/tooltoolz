import Link from 'next/link'
import { Tool, CATEGORY_STYLE } from '@/lib/tools'

interface ToolCardProps {
  tool: Tool
  locale: string
  title: string
  desc: string
  comingSoon: string
}

export default function ToolCard({ tool, locale, title, desc, comingSoon }: ToolCardProps) {
  const style = CATEGORY_STYLE[tool.category]

  const content = (
    <div
      className={`group relative flex flex-col gap-3 p-5 rounded-2xl border bg-white dark:bg-gray-900 transition-all duration-200 ${
        tool.implemented
          ? 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : 'border-gray-100 dark:border-gray-800 opacity-70'
      }`}
    >
      {/* Category top stripe */}
      <div className={`absolute top-0 left-5 right-5 h-0.5 rounded-b-full ${style.text.replace('text-', 'bg-').split(' ')[0]}`} />

      <div className="flex items-start justify-between gap-2">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${style.bg} ${style.text}`}
        >
          {tool.icon}
        </div>
        {!tool.implemented && (
          <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {comingSoon}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{desc}</p>
      </div>

      <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
        {tool.category}
      </span>
    </div>
  )

  if (!tool.implemented) return content

  return (
    <Link href={`/${locale}/tools/${tool.slug}`} className="block">
      {content}
    </Link>
  )
}
