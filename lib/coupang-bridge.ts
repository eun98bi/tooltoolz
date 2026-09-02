import { promises as fs } from 'fs'
import path from 'path'

export type CoupangBridgeData = {
  slug: string
  title: string
  price: string
  imageUrl: string
  deepLink: string
  sourceUrl: string
  publishedAt: string
}

export async function getCoupangBridge(slug: string): Promise<CoupangBridgeData | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'coupang', `${slug}.json`)
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw) as CoupangBridgeData
  } catch {
    return null
  }
}

export async function listCoupangBridges(): Promise<CoupangBridgeData[]> {
  const dir = path.join(process.cwd(), 'data', 'coupang')
  try {
    const files = await fs.readdir(dir)
    const items = await Promise.all(
      files
        .filter((f) => f.endsWith('.json'))
        .map(async (f) => {
          const raw = await fs.readFile(path.join(dir, f), 'utf-8')
          return JSON.parse(raw) as CoupangBridgeData
        })
    )
    return items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  } catch {
    return []
  }
}
