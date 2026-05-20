import Link from 'next/link'

interface ToolPageProps {
  locale: string
  backLabel: string
  children: React.ReactNode
}

export default function ToolPage({ locale, backLabel, children }: ToolPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
      >
        {backLabel}
      </Link>
      {children}
    </div>
  )
}
