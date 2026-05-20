import { MetadataRoute } from 'next'
import { tools } from '@/lib/tools'

const BASE_URL = 'https://tooltoolz.com'
const locales = ['kr', 'en'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        ko: `${BASE_URL}/kr`,
        en: `${BASE_URL}/en`,
      },
    },
  }))

  const toolEntries: MetadataRoute.Sitemap = tools.flatMap(({ slug }) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          ko: `${BASE_URL}/kr/tools/${slug}`,
          en: `${BASE_URL}/en/tools/${slug}`,
        },
      },
    }))
  )

  return [...homeEntries, ...toolEntries]
}
