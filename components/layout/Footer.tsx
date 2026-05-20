'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400">tool</span>toolz
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('tagline')}</p>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href={`/${locale}`} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('tools')}
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} tooltoolz. {t('rights')}
        </p>
      </div>
    </footer>
  )
}
